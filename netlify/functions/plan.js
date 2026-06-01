// Serverless function: builds a travel itinerary with Claude.
// Your API key lives in the Netlify environment (ANTHROPIC_API_KEY) and is
// NEVER sent to the browser.

const MODEL = "claude-3-5-sonnet-latest";

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Use POST." });
  }

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return json(500, { error: "Server not configured: ANTHROPIC_API_KEY is missing. Add it in Netlify, then redeploy." });
  }

  let input;
  try { input = JSON.parse(event.body || "{}"); }
  catch (e) { return json(400, { error: "Bad request body." }); }

  const origin = (input.origin || "").toString().slice(0, 80);
  const destination = (input.destination || "").toString().slice(0, 80);
  const days = Math.max(1, Math.min(30, parseInt(input.days, 10) || 5));
  const budget = Math.max(0, parseInt(input.budget, 10) || 0);
  const currency = (input.currency || "CAD").toString().slice(0, 5);
  const interests = (input.interests || "").toString().slice(0, 300);
  const pace = (input.pace || "balanced").toString().slice(0, 20);
  const party = Math.max(1, Math.min(20, parseInt(input.party, 10) || 1));

  if (!destination) return json(400, { error: "Please enter a destination." });

  const prompt = buildPrompt({ origin, destination, days, budget, currency, interests, pace, party });

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 3000,
        messages: [{ role: "user", content: prompt }]
      })
    });

    if (!res.ok) {
      const txt = await res.text();
      return json(502, { error: "AI request failed (" + res.status + ").", detail: txt.slice(0, 300) });
    }

    const data = await res.json();
    const text = (data.content && data.content[0] && data.content[0].text) || "";
    const plan = extractJson(text);
    if (!plan) return json(502, { error: "Could not parse the itinerary. Try again." });

    return json(200, plan);
  } catch (e) {
    return json(500, { error: "Unexpected error: " + e.message });
  }
};

function buildPrompt(t) {
  return [
    "You are an expert travel planner. Build a realistic, budget-aware, day-by-day itinerary.",
    "",
    "TRIP:",
    "- From: " + (t.origin || "(not specified)"),
    "- To: " + t.destination,
    "- Length: " + t.days + " days",
    "- Total budget: " + t.budget + " " + t.currency + " for the WHOLE trip, " + t.party + " traveller(s)",
    "- Interests: " + (t.interests || "general sightseeing"),
    "- Pace: " + t.pace,
    "",
    "RULES:",
    "- Keep the estimated grand total at or under the budget. If too low, get as close as possible and say so in the summary.",
    "- Costs are realistic estimates in " + t.currency + ", covering all " + t.party + " traveller(s) combined for each item.",
    "- Include flights (origin to destination and back), lodging, food, attractions, and at least a couple of events/experiences matched to the interests.",
    "- Tailor everything to the interests and pace. 'relaxed' = fewer items per day; 'packed' = more.",
    "- Do NOT invent booking URLs. Just give names and a short 'bookQuery' search phrase.",
    "",
    "Respond with ONLY valid JSON (no markdown, no commentary) in exactly this shape:",
    "{",
    '  "summary": "2-3 sentence overview, mention if budget is tight",',
    '  "currency": "' + t.currency + '",',
    '  "totalEstimate": <number>,',
    '  "budgetBreakdown": { "flights": <n>, "lodging": <n>, "food": <n>, "activities": <n> },',
    '  "days": [',
    '    { "day": 1, "title": "short title", "items": [',
    '       { "type": "flight|hotel|restaurant|attraction|event", "name": "...", "detail": "short note", "cost": <number>, "bookQuery": "search phrase" }',
    "    ] }",
    "  ]",
    "}"
  ].join("\n");
}

function extractJson(text) {
  if (!text) return null;
  let s = text.trim().replace(/^```(json)?/i, "").replace(/```$/, "").trim();
  const start = s.indexOf("{");
  const end = s.lastIndexOf("}");
  if (start === -1 || end === -1) return null;
  try { return JSON.parse(s.slice(start, end + 1)); }
  catch (e) { return null; }
}

function json(status, obj) {
  return {
    statusCode: status,
    headers: { "content-type": "application/json", "access-control-allow-origin": "*" },
    body: JSON.stringify(obj)
  };
}
