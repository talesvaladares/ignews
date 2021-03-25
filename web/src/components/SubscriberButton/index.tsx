import {useCallback} from 'react';
import {useSession, signIn} from 'next-auth/client';

import {api} from '../../services/api';
import {getStripeJs} from '../../services/stripe-js';

import styles from './styles.module.scss';

interface SubscriberButtonProps{
    priceId: string
}

export function SubscriberButton({priceId}: SubscriberButtonProps){

    const [session] = useSession();

    const handleSubscriber = useCallback(async()=> {

        if(!session){
            signIn('github');
            return;
        }

        try{

            console.log('entrei aqui');
            const response = await api.post('/subscriber');

            const {sessionId} = response.data;

            const stripe = await getStripeJs();

            await stripe.redirectToCheckout({sessionId});
        }
        catch(err){
            console.log('erro no checkout')
            alert(err.message);
        }


    },[session, api]);

    return (
        <button
            type='button'
            className={styles.subscriberButton}
            onClick={handleSubscriber}
        >
            Subscriber now
        </button>
    );
}