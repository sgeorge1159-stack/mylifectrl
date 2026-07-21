import { useState } from 'react';

export default function BrandLogo() {
  const [imgError, setImgError] = useState(false);

  if (!imgError) {
    return (
      <>
        <img
          src="/logo.svg"
          alt="LIFECTRL™"
          className="h-7 w-auto"
          onError={() => setImgError(true)}
        />
      </>
    );
  }

  return (
    <>
      <span className="text-brand-500 text-2xl">◈</span>
      LIFECTRL™
    </>
  );
}
