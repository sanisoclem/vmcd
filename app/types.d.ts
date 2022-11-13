import { Params } from '@remix-run/react';
export {};

declare global {
  interface DataFunctionArgs {
    request: Request;
    context: AppLoadContext;
    params: Params;
  }

  interface AppLoadContext {
    EB: KVNamespace;
    AUTH_GITHUB_CLIENT_ID: string;
    AUTH_GITHUB_CLIENT_SECRET: string;
    AUTH_GITHUB_CALLBACK_URI: string;
    AUTH_JWT_PRIVATE_KEY: string;
    AUTH_JWT_PUBLIC_KEY: string;
    AUTH_JWT_ISSUER: string;
    AUTH_JWT_AUDIENCE: string;
  }
  type CFLoaderFunction<A = unknown> = (
    args: DataFunctionArgs
  ) => Promise<Response | A> | Response | A;
  type CFActionFunction<A = Response> = (
    args: DataFunctionArgs
  ) => Promise<Response | A> | Response | A;
}
