import { PropsOptionalClass } from '~/lib/props';

type PropsInput = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & { id?: string; showLabel?: boolean; label?: string } & PropsOptionalClass;

export const InputText = <P extends PropsInput>({
  id,
  showLabel,
  label,
  className,
  placeholder,
  ...props
}: P) => (
  <div className={` ${className ?? ''}`}>
    <label
      htmlFor={id}
      className={`${showLabel ?? true ? 'block text-sm font-medium text-gray-700' : 'sr-only'}`}
    >
      {label}
    </label>
    <input
      id={id}
      placeholder={placeholder}
      className="block w-full rounded-none border-gray-300 focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm"
      type="text"
      {...props}
    />
  </div>
);

export const Input = <P extends PropsInput>({
  id,
  showLabel,
  label,
  className,
  placeholder,
  ...props
}: P) => (
  <div className={` ${className ?? ''}`}>
    <label
      htmlFor={id}
      className={`${showLabel ?? true ? 'block text-sm font-medium text-gray-700' : 'sr-only'}`}
    >
      {label}
    </label>
    <input
      id={id}
      placeholder={placeholder}
      className="block w-full rounded-none border-gray-300 focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm"
      {...props}
    />
  </div>
);

export const InputRadio = <P extends { helpText: string } & PropsInput>({
  label,
  helpText,
  className,
  placeholder,
  ...props
}: P) => (
  <label className={`${className ?? ''} flex items-start`}>
    <div className="flex h-5 items-center">
      <input
        type="radio"
        className="h-4 w-4 border-gray-300 text-cyan-600 focus:ring-cyan-500"
        {...props}
      />
    </div>
    <div className="ml-3 text-sm">
      <div className="font-medium text-gray-700">{label}</div>
      <p className="text-gray-500">{helpText}</p>
    </div>
  </label>
);
