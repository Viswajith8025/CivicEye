import logger from "../utilies/logger.js";

export function ruleBasedSummary(description, type, severity) {
  const preview = description.slice(0, 120);
  return `${severity} priority ${type} report: ${preview}${description.length > 120 ? "..." : ""}`;
}

export async function generateReportSummary({ description, type, severity, location }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return ruleBasedSummary(description, type, severity);
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        temperature: 0.3,
        max_tokens: 120,
        messages: [
          {
            role: "system",
            content:
              "You summarize civic issue reports for municipal staff. Be concise (max 2 sentences), factual, and actionable.",
          },
          {
            role: "user",
            content: `Type: ${type}\nSeverity: ${severity}\nLocation: ${location}\nDescription: ${description}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI HTTP ${response.status}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content?.trim();
    return text || ruleBasedSummary(description, type, severity);
  } catch (error) {
    logger.warn({ err: error.message }, "AI summary fallback to rules");
    return ruleBasedSummary(description, type, severity);
  }
}
