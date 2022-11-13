import { redirect } from '@remix-run/cloudflare';
import { COOKIE_NAME, GithubClient, TokenManager, UserManager } from '~server';

export const loader: CFLoaderFunction = async ({ request, context }) => {
  const tokenMgr = new TokenManager(context);
  const url = new URL(request.url);
  const state = url.searchParams.get('state');
  const code = url.searchParams.get('code');

  if (code === null || state === null) {
    return new Response('Invalid auth callback', { status: 400 });
  }

  const ghClient = GithubClient(context);
  const savedState = await ghClient.getAuthRequest(state);

  if (savedState === null) {
    return new Response('Invalid auth callback', { status: 400 });
  }

  const tokenData = await ghClient.getAccessToken(code);
  const userData = await ghClient.getUserInfo(tokenData);

  const user = await UserManager(context).getOrCreateUser({
    userId: userData.id,
    name: userData.name,
    providers: {
      github: {
        token: tokenData.access_token,
        profile: userData
      }
    }
  });

  const token = await tokenMgr.createToken(user);

  return redirect(`${url.origin}${savedState.returnUrl}`, {
    headers: {
      'Set-Cookie': `${COOKIE_NAME}=${token}; path=/; secure; HttpOnly; SameSite=lax`
    }
  });
};
