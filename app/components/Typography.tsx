import { PropsOptionalClass, PropsWithChildren } from '~/lib/props';

export const H1 = <P extends PropsWithChildren & PropsOptionalClass>({
  children,
  className,
  ...props
}: P) => (
  <h1 className={`text-6xl ${className ?? ''}`} {...props}>
    {children}
  </h1>
);

export const H3 = <P extends PropsWithChildren & PropsOptionalClass>({
  children,
  className,
  ...props
}: P) => (
  <h3 className={`text-2xl ${className ?? ''}`} {...props}>
    {children}
  </h3>
);

export const H1Sub = <P extends PropsWithChildren & PropsOptionalClass>({
  children,
  className,
  ...props
}: P) => (
  <p className={`text-sm text-gray-400 ${className ?? ''}`} {...props}>
    {children}
  </p>
);
