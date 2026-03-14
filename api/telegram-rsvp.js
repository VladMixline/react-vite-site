/**
 * Vercel Serverless Function for Telegram RSVP.
 * Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in Vercel project environment variables.
 */
import process from 'node:process'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!botToken || !chatId) {
    return res.status(503).json({
      error: 'Telegram is not configured yet.',
      code: 'telegram_not_configured',
    })
  }

  const body = req.body || {}
  const messageText = typeof body.text === 'string' ? body.text.trim() : ''

  if (!messageText) {
    return res.status(400).json({
      error: 'Message text is required.',
      code: 'invalid_payload',
    })
  }

  try {
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: messageText }),
      }
    )

    const telegramPayload = await telegramResponse.json().catch(() => null)

    if (!telegramResponse.ok || !telegramPayload?.ok) {
      return res.status(502).json({
        error: 'Telegram API rejected the message.',
        code: 'telegram_send_failed',
      })
    }

    return res.status(200).json({ ok: true })
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Unexpected server error.',
      code: 'server_error',
    })
  }
}
