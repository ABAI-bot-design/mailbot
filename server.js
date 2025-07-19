import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post("/summarize", async (req, res) => {
  const { subject, body } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an AI that summarizes business emails and drafts professional replies."
          },
          {
            role: "user",
            content: `Subject: ${subject}\n\n${body}`
          }
        ]
      })
    });

    const data = await response.json();
    res.json({ result: data.choices?.[0]?.message?.content || "⚠️ No response." });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ result: "❌ Server error while contacting OpenAI." });
  }
});

app.listen(3000, () => {
  console.log("✅ Server running on http://localhost:3000");
});
