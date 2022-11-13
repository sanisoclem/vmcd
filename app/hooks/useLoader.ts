import { useLoaderData } from '@remix-run/react';
import { useMemo } from 'react';
import * as Codec from 'purify-ts/Codec';

export const useLoaderDataStrict = <A>(schema: Codec.Codec<A>): A => {
  const data = useLoaderData();
  const parsed = useMemo(() => schema.unsafeDecode(data), [data]);
  return parsed;
};
