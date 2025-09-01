export async function perplexity(query) {
  const res = await fetch("https://api.perplexity.ai/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "sonar", // or another free-tier compatible model
      messages: [
        { role: "user", content: query }
      ],
      temperature: 0.2,
      max_tokens: 500
      // Do NOT include response_format: it's disallowed in Tier 0
    })
  });

  const data = await res.json();
  console.log("PERPLEXITY API RESPONSE:", data);

  // If response contains the standard OpenAI-like structure:
  if (data.choices?.[0]?.message?.content) {
    return data.choices[0].message.content;
  }

  // Handle API errors gracefully:
  if (data.error?.message) {
    throw new Error(`Perplexity API error: ${data.error.message}`);
  }

  throw new Error("Unexpected Perplexity API response structure: " + JSON.stringify(data));
}
