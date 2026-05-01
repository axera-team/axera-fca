const { DatabaseSync } = require('node:sqlite');
const { EventEmitter } = require('events');

// --- setup ---
const db = new DatabaseSync('messenger.db')

db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    thread_id TEXT NOT NULL,
    sender_id TEXT,
    content TEXT,
    created_at INTEGER,
    raw TEXT
  );

  CREATE INDEX IF NOT EXISTS idx_thread_id ON messages(thread_id);
  CREATE INDEX IF NOT EXISTS idx_created_at ON messages(created_at);
`)

// --- prepared statements ---
const stmt = {
  insert: db.prepare(`
    INSERT OR IGNORE INTO messages (id, thread_id, sender_id, content, created_at, raw)
    VALUES (@id, @threadId, @senderId, @content, @createdAt, @raw)
  `),
  getById: db.prepare(`SELECT * FROM messages WHERE id = ?`),
  getByThread: db.prepare(`
    SELECT * FROM messages WHERE thread_id = ? ORDER BY created_at ASC
  `),
  getByThreadPaged: db.prepare(`
    SELECT * FROM messages WHERE thread_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?
  `)
}

// --- helpers ---
const parse = (row) => row ? { ...row, raw: JSON.parse(row.raw) } : null
const parseAll = (rows) => rows.map(parse)

// --- api ---
const api = {
  getMessage(messageId) {
    return parse(stmt.getById.get(messageId))
  },

  getThreadByID(threadId) {
    return {
      getMessages() {
        return parseAll(stmt.getByThread.all(threadId))
      },
      // if threads get long you'll want this
      getMessagesPaged(limit = 20, offset = 0) {
        return parseAll(stmt.getByThreadPaged.all(threadId, limit, offset))
      }
    }
  }
}

// --- bot event handling ---
const bot = new EventEmitter()

bot.on('message', (msg) => {
  const inserted = stmt.insert.run({
    id: msg.id,
    threadId: msg.threadID,
    senderId: msg.senderID,
    content: msg.body,
    createdAt: msg.timestamp ?? Date.now(),
    raw: JSON.stringify(msg)
  })

  if (inserted.changes === 0) {
    console.log(`[queue] duplicate message ignored: ${msg.id}`)
  }
})

// --- usage ---
// simulate incoming message from your actual messenger API
bot.emit('message', {
  id: 'msg_001',
  threadID: 'thread_abc',
  senderID: 'user_123',
  body: 'hey whats up',
  timestamp: Date.now()
})

bot.emit('message', {
  id: 'msg_001', // duplicate — will be ignored
  threadID: 'thread_abc',
  senderID: 'user_123',
  body: 'hey whats up',
  timestamp: Date.now()
})

bot.emit('message', {
  id: 'msg_002',
  threadID: 'thread_abc',
  senderID: 'user_456',
  body: 'not much you?',
  timestamp: Date.now()
})

// fetch a single message
console.log(api.getMessage('msg_001'))

// fetch whole thread
console.log(api.getThreadByID('thread_abc').getMessages())

// fetch paged (20 most recent)
console.log(api.getThreadByID('thread_abc').getMessagesPaged(20, 0))