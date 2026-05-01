// traced.ts — drop this into any project that needs observability
// Point OBS_URL to your server

const OBS_URL = process.env.OBS_URL ?? 'http://localhost:4200';
const ENV     = process.env.NODE_ENV ?? 'dev';
const IS_DEV  = ENV !== 'production';

// Internal batch queue — flushes every 2s or when batch hits 20
const queue: unknown[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;

function enqueue(event: unknown) {
  queue.push(event);
  if (queue.length >= 20) flush();
  else if (!flushTimer) {
    flushTimer = setTimeout(flush, 2000);
  }
}

async function flush(caller: string = '') {
  if (flushTimer) { clearTimeout(flushTimer); flushTimer = null; }
  if (queue.length === 0) {
    console.log('[OBS] No events to flush');
    return;
  }

  const batch = queue.splice(0, queue.length);

  console.log('[OBS] TRIGGERED BY:', caller);
  console.log('[OBS] FLUSHING:', JSON.stringify(batch, null, 2));

  try {
    const res = await fetch(`${OBS_URL}/events/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(batch),
    });

    console.log('[OBS] RESPONSE STATUS:', res.status);

    const text = await res.text();
    console.log('[OBS] RESPONSE BODY:', text);

  } catch (err){
    console.error('[OBS] FETCH FAILED:', err);
  }
}

export function traced<T extends (...args: unknown[]) => unknown>(
  name: string,
  fn: T,
  opts?: { tag?: string }
): T {
  return (async (...args: unknown[]) => {
    const start = Date.now();
    try {
      const result = await fn(...args);
      const durationMs = Date.now() - start;

      if (IS_DEV) {
        console.log(`[trace] ${name} (${durationMs}ms)`, { args, result });
      }

      enqueue({
        fn: name,
        ts: Date.now(),
        durationMs,
        input:  IS_DEV ? args   : undefined, // no payloads in prod
        output: IS_DEV ? result : undefined,
        env: ENV,
        tag: opts?.tag,
      });

      return result;
    } catch (err) {
      const durationMs = Date.now() - start;
      const error = err instanceof Error ? `${err.stack}` : String(err);

      if (IS_DEV) {
        console.error(`[trace] ${name} THREW (${durationMs}ms)`, error);
      }

      enqueue({
        fn: name,
        ts: Date.now(),
        durationMs,
        error,
        env: ENV,
        tag: opts?.tag,
      });

      (async () => {
        await flush('BEFORE_INTERNAL_ERROR');
        throw err; // re-throw, don't swallow
      })();
    }
  }) as T;
}

// Flush on process exit so you don't lose the last batch
process.on('beforeExit', () => flush('beforeExit'));
process.on('SIGINT',     () => flush('SIGINT').then(() => process.exit()));
process.on('SIGTERM',    () => flush('SIGTERM').then(() => process.exit()));