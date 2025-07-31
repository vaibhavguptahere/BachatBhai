import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import { db } from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";

const openai = new OpenAI({
  apiKey: process.env.PERPLEXITY_API_KEY,
  baseURL: "https://api.perplexity.ai",
});

const SYSTEM_PROMPT = `
You are an intent extractor. Your job is to receive natural language questions and convert them to structured JSON instructions.

Never answer questions. Only return a JSON object in this format:

{
  "action": "aggregate_transaction_sum" | "list_transactions" | "get_account_balance",
  "filters": {
    "category": "<optional string>",
    "date_gte": "YYYY-MM-DD",
    "date_lte": "YYYY-MM-DD"
  }
}

Handle synonyms like:
- "expenses", "spending", "spend" → aggregate_transaction_sum
- "transactions", "purchases", "bills" → list_transactions
- "money left", "balance", "account balance" → get_account_balance

If no date is mentioned, assume current month.
If the category isn't obvious, omit it.

NEVER include explanations or anything except valid JSON.
`;

function getCurrentMonthDateRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return {
    date_gte: start.toISOString().slice(0, 10),
    date_lte: end.toISOString().slice(0, 10),
  };
}

export async function POST(req) {
  const { userId } = getAuth(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { question } = await req.json();
  if (!question) return NextResponse.json({ error: "Missing question" }, { status: 400 });

  try {
    const completion = await openai.chat.completions.create({
      model: "sonar",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: question },
      ],
    });

    const rawContent = completion.choices[0].message.content.trim();

    let intent;
    try {
      intent = JSON.parse(rawContent);
    } catch (err) {
      return NextResponse.json({
        error: "Invalid JSON from AI",
        rawContent,
      }, { status: 500 });
    }

    const { action, filters = {} } = intent;
    const { category } = filters;
    const { date_gte, date_lte } = {
      ...getCurrentMonthDateRange(),
      ...filters,
    };

    if (action === "aggregate_transaction_sum") {
      const result = await db.transaction.aggregate({
        _sum: { amount: true },
        where: {
          userId,
          ...(category && { category }),
          date: {
            gte: new Date(date_gte),
            lte: new Date(date_lte),
          },
        },
      });

      const amount = result._sum.amount ?? 0;
      return NextResponse.json({
        answer:
          amount === 0
            ? `You have no spending${category ? ` in ${category}` : ""} from ${date_gte} to ${date_lte}.`
            : `You spent ₹${amount.toFixed(2)}${category ? ` on ${category}` : ""} between ${date_gte} and ${date_lte}.`,
      });
    }

    if (action === "list_transactions") {
      const transactions = await db.transaction.findMany({
        where: {
          userId,
          ...(category && { category }),
          date: {
            gte: new Date(date_gte),
            lte: new Date(date_lte),
          },
        },
        orderBy: { date: "desc" },
        take: 10,
      });

      if (transactions.length === 0) {
        return NextResponse.json({
          answer: `You have no transactions${category ? ` in ${category}` : ""} between ${date_gte} and ${date_lte}.`,
        });
      }

      const summary = transactions
        .map(t => `${t.date.toISOString().split("T")[0]} - ₹${t.amount} for ${t.description || "No description"}`)
        .join("\n");

      return NextResponse.json({
        answer: `Here are your recent transactions${category ? ` for ${category}` : ""}:\n${summary}`,
      });
    }

    if (action === "get_account_balance") {
      const accounts = await db.account.findMany({ where: { userId } });

      if (accounts.length === 0) {
        return NextResponse.json({ answer: "You don't have any linked accounts." });
      }

      const total = accounts.reduce((acc, curr) => acc + (curr.balance ?? 0), 0);

      return NextResponse.json({
        answer: `Your total account balance is ₹${total.toFixed(2)}.`,
      });
    }

    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  } catch (error) {
    console.error("AI assistant error:", error);
    return NextResponse.json({ error: "Internal error occurred." }, { status: 500 });
  }
}
