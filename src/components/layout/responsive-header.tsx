'use client';

import MobileHeader from './mobile-header';
import DesktopHeader from './desktop-header';

export default function ResponsiveHeader() {
  return (
    <>
      <MobileHeader />
      <DesktopHeader />
    </>
  );
}
