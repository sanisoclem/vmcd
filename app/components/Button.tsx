import { Link } from '@remix-run/react';
import { RemixLinkProps } from '@remix-run/react/dist/components';

type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & { variant?: 'sm' };
type AnchorProps = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>;

export const ButtonLink = <P extends RemixLinkProps>({ children, className, ...props }: P) => (
  <Link className={`btn ${className ?? ''}`} {...props}>
    {children}
  </Link>
);

export const Button = <P extends ButtonProps>({ variant, children, className, ...props }: P) => (
  <button
    className={`${variant === undefined ? 'btn' : `btn-${variant}`} ${className ?? ''}`}
    {...props}
  >
    {children}
  </button>
);

export const ButtonExternalLink = <P extends AnchorProps>({ children, className, ...props }: P) => (
  <a className={`btn ${className ?? ''}`} {...props}>
    {children}
  </a>
);
