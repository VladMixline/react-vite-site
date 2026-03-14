import { watch } from 'node:fs'
import { spawn } from 'node:child_process'
import path from 'node:path'
import process from 'node:process'

const rootDir = process.cwd()
const isWindows = process.platform === 'win32'
const gitCommand = isWindows ? 'git.exe' : 'git'
const commitDelayMs = 3000
const ignoredDirectories = new Set(['.git', 'node_modules', 'dist'])

let syncTimer
let syncInProgress = false
let syncQueued = false

function log(message) {
  console.log(`[autosave] ${message}`)
}

function toText(value) {
  return value.toString().trim()
}

function buildGitIdentityEnv(name, email) {
  return {
    GIT_AUTHOR_NAME: name,
    GIT_AUTHOR_EMAIL: email,
    GIT_COMMITTER_NAME: name,
    GIT_COMMITTER_EMAIL: email,
  }
}

function isIgnored(filePath = '') {
  if (!filePath) {
    return true
  }

  const normalizedPath = filePath.replaceAll('\\', '/')
  return normalizedPath
    .split('/')
    .some((segment) => ignoredDirectories.has(segment))
}

function run(command, args, extraEnv = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: rootDir,
      env: { ...process.env, ...extraEnv },
      stdio: ['ignore', 'pipe', 'pipe'],
    })

    let stdout = ''
    let stderr = ''

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString()
    })

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString()
    })

    child.on('error', reject)
    child.on('close', (code) => {
      resolve({
        code: code ?? 1,
        stdout: stdout.trim(),
        stderr: stderr.trim(),
      })
    })
  })
}

async function readGitValue(args) {
  const response = await run(gitCommand, args)

  if (response.code !== 0) {
    return ''
  }

  return response.stdout.trim()
}

async function getGitIdentityEnv() {
  const fallback = buildGitIdentityEnv(
    'Cursor Auto Save',
    'cursor-auto-save@local',
  )

  const [configuredName, configuredEmail] = await Promise.all([
    readGitValue(['config', '--get', 'user.name']),
    readGitValue(['config', '--get', 'user.email']),
  ])

  if (configuredName && configuredEmail) {
    return buildGitIdentityEnv(configuredName, configuredEmail)
  }

  const lastCommitIdentity = await readGitValue(['log', '-1', '--format=%an|%ae'])

  if (!lastCommitIdentity.includes('|')) {
    return fallback
  }

  const [name, email] = lastCommitIdentity.split('|')

  if (!name || !email) {
    return fallback
  }

  return buildGitIdentityEnv(name, email)
}

async function pushCurrentBranch() {
  const origin = await run(gitCommand, ['remote', 'get-url', 'origin'])

  if (origin.code !== 0) {
    return {
      code: 1,
      stdout: '',
      stderr: 'Remote "origin" is not configured.',
    }
  }

  const upstream = await run(gitCommand, [
    'rev-parse',
    '--abbrev-ref',
    '--symbolic-full-name',
    '@{u}',
  ])

  if (upstream.code === 0) {
    return run(gitCommand, ['push'])
  }

  const branch = await run(gitCommand, ['branch', '--show-current'])
  const branchName = branch.stdout || 'main'

  return run(gitCommand, ['push', '-u', 'origin', branchName])
}

async function saveChanges() {
  if (syncInProgress) {
    syncQueued = true
    return
  }

  syncInProgress = true

  try {
    const status = await run(gitCommand, ['status', '--porcelain'])

    if (status.code !== 0) {
      log('Git repository is not ready yet.')
      return
    }

    if (!status.stdout) {
      return
    }

    log('Detected changes. Creating auto-save commit...')

    const addResult = await run(gitCommand, ['add', '-A'])
    if (addResult.code !== 0) {
      log(`git add failed: ${addResult.stderr || addResult.stdout}`)
      return
    }

    const identityEnv = await getGitIdentityEnv()
    const timestamp = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z')
    const commitResult = await run(
      gitCommand,
      ['commit', '-m', `chore: auto save ${timestamp}`],
      identityEnv,
    )

    const commitOutput = [commitResult.stdout, commitResult.stderr]
      .filter(Boolean)
      .join('\n')

    if (commitResult.code !== 0) {
      if (commitOutput.includes('nothing to commit')) {
        return
      }

      log(`git commit failed: ${commitOutput}`)
      return
    }

    const pushResult = await pushCurrentBranch()

    if (pushResult.code === 0) {
      log('Commit pushed to GitHub.')
      return
    }

    const pushOutput = [pushResult.stdout, pushResult.stderr].filter(Boolean).join('\n')
    log(`Commit created, but push failed: ${pushOutput}`)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    log(`Unexpected error: ${message}`)
  } finally {
    syncInProgress = false

    if (syncQueued) {
      syncQueued = false
      queueSave()
    }
  }
}

function queueSave(trigger = 'manual') {
  clearTimeout(syncTimer)
  syncTimer = setTimeout(() => {
    void saveChanges()
  }, commitDelayMs)

  log(`Scheduled auto-save after ${trigger}.`)
}

watch(
  rootDir,
  { recursive: true },
  (_, fileName) => {
    const changedPath = typeof fileName === 'string' ? fileName : toText(fileName ?? '')

    if (!changedPath || isIgnored(changedPath)) {
      return
    }

    queueSave(changedPath)
  },
)

log(`Watching ${path.basename(rootDir)} for file changes...`)
process.stdin.resume()
