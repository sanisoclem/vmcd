import { Outlet } from '@remix-run/react';
import HeroSection from '~/components/HeroSection';
import { H1, H1Sub } from '~/components/Typography';

export default function Landing() {
  return (
    <>
      <HeroSection>
        <H1 className="mb-2">VMCD</H1>
        <H1Sub className="mb-6">A prototype.</H1Sub>
        <Outlet />
      </HeroSection>
      <footer />
    </>
  );
}
