import { PropsOptionalClass, PropsWithChildren } from '~/lib/props';

type PropsFieldset = React.DetailedHTMLProps<
  React.FieldsetHTMLAttributes<HTMLFieldSetElement>,
  HTMLFieldSetElement
>;

export const Fieldset = <
  P extends { legend: string } & PropsWithChildren & PropsOptionalClass & PropsFieldset
>({
  legend,
  className,
  children,
  ...props
}: P) => (
  <fieldset className={`${className ?? ''}`} {...props}>
    <legend className="sr-only">{legend}</legend>
    <div className="text-base font-medium text-gray-900" aria-hidden="true">
      {legend}
    </div>
    {children}
  </fieldset>
);
