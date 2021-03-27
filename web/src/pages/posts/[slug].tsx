import { GetServerSideProps } from "next"
import { getSession } from "next-auth/client"
import { RichText } from "prismic-dom";
import Head from "next/head";
import { getPrismicClient } from "../../services/prismic";

import styles from './post.module.scss';

interface PostProps {
   post : {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
   }
}

export default function Post ( {post} : PostProps ) {
    return (
        <>
            <Head>
                <title>{post.title} | ignews</title>
            </Head>
            
            <main className={styles.container}>
                <article className={styles.post}>
                    <h1>{post.title}</h1>
                    <time>{post.updatedAt}</time>
                    <div 
                        className={styles.content}
                        dangerouslySetInnerHTML={{__html : post.content}}
                    />
                </article>
            </main>

        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({req, params}) => {

    const session = await getSession({req});

    const {slug} = params;

    console.log('conta do usuario'+ JSON.stringify(session, null, 2))


    //não funciona com session.activeSubscription, por enqueantoo vou deixar sem
    // if(!session?.activeSubscription){
    if(!session){

        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    const prismic = getPrismicClient(req);

    const response = await prismic.getByUID('post', String(slug), {});

    // console.log('post recebido' + JSON.stringify(response, null , 2))

    const post = {
        slug,

        //usamos o RicheText para converter o conteudo do post do prismic em um texto simples
        title: RichText.asText(response.data.title),
        //pegamos o conteúdo do prismic e transformamos para html
        content : RichText.asHtml(response.data.content),
        updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR',{
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })
    };

    return {
        props: {post}
    }
}