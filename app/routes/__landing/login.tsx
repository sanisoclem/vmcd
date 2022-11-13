import { ButtonExternalLink } from '~/components/Button';
import { ROUTE_API_AUTH_GITHUB } from '~/lib/routes';

export default function Login() {
  return (
    <>
      <p className="my-4">Login to get started.</p>
      <ButtonExternalLink href={ROUTE_API_AUTH_GITHUB} className="">
        Login
      </ButtonExternalLink>
    </>
  );
}
