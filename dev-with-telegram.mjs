import { spawn } from 'node:child_process'
import process from 'node:process'

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const children = []

function startProcess(args) {
  const child = spawn(npmCommand, args, {
    cwd: process.cwd(),
    stdio: 'inherit',
    shell: process.platform === 'win32',
  })

  children.push(child)

  child.on('exit', (code) => {
    for (const runningChild of children) {
      if (runningChild.pid && !runningChild.killed) {
        runningChild.kill('SIGINT')
      }
    }
    process.exit(code ?? 0)
  })
}

process.on('SIGINT', () => {
  for (const child of children) {
    if (child.pid && !child.killed) {
      child.kill('SIGINT')
    }
  }
  process.exit(0)
})

console.log('[dev] Starting Telegram API and Vite...')
startProcess(['run', 'telegram-api'])
startProcess(['run', 'dev:site'])
