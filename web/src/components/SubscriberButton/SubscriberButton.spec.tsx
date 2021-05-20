import {fireEvent, render, screen} from '@testing-library/react';
import {mocked} from 'ts-jest/utils';
import { signIn, useSession} from 'next-auth/client';
import {useRouter} from 'next/router';
import { SubscriberButton } from '.';

jest.mock('next-auth/client');

jest.mock('next/router');

describe("SubscribeButton component", () => {
  
  it("renders correctly", () => {

    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce([null, false]);

    render(
      <SubscriberButton/>
    );

    expect(screen.getByText("Subscriber now")).toBeInTheDocument();
  });

  it('redirects user to signin in when not authenticated', () => {

    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce([null, false]);

    const signinMocked = mocked(signIn);

    render(
      <SubscriberButton/>
    );

    const subscriberButton = screen.getByText('Subscriber now');

    fireEvent.click(subscriberButton);

    expect(signinMocked).toHaveBeenCalled();
  });

  // it('redirects to posts when user already has a subscriptions', () => {
  //   // const {push} = useRouter();

  //   const useRouterMocked = mocked(useRouter);

  //   const useSessionMocked = mocked(useSession);

  //   const pushMocked = jest.fn();

  //   useSessionMocked.mockReturnValueOnce([
  //     {
  //       user: {
  //         name: 'Tales Eduardo',
  //         email: 'tales.eduardo@gmail.com',
  //       },
  //       activeSubscription: 'fake-active-subscription',
  //       expires: 'fake-expires'
  //     },
  //     false
  //   ]);

  //   useRouterMocked.mockReturnValueOnce({
  //     push: pushMocked
  //   } as any);

  //   render(<SubscriberButton/>);

  //   const subscriberButton = screen.getByText('Subscriber now');
    
  //   fireEvent.click(subscriberButton);

  //   expect(pushMocked).toHaveBeenCalledWith('/posts');

  // });
});