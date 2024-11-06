import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHubProvider({}),
  ],
  callbacks: {
    // eslint-disable-next-line no-unused-vars
    async jwt({ token, user, account, profile }) {
      if (profile && account) {
        console.log("account", account)
        token.username = profile.login;
        token.access_token = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      // console.log("token", token)
      // console.log("session", session)
      session.user.id = token.username as string;
      session.access_token = token.access_token as string
      return session;
    },
  },
});
