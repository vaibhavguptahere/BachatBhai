import { getIncomeAndExpense, getSpendingByCategory } from "./tools";

export async function financeAgent(userQuery) {
  const query = userQuery.toLowerCase();

  // Extract account if mentioned
  let accountName = null;
  const accountMatch = query.match(/for (\w+) account/);
  if (accountMatch) accountName = accountMatch[1];

  try {
    if (query.includes("category") || query.includes("per category")) {
      return await getSpendingByCategory({ dateQuery: query, accountName });
    }

    if (query.includes("income") && !query.includes("expense")) {
      const result = await getIncomeAndExpense({ dateQuery: query, accountName });
      return result.split("\n")[0];
    }

    if (query.includes("expense") && !query.includes("income")) {
      const result = await getIncomeAndExpense({ dateQuery: query, accountName });
      return result.split("\n")[1];
    }

    return await getIncomeAndExpense({ dateQuery: query, accountName });
  } catch (err) {
    console.error("FinanceAgent Error:", err);
    return "Unable to fetch financial data.";
  }
}
