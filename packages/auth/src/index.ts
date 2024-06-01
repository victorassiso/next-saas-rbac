import {
  AbilityBuilder,
  CreateAbility,
  createMongoAbility,
  MongoAbility,
} from '@casl/ability'
import { z } from 'zod'

import { User } from './models/user'
import { permissions } from './permissions'
import { billingSubjectSchema } from './subjects/billing'
import { inviteSubjectSchema } from './subjects/invite'
import { organizationSubjectSchema } from './subjects/organization'
import { projectSubjectSchema } from './subjects/project'
import { userSubjectSchema } from './subjects/user'

export * from './models/organization'
export * from './models/project'
export * from './models/user'

const appAbilitiesSchema = z.union([
  projectSubjectSchema,
  userSubjectSchema,
  organizationSubjectSchema,
  inviteSubjectSchema,
  billingSubjectSchema,
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

  const ability = builder.build({
    detectSubjectType(subject) {
      return subject.__typename
    },
  })

  return ability
}
