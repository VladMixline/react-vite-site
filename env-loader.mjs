import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const envFiles = ['.env.local', '.env']

export function loadLocalEnv() {
  for (const fileName of envFiles) {
    const filePath = path.join(process.cwd(), fileName)

    if (!existsSync(filePath)) {
      continue
    }

    const fileContent = readFileSync(filePath, 'utf8')

    for (const line of fileContent.split(/\r?\n/)) {
      const trimmedLine = line.trim()

      if (!trimmedLine || trimmedLine.startsWith('#') || !trimmedLine.includes('=')) {
        continue
      }

      const separatorIndex = trimmedLine.indexOf('=')
      const key = trimmedLine.slice(0, separatorIndex).trim()
      const rawValue = trimmedLine.slice(separatorIndex + 1).trim()

      if (!key || process.env[key]) {
        continue
      }

      process.env[key] = stripQuotes(rawValue)
    }
  }
}

function stripQuotes(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1)
  }

  return value
}
