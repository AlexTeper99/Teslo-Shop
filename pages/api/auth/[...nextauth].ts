import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github"
import { dbUsers } from "../../../database";


export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    // ...add more providers here

    Credentials({
      name: 'Custom Login',
      credentials: {
        //defino los campos, como si fuese un miniformulario
        email: { label: 'Correo:', type: 'email', placeholder: 'correo@google.com'  },
        password: { label: 'Contraseña:', type: 'password', placeholder: 'Contraseña'  },
      },
      async authorize(credentials) {
        console.log({credentials})
        //return { name: 'Juan', correo: 'juan@google.com', role: 'admin' };

        //validar contra BD                           el ! al final inidca que siempre lo voy a tener. 
        return await dbUsers.checkUserEmailPassword( credentials!.email, credentials!.password );

      },
    

    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],

  // Callbacks
  jwt: {
    // secret: process.env.JWT_SECRET_SEED, // deprecated
  },
  
  //agregar la duracion de la sesion. En este caso 30d
  session: {
    maxAge: 2592000, /// 30d
    strategy: 'jwt',
    updateAge: 86400, // cada día
  },

  //Custom Pages
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register'
  },


  callbacks: {

    async jwt({ token, account, user }) {
      // console.log({ token, account, user });

      if ( account ) {
        token.accessToken = account.access_token;

        switch( account.type ) {

          //si esta autenticado por redes sociales
          case 'oauth':  
          //TODO: Crear usuario o verificar si existe en mi DB
            token.user = await dbUsers.oAUthToDbUser( user?.email || '', user?.name || '' );
          break;

          //si esta autenticado por credenciales/ mi login personalizado
          case 'credentials':
            token.user = user;
          break;
        }

      }

      return token;
    },


    //esta sesion es la que voy a poder leer a lo largo de toda mi app
    async session({ session, token, user }){
      // console.log({ session, token, user });

      session.accessToken = token.accessToken;
      session.user = token.user as any;

      return session;
    }
    

  }

});