import { db } from "./db"

const server = Bun.serve({
  port: Bun.env.PORT || 3000,
  routes: {
    '/': Response.json({ message: "county here!" }),
    '/api/heartbeat': {
      async GET() {
        const result = await db`SELECT NOW() AS now LIMIT 1`
        return Response.json({ status: "ok", time: result[0].now } )
      }
    }
  },
  fetch(request) {
    const { method } = request
    const { pathname, searchParams } = new URL(request.url)

    const namespace = searchParams.get('namespace')
    if (!namespace) return Response.json({ message: "namespace params is required" }, { status: 400 })

    const key = searchParams.get('key')
    if (!key) return Response.json({ message: "key params is required" }, { status: 400 })

    if (pathname.startsWith('/api/count') && method === 'GET') return get(namespace, key)
    if (pathname.startsWith('/api/count/up') && method === 'POST') return up(namespace, key)

    return Response.json({ message: "not found" }, { status: 404 })
  }
})

console.log(`Server running at http://${server.hostname}:${server.port}`)

async function get(namespace: string, key: string) {
  const counters = await db`SELECT value FROM counter WHERE namespace = ${namespace} AND key = ${key} LIMIT 1`

  if (!counters.length) return Response.json({ message: "counter not found" }, { status: 404 })

  return Response.json({ count: counters[0].value })
}

async function up(namespace: string, key: string) {
  const counters = await db`SELECT value FROM counter WHERE namespace = ${namespace} AND key = ${key} LIMIT 1`

  if (counters.length > 0) {
    await db`UPDATE counter SET value = value + 1 WHERE namespace = ${namespace} AND key = ${key}`
  } else {
    await db`INSERT INTO counter (namespace, key, value) VALUES (${namespace}, ${key}, 1)`
  }

  return Response.json({ message: 'ok' })
}
