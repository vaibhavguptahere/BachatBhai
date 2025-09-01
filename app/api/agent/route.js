import { financeAgent } from "@/lib/agent";

export async function POST(req) {
  try {
    const { question } = await req.json(); // ✅ match frontend payload
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

// (Optional) for testing in browser
export async function GET() {
  return new Response("Agent API running ✅", { status: 200 });
}
