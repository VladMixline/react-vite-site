import process from 'node:process'
import { loadLocalEnv } from './env-loader.mjs'

loadLocalEnv()

const botToken = process.env.TELEGRAM_BOT_TOKEN

if (!botToken) {
  console.error('TELEGRAM_BOT_TOKEN is not set in .env.local or environment variables.')
  process.exit(1)
}

const response = await fetch(`https://api.telegram.org/bot${botToken}/getUpdates`)
const payload = await response.json()

if (!response.ok || !payload?.ok) {
  console.error('Failed to fetch bot updates from Telegram.')
  process.exit(1)
}

const chats = new Map()

for (const update of payload.result ?? []) {
  const chat = update.message?.chat ?? update.channel_post?.chat

  if (!chat) {
    continue
  }

  chats.set(chat.id, {
    id: chat.id,
    title: [chat.first_name, chat.last_name].filter(Boolean).join(' ') || chat.title || 'Unknown chat',
    username: chat.username ? `@${chat.username}` : 'without username',
    type: chat.type,
  })
}

if (chats.size === 0) {
  console.log('No chats found yet. Open your bot in Telegram, send /start, then run this command again.')
  process.exit(0)
}

console.log('Available chats for TELEGRAM_CHAT_ID:')

for (const chat of chats.values()) {
  console.log(`- ${chat.id} | ${chat.title} | ${chat.username} | ${chat.type}`)
}
