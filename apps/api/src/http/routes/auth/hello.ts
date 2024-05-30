import type { FastifyInstance } from 'fastify'

export async function hello(app: FastifyInstance) {
  app.get('/hello', () => {
    return 'Hello Worl!'
  })
}
