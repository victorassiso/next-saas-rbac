import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

import { BadRequestError } from '../errors/bad-request-error'

export async function getProfile(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/profile',
      {
        schema: {
          tags: ['auth'],
          summary: 'Get authenticated user profile',
          response: {
            200: z.object({
              user: z.object({
                id: z.string().uuid(),
                name: z.string().nullable(),
                email: z.string().email(),
                avatarUrl: z.string().url().nullable(),
              }),
            }),
            400: z.object({ message: z.string() }),
          },
        },
      },

      async (request, reply) => {
        const { sub } = await request.jwtVerify<{ sub: string }>()

        const user = await prisma.user.findUnique({
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
          where: {
            id: sub,
          },
        })

        if (!user) {
          throw new BadRequestError('User not found')
        }

        return reply.send({ user })
      },
    )
}
