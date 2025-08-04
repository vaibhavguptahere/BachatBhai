"use server"
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
const serializeDecimal = (obj) => {
    const serialized = { ...obj };
    if (obj.balance) {
        serialized.balance = obj.balance.toNumber();
    }
    if (obj.amount) {
        serialized.amount = obj.amount.toNumber();
    }
    return serialized;
};

export async function updateDefaultAccount(accountId) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });

        if (!user) {
            throw new Error("User not found");
        }

        // First, unset any existing default account
        await db.account.updateMany({
            where: {
                userId: user.id,
                isDefault: true,
            },
            data: { isDefault: false },
        });

        // Then set the new default account
        const account = await db.account.update({
            where: {
                id: accountId,
                userId: user.id,
            },
            data: { isDefault: true },
        });

        revalidatePath("/dashboard");
        return { success: true, data: serializeDecimal(account) };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function getAccountWithTransactions(accountId) {

    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!user) {
        throw new Error("User not found");
    }

    const account = await db.account.findUnique({
        where: {
            id: accountId,
            userId: user.id,
        },
        include: {
            transactions: {
                orderBy: { createdAt: "desc" },
            },
            _count: {
                select: { transactions: true },
            },
        },
    });

    if (!account) {
        return null;
    }

    return {
        ...serializeDecimal(account),
        transactions: account.transactions.map(serializeDecimal),
        transactionCount: account._count.transactions,
    };
}

export async function bulkDeleteTransactions(transactionIds) {
    try {

        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });

        if (!user) {
            throw new Error("User not found");
        }

        const transactions = await db.transaction.findMany({
            where: {
                id: { in: transactionIds },
                userId: user.id,
            },
        });

        const accountBalanceChanges = transactions.reduce((acc, transaction) => {
            const change =
                transaction.type === "EXPENSE" ? -transaction.amount : transaction.amount;

            acc[transaction.accountId] = (acc[transaction.accountId] || 0) + change;
            return acc;
        }, {});

        // Delete the transactions and update account balances in a transaction
        await db.$transaction(async (tx) => {
            await tx.transaction.deleteMany({
                where: {
                    id: { in: transactionIds },
                    userId: user.id,
                },
            });

            for (const [accountId, balanceChange] of Object.entries(accountBalanceChanges)) {
                await tx.account.update({
                    where: { id: accountId },
                    data: { balance: { increment: balanceChange } },
                });
            }
        });

       revalidatePath(`/account/${id}`);
    }

    catch (error) {
        return { success: false, error: error.message };
    }
}