import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { checkBudgetAlert, generateMonthlyReports, processRecurringTransaction, triggerRecurringTransactions } from "@/lib/inngest/functions";

export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: [
        checkBudgetAlert, triggerRecurringTransactions, processRecurringTransaction, generateMonthlyReports
    ],
});