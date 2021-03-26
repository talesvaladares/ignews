import {NextApiRequest, NextApiResponse} from 'next';
import {getSession} from 'next-auth/client';
import {query} from 'faunadb';

import { stripe} from '../../services/stripe';
import {fauna} from '../../services/fauna';

type UserFauna = {
    ref: {
        id: string;
    }

    data: {
        stripe_customer_id: string;
    }

}


//está é uma rota backend, executada no servidor node no next
export default async (req: NextApiRequest, res: NextApiResponse ) => {

    if(req.method === 'POST'){


        //pega os dados do usuario logado nos cookies
        const session = await getSession({req});

        //vamos pegar um usuario do faunaDB pelo seu email
        const userFauna = await fauna.query<UserFauna>(
           query.Get(
               query.Match(
                   query.Index('user_by_email'),
                   query.Casefold(session.user.email)
               )
           )
        );


        //recebemos o dia do stripe que estava salvo no faunaDB
        let customerId = userFauna.data.stripe_customer_id;

        //se o usuario não tem um id do stripe
        if(!customerId){
            //criamos um usuario customizado para ser usado no stripe
            const stripeCustomer = await stripe.customers.create({
                email: session.user.email,
                // metadata
             });

            //vamos atualizar o usuario no faunaDB, com o id da sua conta no stripe que foi criada
            //logo acima
            await fauna.query(
                query.Update(
                    query.Ref(query.Collection('users'), userFauna.ref.id),
                    {data: {
                        stripe_customer_id: stripeCustomer.id,
                    }}
                )
            );

            customerId = stripeCustomer.id;

        }


        //configuramos a sessao de pagamento
        //com todas as informaçoes que tem no produto e formas de pagamento
        const stripeCheckoutSession = await stripe.checkout.sessions.create({
            customer: customerId, //id do usuario no stripe
            payment_method_types: ['card'], //metodo de pagamento
            billing_address_collection: 'required', //endereço 
            line_items: [{
                price: 'price_1IYDE5AaXr7kzYTW2mDi3hVl', //id do preço do produto
                quantity: 1 //quantidade de produtos
            }],
            mode: 'subscription', //tipo de produto, se é uma assinatura mensal
            allow_promotion_codes: true, //se aceita promoçoes
            success_url: process.env.STRIPE_SUCCESS_URL, //para onde o usuario vai se ter sucesso
            cancel_url: process.env.STRIPE_CANCEL_URL //para onde o usuario vai se der errado
        });

        //retorno quando der certo
        return res.status(200).json({sessionId: stripeCheckoutSession.id});
    }   
    else{
        console.log('Deu um erro')
        res.setHeader('Allow','POST');
        res.status(405).end('Method not allowed');
    }
}