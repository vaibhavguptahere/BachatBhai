import { financeAgent } from "@/lib/agent";

export async function POST(req) {
  try {
    const { question } = await req.json();
    const answer = await financeAgent(question);

    return new Response(JSON.stringify({ answer }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Agent error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}