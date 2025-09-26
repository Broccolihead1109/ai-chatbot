// api/chat.js
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // <- your OpenAI key here
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "No message provided" });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // or "gpt-4" if you have access
      messages: [
        { role: "user", content: message }
      ],
    });

    const reply = completion.choices?.[0]?.message?.content || "No response";
    res.status(200).json({ reply });
  } catch (err) {
    console.error("OpenAI API error:", err);
    res.status(500).json({ error: "AI API request failed" });
  }
}
