import type { MetaFunction } from '@remix-run/cloudflare';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import styles from './styles/app.css';
import * as Codec from 'purify-ts/Codec';
import { redirect } from '@remix-run/cloudflare';
import * as Model from '~/lib/model';
import { TokenManager } from '~server';
import {
  ROUTEDEF_ROOT,
  ROUTE_HOME,
  ROUTE_INTEGRATIONMANAGER,
  ROUTE_LOGIN,
  ROUTE_UNAUTHORIZED
} from './lib/routes';
import { makeRouteDataHook } from './hooks';

export const loaderDataCodec = Codec.nullable(Model.tokenPayloadCodec);

export const loader: CFLoaderFunction = async ({ request, context }) => {
  const url = new URL(request.url);
  const tokenMgr = new TokenManager(context);

  const currentUser = await tokenMgr.getAuthenticatedUser(request);

  if (currentUser === null) {
    if (url.pathname !== ROUTE_LOGIN) return redirect(ROUTE_LOGIN);
    return null;
  }
  if (!currentUser.allow) {
    if (url.pathname !== ROUTE_UNAUTHORIZED) return redirect(ROUTE_UNAUTHORIZED);
    return null;
  }
  if (
    url.pathname === ROUTE_HOME ||
    url.pathname === ROUTE_LOGIN ||
    url.pathname === ROUTE_UNAUTHORIZED
  )
    return redirect(ROUTE_INTEGRATIONMANAGER);

  return loaderDataCodec.encode(currentUser);
};

export function links() {
  return [{ rel: 'stylesheet', href: styles }];
}

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'VMCD',
  viewport: 'width=device-width,initial-scale=1'
});

export const useRouteDataRoot = makeRouteDataHook(ROUTEDEF_ROOT, loaderDataCodec);

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="bg-gray-50">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
