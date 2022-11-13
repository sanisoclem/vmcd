import { redirect } from '@remix-run/cloudflare';
import { ensureValidUser } from '~/lib/utils';
import { ROUTE_NEWINTEGRATION } from '~/lib/routes';

export const loader: CFLoaderFunction<{}> = async ({ request, context }) => {
  await ensureValidUser(context, request);

  return redirect(ROUTE_NEWINTEGRATION);
};

export default function IntegrationManager() {
  return <></>;
}
