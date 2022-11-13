import * as jose from 'jose';
import { TokenPayload } from '../model';
import { getCookie } from '../utils';
import type { User } from './user';

export const COOKIE_NAME = 'authToken';

export class TokenManager {
  private readonly publicKey;
  private readonly signingKey;
  private readonly iss;
  private readonly aud;

  constructor(private readonly ctx: AppLoadContext) {
    this.publicKey = this.ctx.AUTH_JWT_PUBLIC_KEY;
    this.signingKey = this.ctx.AUTH_JWT_PRIVATE_KEY;
    this.iss = this.ctx.AUTH_JWT_ISSUER;
    this.aud = this.ctx.AUTH_JWT_AUDIENCE;
  }

  async createToken(user: User): Promise<string> {
    return await new jose.SignJWT({
      allow: user.userId === 758633 || user.userId === 9562381,
      name: user.name
    })
      .setSubject(user.userId.toString())
      .setIssuer(this.iss)
      .setAudience(this.aud)
      .setProtectedHeader({ alg: 'ES384' })
      .setExpirationTime('2h')
      .sign(await jose.importPKCS8(this.signingKey, 'ES384'));
  }

  async validateToken(token: string): Promise<TokenPayload | null> {
    const { payload } = await jose.jwtVerify(
      token,
      await jose.importSPKI(this.publicKey, 'ES384'),
      {
        issuer: this.iss,
        audience: this.aud
      }
    );
    if (
      payload.sub === undefined ||
      payload.allow === undefined ||
      payload.allow === null ||
      typeof payload.name !== 'string'
    )
      return null;
    return {
      userId: payload.sub,
      allow: payload.allow === true,
      name: `${payload.name}`
    };
  }

  async getAuthenticatedUser(request: Request): Promise<TokenPayload | null> {
    try {
      const cookies = request.headers.get('Cookie');
      const authToken = getCookie(cookies, COOKIE_NAME);
      if (authToken === null) return null;
      const claims = await this.validateToken(authToken);
      if (claims === null) return null;
      return claims;
    } catch {
      return null;
    }
  }
}
