import type { FastifyInstance } from 'fastify'
import fastifyPlugin from 'fastify-plugin'

import { UnauthorizedError } from '../routes/errors/unauthorized-error'

export const auth = fastifyPlugin(async (app: FastifyInstance) => {
  app.decorateRequest('getCurrentUserId')

  app.addHook('preHandler', async (request) => {
    request.getCurrentUserId = async () => {
      try {
        const { sub } = await request.jwtVerify<{ sub: string }>()

        return sub
      } catch {
        throw new UnauthorizedError('Invalid auth token')
      }
    }
  })
})
