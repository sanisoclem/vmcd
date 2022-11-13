import { ReactNode } from 'react';

export interface PropsWithChildren {
  children: ReactNode;
}

export interface PropsOptionalClass {
  className?: string;
}
