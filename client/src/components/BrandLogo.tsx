import { useState } from 'react';

export default function BrandLogo() {
  const [imgError, setImgError] = useState(false);

  if (!imgError) {
    return (
      <>
        <img
          src="/logo.png"
          alt="LIFECTRL™"
          className="h-10 sm:h-12 w-auto"
          onError={() => setImgError(true)}
        />
      </>
    );
  }

  return (
    <>
      <span className="text-brand-500 text-2xl">◈</span>
      LIFE<span className="text-brand-500 font-mono bg-brand-50 px-1 py-0.5 rounded border border-brand-200">CTRL</span>™
    </>
  );
}
