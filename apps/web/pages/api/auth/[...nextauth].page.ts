import { PrismaAdapter } from '@next-auth/prisma-adapter'
import NextAuth, { NextAuthOptions } from 'next-auth'
import EmailProvider from 'next-auth/providers/email'
import GitHubProvider from 'next-auth/providers/github'

import { prisma } from '@progwise/timebook-backend'

export const nextAuthOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),

    // Email Provider only used for e2e testing
    ...(process.env.NODE_ENV === 'production' ? [] : [EmailProvider({})]),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
      }

      return session
    },
  },
  secret: process.env.SECRET,
}

export default NextAuth(nextAuthOptions)
