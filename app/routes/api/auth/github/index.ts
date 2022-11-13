import { redirect } from '@remix-run/cloudflare';
import { GithubClient } from '~server';

export const loader: CFLoaderFunction = async ({ request, context }) => {
  const url = new URL(request.url);
  const returnUrl = url.searchParams.get('returnUrl');
  const redirectUri = await GithubClient(context).createAuthRequest(
    returnUrl === null ? '/' : returnUrl
  );

  return redirect(redirectUri);
};
