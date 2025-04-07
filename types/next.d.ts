// types/next.d.ts
import { NextPage } from 'next';

declare module 'next' {
  type PageAuth = {
    public?: boolean;
    redirectAuthenticated?: string;
  };

  export type NextPageWithAuth<P = {}, IP = P> = NextPage<P, IP> & {
    auth?: PageAuth;
  };
}