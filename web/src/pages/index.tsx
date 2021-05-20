import {GetStaticProps} from 'next';
import Head from 'next/head';
import { SubscriberButton } from '../components/SubscriberButton';

import {stripe} from '../services/stripe';

import styles from '../styles/pages/home.module.scss';

interface HomeProps {
  product: {
    priceId: string;
    amount: string;
  }
}

export default function Home({product}: HomeProps) {
  return (
   <>
      <Head>
        <title>Home | ig.news</title>
      </Head>
      
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏Hey, welcome</span>
          <h1>News about the <span>React</span> world.</h1>
          <p>
            Get access to all the publications <br/>
            <span>for {product.amount} month</span>
          </p>
          <SubscriberButton/>
        </section>
        <img src="/images/avatar.svg" alt="girl coding"/>
        
      </main>
      
   </>
  );
}

//server side render
//esta funçao faz uma chamada a api no nivel de servidor
//assim quando a pagina for exibida
//todos os dados da pagina teram sido carregados
//isso tambem pode causar atrasos na renderização se acontecer um atrasado na chamada a api
// export const getServerSideProps : GetServerSideProps = async () => {

//   const price = await stripe.prices.retrieve('price_1IYDE5AaXr7kzYTW2mDi3hVl', {
//     expand: ['product'],
//   });

//   const product = {
//     priceId: price.id,
//     amount: new Intl.NumberFormat('en-US',{
//       style: 'currency',
//       currency: 'USD',

//     }).format(price.unit_amount /100)
//   };

//   return {
//     props: {
//       product
//     }
//   }
// }


//static site generetion
//esta funçao faz uma chamada a api no nivel de servidor
//e salva os dados em uma página estática
//assim não é necessario sempre estar fazendo uma chamada na api
//deixando a aplicação mais rápida

//é possivel fazer uma configuração
//informando de quanto em quanto tempo a página precisa ser remontada
//dentro do intervalo de tempo estabelecido
//todos que acessarem a página veram a mesma coisa
//ao passar o intervalo de tempo, se uma pessoa acessar aquela pagina
//pela primeira vez, a pagina será remontada
export const getStaticProps : GetStaticProps = async () => {

  const price = await stripe.prices.retrieve('price_1IYDE5AaXr7kzYTW2mDi3hVl', {
    expand: ['product'],
  });

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US',{
      style: 'currency',
      currency: 'USD',

    }).format(price.unit_amount /100)
  };

  return {
    props: {
      product
    },
    revalidate: 60 * 60 * 24 //24 horas para a pagina ser remontada
  }
}