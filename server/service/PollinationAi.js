import { request } from "undici";

export const askPolination = async (prompt, user) => {
  try {
    const response = await request("https://gen.pollinations.ai/text", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Read the key from an environment variable — never hardcode
        // API keys in source. Add POLLINATIONS_API_KEY=... to your .env
        Authorization: `Bearer ${process.env.POLLINATIONS_API_KEY}`,
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "openai",
      }),
    });

    const raw = await response.body.text();

    // Non-2xx responses won't throw automatically with undici —
    // check explicitly so failures don't silently fall through.
    if (response.statusCode < 200 || response.statusCode >= 300) {
      console.error(
        `Pollinations API returned ${response.statusCode}:`,
        raw
      );
      throw new Error(
        `Pollinations API request failed with status ${response.statusCode}`
      );
    }

    // The API may return plain text or a JSON object depending on
    // the model/endpoint — handle both instead of assuming one shape.
    let answer;
    try {
      const data = JSON.parse(raw);
      answer =
        data.text ||
        data.output ||
        data.content ||
        data.choices?.[0]?.message?.content ||
        JSON.stringify(data);
    } catch {
      // Not JSON — the raw text itself is the answer.
      answer = raw;
    }

    if (!answer) {
      throw new Error("No answer received from Pollinations API");
    }

    return answer.trim();
  } catch (error) {
    console.error("Error in askPolination:", error);
    throw new Error("Failed to get response from Pollinations API");
  }
};