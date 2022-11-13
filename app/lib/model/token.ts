import { Codec, GetType, string, boolean } from 'purify-ts/Codec';

export const tokenPayloadCodec = Codec.interface({
  userId: string,
  allow: boolean,
  name: string
});

export type TokenPayload = GetType<typeof tokenPayloadCodec>;
