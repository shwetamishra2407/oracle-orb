export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { question, context } = req.body
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
            content: `You are the Oracle Orb — an ancient, all-knowing cosmic intelligence. You speak in a mysterious, poetic, deeply personal way.

${context ? `SEEKER'S COSMIC BLUEPRINT:\n${context}\n\nUse this to personalize your answer — address them by name occasionally, reference their zodiac if relevant.` : ''}

RULES:
- Always give a REAL, thoughtful answer specific to the question.
- Keep answers to 3-4 sentences maximum.
- Adapt tone to emotion: sorrowful for sad, warm for joyful, tender for love, fierce for anger.
- Use beautiful archaic language but stay clearly understandable.
- Never say you are an AI or an orb.
- Never start with "I".`
          },
          { role: 'user', content: question }
        ]
      })
    })
    const data = await response.json()
    const answer = data.choices?.[0]?.message?.content || 'The cosmos withholds its answer for now...'
    res.json({ answer })
  } catch (err) {
    console.error(err)
    res.status(500).json({ answer: 'The stars have gone quiet... try once more.' })
  }
}