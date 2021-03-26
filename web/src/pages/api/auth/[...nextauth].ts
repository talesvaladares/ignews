import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import {query} from 'faunadb';
// import {session} from 'next-auth/client'
import {fauna} from '../../../services/fauna';

export default NextAuth({

    providers: [
        Providers.GitHub({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            scope: 'read:user'

        }),
    ],


    // caso vá para ambiente de produção precisa ser usado
    // jwt: {
    //     signingKey: process.env.SIGNIN_KEY
    // },

    callbacks:{

        async session(session){

            try{
                const userActiveSubscription = await fauna.query(
                    query.Get(
                        query.Intersection([
                            query.Match(
                                query.Index('subscription_by_user_ref'),
                                query.Select(
                                    'ref',
                                    query.Get(
                                        query.Match(
                                            query.Index('user_by_email'),
                                            query.Casefold(session.user.email)
                                        )
                                    )
                                )
                            ),
                            query.Match(
                                query.Index('subscription_by_status'),
                                "active"                                
                            )
                        ]) 
                    )
                );
                
                console.log('status da conta ' + userActiveSubscription)
                return {
                    ...session,
                    activeSubscription: userActiveSubscription
                };
            }
            catch{
                return {
                    ...session,
                    activeSubscription: null
                }
            }

        },


        async signIn(user, account, profile){

            const {email} = user;
            // abaixo le-se
            // se não existe um usuario como o email
            // então cria-se um novo usuario
            // caso já exista
            // recuperamos os dados do usuario existente

            // await fauna.query(
            //     query.Create(
            //         query.Collection('users'),
            //         {data: {email}}
            //     )
            // );

            // return true;

            try{
                await fauna.query(
                    query.If(
                        query.Not(
                            query.Exists(
                                query.Match(
                                   query.Index('user_by_email'),
                                   query.Casefold(email)
                                )
                            )
                        ),
                        query.Create(
                            query.Collection('users'),
                            {data: {email}}
                        ),
                        query.Get(
                            query.Match(
                                query.Index('user_by_email'),
                                query.Casefold(email),
                                
                            )
                        )  
                    )
                );
                console.log('loguei')
                return true; 
            }
            catch(err){
                console.log('nao loguei:'+ err)
                return false;
            };
        }
    }
});