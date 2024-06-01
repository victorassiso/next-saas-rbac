import type { FastifyInstance } from 'fastify'

export async function hello(app: FastifyInstance) {
  app.get(
    '/hello',
    {
      schema: {
        tags: ['health-check'],
        summary: 'Check if the API server is running',
      },
    },
    () => {
      return 'Hello World!'
    },
  )
}
