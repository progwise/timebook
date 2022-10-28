import { User } from '@progwise/timebook-prisma'

type NextAuthUser = Partial<Omit<User, 'emailVerified'>> & { id: string }

export interface Context {
  session: { user: NextAuthUser } | null
}

export interface LoggedInContext extends Context {
  session: { user: NextAuthUser }
}
