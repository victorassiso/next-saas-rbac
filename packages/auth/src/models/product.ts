import { z } from 'zod'

import { roleSchema } from '../subjects/roles'

export const productSchema = z.object({
  role: roleSchema,
})

export type Product = z.infer<typeof productSchema>
