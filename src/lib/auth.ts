import NextAuth, { Session } from 'next-auth';
import { AdapterUser } from 'next-auth/adapters';
import { JWT } from 'next-auth/jwt';
import GitHubProvider from 'next-auth/providers/github';

declare module 'next-auth' {
  interface Session {
    access_token?: string;
    user: AdapterUser;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHubProvider({}),
  ],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async jwt({ token, user, account, profile }) {
      if (profile && account) {
        token.username = profile.login;
        token.access_token = account.access_token;
      }
      return token;
    },
    async session({ session, token }: {
      session: Session,
      token: JWT
    }) {
      // token から session へ access_token を追加
      session.user.id = token.username as string;
      session.access_token = token.access_token as string;
      return session;
    },
  },
});
