"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';


export default function Page() {
  const router = useRouter();

  useEffect(() => {
    router.push('/swap/SUI/HENRY');
  }, [router]);

  return (
    <main>
    </main>
  );
}