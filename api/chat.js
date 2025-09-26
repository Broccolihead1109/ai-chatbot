// api/chat.js — DEBUG VERSION (deploy this temporarily)
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  try {
    // Basic method check
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // Log whether the env var is present (shows in Vercel logs)
    console.log("OPENAI_API_KEY present:", !!process.env.OPENAI_API_KEY);

    const { messages } = req.body;
    if (!messages || !messages.length) {
      return res.status(400).json({ error: "No messages provided" });
    }

    // Forward to OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
    });

    // Return the assistant text
    const reply = completion.choices?.[0]?.message?.content || null;
    if (reply) return res.status(200).json({ reply, raw: completion });

    // If no reply, return full response object
    return res.status(200).json({ reply: null, raw: completion });

  } catch (err) {
    // Log the whole error to Vercel logs
    console.error("OpenAI error (full):", err);

    // If this is an OpenAI library error it may contain response and status
    // Return the important bits to the frontend so you can see what's happening
    const errorToReturn = {
      message: err.message,
      name: err.name,
      status: err.status || (err.response && err.response.status) || null,
      details: err.response && err.response.data ? err.response.data : null
    };

    return res.status(500).json({ error: "AI API request failed", errorToReturn });
  }
}
