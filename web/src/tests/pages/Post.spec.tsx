import {render, screen} from '@testing-library/react';
import { getSession } from 'next-auth/client';
import {mocked} from 'ts-jest/utils';
import Post, {getServerSideProps} from '../../pages/posts/[slug]';
import { getPrismicClient } from '../../services/prismic';


jest.mock('next-auth/client');

const post = 
  {
    slug: 'my-new-post',
    title: 'my new post',
    content: '<p> post centet </p>',
    updatedAt: '01 de abril de 2021'

  }
;


describe("Post page",() => {
  it("renders correctyle", () => {
    render(<Post post={post}/>);

    expect(screen.getByText('my new post')).toBeInTheDocument();
    
  });

  it('redirects user if no subscription is found', async () => {

    const getSessionMocked = mocked(getSession);
    
    getSessionMocked.mockResolvedValueOnce(null);

    const response = await getServerSideProps({params: {slug: 'my new params'}} as any);

    expect(response).toEqual(expect.objectContaining({
      redirect: {
        destination: '/',
        permanent: false
      }
    }));

  });

  it ('loads initial data', async () => {
    const getSessionMocked = mocked(getSession);

    const getPrismicClientMocked = mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [
            {type: 'heading', text: 'my new post'}
          ],
          content: [
            {type: 'paragraph', text: 'post post'}
          ],
          last_publication_date: '04-01-2021',
        }
      })
    } as any);

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: 'fake-active-subscription'
    } as any);

    const response = await getServerSideProps({
      params: {slug : 'my-new-post'}
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'my-new-post',
            title: 'my new post',
            content: '<p> post centet </p>',
            updatedAt: '01 de abril de 2021'
          }
        }
      })
    )

  });

});