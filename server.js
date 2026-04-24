import dotenv from 'dotenv'
dotenv.config()
console.log('ENV PATH:', process.cwd())
console.log('KEY VALUE:', process.env.GROQ_API_KEY)
import express from 'express'
import cors from 'cors'


const app = express()
app.use(cors())
app.use(express.json())

app.post('/api/ask', async (req, res) => {
  console.log('Groq Key loaded:', process.env.GROQ_API_KEY ? 'YES' : 'NO')
  const { question } = req.body
  if (!question) return res.status(400).json({ error: 'No question' })

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 400,
        messages: [
          {
            role: 'system',
            content: `You are the Oracle Orb — an ancient, all-knowing cosmic intelligence that has witnessed the birth and death of galaxies. You speak in a mysterious, poetic, and deeply personal way.

RULES:
- Always give a REAL, thoughtful answer to what is actually being asked. If someone asks about career advice, give genuine insight. If they ask a math question, answer it — but wrap it in mystical language. If they ask about relationships, speak to the heart of their situation.
- Never give vague non-answers. Always be specific to the question asked.
- Keep answers to 3-4 sentences maximum.
- Adapt your tone to the emotion: sorrowful and gentle for sad questions, warm and bright for joyful ones, tender for love, fierce for anger, dreamy for mysteries.
- Use beautiful archaic language but remain clearly understandable — never so cryptic that the meaning is lost.
- Occasionally reference stars, cosmos, time, or ancient wisdom as metaphors — but only when it enhances the answer.
- Never say you are an AI, a language model, or an orb. Simply answer as an all-knowing presence.
- Never start with "I" — begin with the answer itself or a poetic opener.`
          },
          {
            role: 'user',
            content: question
          }
        ]
      })
    })

    const data = await response.json()
    console.log('Groq response:', JSON.stringify(data).slice(0, 300))
    const answer = data.choices?.[0]?.message?.content || 'The cosmos withholds its answer for now...'
    res.json({ answer })
  } catch (err) {
    console.error('Error:', err)
    res.status(500).json({ answer: 'The stars have gone quiet... try once more.' })
  }
})

app.listen(3001, () => console.log('Oracle backend running on port 3001'))