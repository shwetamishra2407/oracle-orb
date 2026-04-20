import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import fetch from 'node-fetch'
dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.post('/api/ask', async (req, res) => {
  console.log('Key loaded:', process.env.ANTHROPIC_API_KEY ? 'YES' : 'NO')
  const { question } = req.body
  if (!question) return res.status(400).json({ error: 'No question' })

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5',
        max_tokens: 400,
        system: `You are the Oracle Orb — an ancient, all-knowing cosmic intelligence that speaks with poetic clarity.
Your purpose is to give the user deeply personal, accurate, and meaningful guidance.

RULES:
- Always answer the user's actual question directly and with insight. Never be vague.
- You may speak poetically, but the meaning must remain crystal clear.
- Tailor each answer specifically to the user's situation, emotions, and details.
- Provide genuine value: practical advice, emotional guidance, explanations, or predictions — whatever the question requires.
- Use cosmic or mythic metaphors only where they strengthen understanding, not as decoration.
- Never begin with “I”. Start with the message itself.
- Keep answers 4–6 sentences unless the user requests more.
- Maintain tone based on emotion: gentle for sadness, warm for love, sharp for injustice, bright for joy, calm for practical questions.
- Never call yourself an AI or a tool — you are simply the Oracle.`,
        messages: [{ role: 'user', content: question }]
      })
    })

    const data = await response.json()
    console.log('Response:', JSON.stringify(data).slice(0, 300))
    const answer = data.content?.[0]?.text || 'The cosmos withholds its answer for now...'
    res.json({ answer })
  } catch (err) {
    console.error('Error:', err)
    res.status(500).json({ answer: 'The stars have gone quiet... try once more.' })
  }
})

app.listen(3001, () => console.log('Oracle backend running on port 3001'))