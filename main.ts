import { db } from "./db"

const server = Bun.serve({
  port: Bun.env.PORT || 3000,
  static: {
    '/': Response.json({ message: "county here!" }),
    '/api/heartbeat': Response.json({ message: "OK" }),
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

    return Response.json({ message: "Not Found" }, { status: 404 })
  }
})

console.log(`Server running at http://${server.hostname}:${server.port}`)

function get(namespace: string, key: string) {
  const query = db.query('SELECT value FROM counter where namespace = :namespace and key = :key limit 1')
  const counter = query.get({ namespace, key }) as { value: number }
  return Response.json({ count: counter.value })
}

function up(namespace: string, key: string) {
  const query = db.query('SELECT value FROM counter where namespace = :namespace and key = :key limit 1')
  const counter = query.get({ namespace, key })

  if (counter) {
    db
      .query('UPDATE counter SET value = value + 1 where namespace = :namespace and key = :key')
      .run({ namespace, key })
  } else {
    db
      .query('INSERT INTO counter (namespace, key, value) VALUES (:namespace, :key, 1)')
      .run({ namespace, key })
  }

  return Response.json("OK")
}
