import { GetStaticPaths, GetStaticProps } from "next"
import { useSession } from "next-auth/client"
import { RichText } from "prismic-dom";
import Head from "next/head";
import { getPrismicClient } from "../../../services/prismic";

import styles from '../post.module.scss';
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/router";

interface PostPreviewProps {
   post : {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
   }
}

export default function PostPreview ( {post} : PostPreviewProps ) {

    const [session] = useSession();
    const router = useRouter();

    useEffect(() => {

        // if(session?.activeSubscription){
        if(session){
            router.push(`/post/${post.slug}`)
        }
    },[session]);

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
                        className={`${styles.content} ${styles.previewContent}`}
                        dangerouslySetInnerHTML={{__html : post.content}}
                    />
                    <div className={styles.continueReading}>
                        Wanna continue reading?
                        <Link href='/'>
                            <a>Subscribe now  🤗</a>
                        </Link>

                    </div>
                </article>
            </main>

        </>
    )
}

//usado apenas em paginas que tem carregamento dinamico
//paginas que são tem os colchetes por volta
export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async ({params}) => {


    const {slug} = params;


    const prismic = getPrismicClient();

    const response = await prismic.getByUID('post', String(slug), {});

    // console.log('post recebido' + JSON.stringify(response, null , 2))

    const post = {
        slug,

        //usamos o RicheText para converter o conteudo do post do prismic em um texto simples
        title: RichText.asText(response.data.title),
        //pegamos o conteúdo do prismic e transformamos para html
        content : RichText.asHtml(response.data.content.splice(0 , 3)),
        updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR',{
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })
    };

    return {
        props: {post},
        revalidate: 60 * 30
    }
}