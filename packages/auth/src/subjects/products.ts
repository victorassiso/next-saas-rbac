import { z } from 'zod'

export const productSubjectSchema = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('get'),
    z.literal('create'),
    z.literal('update'),
    z.literal('delete'),
  ]),
  z.literal('Product'),
])

export type ProductSubject = z.infer<typeof productSubjectSchema>
