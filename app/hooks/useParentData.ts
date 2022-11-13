import { useMatches } from '@remix-run/react';
import { useMemo } from 'react';
import * as Codec from 'purify-ts/Codec';

export const makeRouteDataHook =
  <A>(routeId: string, schema: Codec.Codec<A>) =>
  (): A => {
    const matches = useMatches();
    const data = useMemo(
      () => schema.unsafeDecode(matches.find((match) => match.id === routeId)?.data),
      [matches, routeId]
    );

    return data;
  };
