import { ReactNode } from 'react';

export default function HeroSection({ children }: { children: ReactNode }) {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center">{children}</section>
  );
}
