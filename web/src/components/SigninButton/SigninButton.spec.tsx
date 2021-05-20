import {render, screen} from '@testing-library/react';
import {mocked} from 'ts-jest/utils';

import {useSession} from 'next-auth/client';

import { SiginButton } from '.';

jest.mock("next-auth/client")

describe('SiginButton', () => {
  it('renders correctly when is not authenticated', () => {

    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce([null, false]);

    render (
      <SiginButton/>
    );

    expect(screen.getByText("Sign in with Github")).toBeInTheDocument();
  });

  it('renders correctly when is authenticated', () => {

    const useSessionMocked = mocked(useSession);
    
    useSessionMocked.mockReturnValueOnce([
      {user: {name: 'Tales Eduardo', email: 'tales.eduardo@gmail.com' }, expires: 'test'},
      false
    ]);
    
    render (
      <SiginButton/>
    );

    expect(screen.getByText("Tales Eduardo")).toBeInTheDocument();
  });
});