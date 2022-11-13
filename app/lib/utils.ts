import { NotAuthenticatedError, NotAuthorizedError, TokenManager } from '~server';
import { TokenPayload } from './model';

export const toInt = <T>(x: string | null | unknown, def: T): number | T => {
  if (x === null) return def;
  if (typeof x !== 'string') return def;
  const r = parseInt(x);
  if (isNaN(r)) return def;
  return r;
};

export const getFormInt = (f: FormData, key: string): number | null => {
  const v = f.get(key);
  if (typeof v !== 'string') return null;
  return toInt(v, null);
};

export type NonEmptyArray<A> = [A, ...A[]];

export const valueOrFirst = <A>(v: A | NonEmptyArray<A>): A => (Array.isArray(v) ? v[0] : v);

export const delay = async (duration: number): Promise<void> => {
  await new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

export const getCookie = (cookieString: string | null, key: string): string | null => {
  if (cookieString === null) return null;

  const allCookies = cookieString.split('; ');
  const targetCookie = allCookies.find((cookie) => cookie.includes(key));
  if (targetCookie === undefined) return null;

  const [, value] = targetCookie.split('=');
  return value ?? null;
};

export const ensureValidUser = async (ctx: AppLoadContext, req: Request): Promise<TokenPayload> => {
  const tokenMgr = new TokenManager(ctx);
  const user = await tokenMgr.getAuthenticatedUser(req);
  if (user === null) throw new NotAuthenticatedError();
  if (!user.allow) throw new NotAuthorizedError();
  return user;
};
