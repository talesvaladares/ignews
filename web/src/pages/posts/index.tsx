import { GetStaticProps } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import Primisc from '@prismicio/client';
import { RichText } from 'prismic-dom';

import { getPrismicClient } from '../../services/prismic';

import styles from './styles.module.scss';

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
}

interface PostsProps {

  posts: Post[];
}

export default function Posts({ posts }: PostsProps) {

  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {
            posts.map(post => (
              <Link href={`/posts/${post.slug}`} key={post.slug}>
                <a>
                  <div>
                    <time>{post.updatedAt}</time>
                    <strong>{post.title}</strong>
                    <p>{post.excerpt}</p>
                  </div>
                </a>
              </Link>
            ))
          }

        </div>
      </main>

    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {

  const prismic = getPrismicClient();

  const response = await prismic.query(
    [
      //indica para o prismic que queremos buscar todos os documentos que forem do tipo post
      Primisc.predicates.at('document.type', 'post')
    ],
    {
      //indica quais campos do post eu quero pegar
      fetch: ['post.title', 'post.content'],
      pageSize: 100, // quantidade de paginas que vem do prismic
    }

  );

  //serve para debugar
  //quando existe um objeto e não sabemos o que vem dentro dele
  // console.log(JSON.stringify(response, null, 2));

  const posts = response.results.map(post => {
    return {
      slug: post.uid,
      //usamos o RicheText para converter o conteudo do post do prismic em um texto simples
      title: RichText.asText(post.data.title),
      //buscamos o primeiro paragrafo dentro do content/texto do prismic
      excerpt: post.data.content.find(content => content.type === 'paragraph')?.text ?? '',
      updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    }
  })

  return {
    props: { posts },
    // revalidate: 60 * 24 // um dia
  }
}