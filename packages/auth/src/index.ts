import {
  AbilityBuilder,
  CreateAbility,
  createMongoAbility,
  MongoAbility,
} from '@casl/ability'
import { z } from 'zod'

import { User } from './models/user'
import { permissions } from './permissions'
import { inviteSubjectSchema } from './subjects/invite'
import { organizationSubjectSchema } from './subjects/organization'
import { productSubjectSchema } from './subjects/products'
import { userSubjectSchema } from './subjects/user'

const appAbilitiesSchema = z.union([
  productSubjectSchema,
  userSubjectSchema,
  organizationSubjectSchema,
  inviteSubjectSchema,

  z.tuple([z.literal('manage'), z.literal('all')]),
])

type AppAbilities = z.infer<typeof appAbilitiesSchema>

export type AppAbility = MongoAbility<AppAbilities>
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>

export function defineAbilityFor(user: User) {
  const builder = new AbilityBuilder(createAppAbility)

  // If user role does not exist, throw error 'not found'
  if (typeof permissions[user.role] !== 'function') {
    throw new Error(`Permissions for role ${user.role} not found.`)
  }

  permissions[user.role](user, builder)

  const ability = builder.build()

  return ability
}
