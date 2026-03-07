import { createServer } from 'node:http'
import process from 'node:process'
import { loadLocalEnv } from './env-loader.mjs'

loadLocalEnv()

const port = Number(process.env.TELEGRAM_API_PORT || 8787)

const server = createServer(async (request, response) => {
  if (request.method === 'OPTIONS') {
    writeCorsHeaders(response)
    response.writeHead(204)
    response.end()
    return
  }

  if (request.url !== '/api/telegram-rsvp') {
    sendJson(response, 404, { error: 'Not found.' })
    return
  }

  if (request.method !== 'POST') {
    sendJson(response, 405, { error: 'Method not allowed.' })
    return
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!botToken || !chatId) {
    sendJson(response, 503, {
      error: 'Telegram is not configured yet.',
      code: 'telegram_not_configured',
    })
    return
  }

  try {
    const body = await readJsonBody(request)
    const messageText = typeof body?.text === 'string' ? body.text.trim() : ''

    if (!messageText) {
      sendJson(response, 400, {
        error: 'Message text is required.',
        code: 'invalid_payload',
      })
      return
    }

    const telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: messageText,
      }),
    })

    const telegramPayload = await telegramResponse.json().catch(() => null)

    if (!telegramResponse.ok || !telegramPayload?.ok) {
      sendJson(response, 502, {
        error: 'Telegram API rejected the message.',
        code: 'telegram_send_failed',
      })
      return
    }

    sendJson(response, 200, { ok: true })
  } catch (error) {
    sendJson(response, 500, {
      error: error instanceof Error ? error.message : 'Unexpected server error.',
      code: 'server_error',
    })
  }
})

server.listen(port, () => {
  console.log(`[telegram-api] Listening on http://127.0.0.1:${port}`)
})

function writeCorsHeaders(response) {
  response.setHeader('Access-Control-Allow-Origin', '*')
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

function sendJson(response, statusCode, payload) {
  writeCorsHeaders(response)
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
  })
  response.end(JSON.stringify(payload))
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    let body = ''

    request.on('data', (chunk) => {
      body += chunk.toString()
    })

    request.on('end', () => {
      if (!body) {
        resolve({})
        return
      }

      try {
        resolve(JSON.parse(body))
      } catch (error) {
        reject(error)
      }
    })

    request.on('error', reject)
  })
}
