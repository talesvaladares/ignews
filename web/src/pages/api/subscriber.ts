import {NextApiRequest, NextApiResponse} from 'next';
import {getSession} from 'next-auth/client';
import { stripe} from '../../services/stripe';

export default async (req: NextApiRequest, res: NextApiResponse ) => {

    if(req.method === 'POST'){


        //pega os dados do usuario nos cokies
        const session = await getSession({req});


        //criamos um usuario customizado para ser usado no stripe
        const stripeCustomer = await stripe.customers.create({
            email: session.user.email,
        })


        //configuramos a sessao de pagamento
        //com todas as informaçoes que tem no produto e formas de pagamento
        const stripeCheckoutSession = await stripe.checkout.sessions.create({
            customer: stripeCustomer.id, //usuario
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