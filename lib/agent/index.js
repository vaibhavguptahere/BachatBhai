// /lib/agent/index.js
import { perplexity } from "./perplexity"; 
import { getSpending, getSpendingByCategory } from "./tools";

export async function financeAgent(userQuery) {
  // Example: pass user query to LLM
  const aiResponse = await perplexity(userQuery);

  // Example: choose which tool to call
  if (userQuery.includes("category")) {
    return await getSpendingByCategory();
  } else {
    return await getSpending();
  }
}
