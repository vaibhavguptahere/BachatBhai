"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { _includes } from "zod/v4/core";
import { date } from "zod";

const serializeTransaction = (obj) => {
    const serialized = { ...obj };

    if (obj.balance) {
        serialized.balance = obj.balance.toNumber();
    }

    if (obj.amount) {
        serialized.amount = obj.amount.toNumber();
    }
    return serialized;
};

// Defining Function to create the account
export async function createAccount(data) {

    try {
        const { userId } = await auth();
        if (!userId) {
            throw new Error("Unauthorised");
        }
        const user = await db.user.findUnique({
            where: { clerkUserId: userId }
        });


        //  Convert balance to float before saving
        const balanceFloat = parseFloat(data.balance);
        if (isNaN(balanceFloat)) {
            throw new Error("Invalid Balance Amount");
        }

        // Check if this is the user's first account
        const existingAccounts = await db.account.findMany({
            where: { userId: user.id },
        });

        const shouldBeDefault = existingAccounts.length === 0 ? true : data.isDefault;

        // if this account should be default, unset other default accounts
        if (shouldBeDefault) {
            await db.account.updateMany({
                where: { userId: user.id, isDefault: true },
                data: { isDefault: false }
            });
        }

        const account = await db.account.create({
            data: {
                ...data,
                balance: balanceFloat,
                userId: user.id,
                isDefault: shouldBeDefault
            },
        });

        const serializeAccount = serializeTransaction(account);

        revalidatePath("/dashboard");

        return { success: true, data: serializeAccount };

    } catch (error) {
        throw new Error(error.message);
    }
}

// Defining Function to Get User Account on the dashboard

export async function getUserAccounts() {

    const { userId } = await auth();
    if (!userId) {
        throw new Error("Unauthorised");
    }
    const user = await db.user.findUnique({
        where: { clerkUserId: userId }
    });

    if (!user) {
        throw new Error("User not found")
    }

    const accounts = await db.account.findMany({
        where: { userId: user.Id },
        orderBy: { createdAt: "desc" },
        include: {
            _count: {
                select: {
                    transactions: true,

                }
            }
        }
    });

    const serializeAccount = accounts.map(serializeTransaction);
    return serializeAccount;

}


export async function getDashboardData() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId
        },
    });

    if (!user) {
        throw new Error("User not found");
    }

    // Get all the users transactions
    const transactions = await db.transaction.findMany({
        where: { userId: user.id, },
        orderBy: { date: "desc" },
    })


    return transactions.map(serializeTransaction);
}