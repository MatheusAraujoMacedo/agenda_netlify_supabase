import React from 'react';
import dynamic from 'next/dynamic';

const AgendaCabeleleiro = dynamic(() => import('../components/AgendaCabeleleiro'), { ssr: false });

export default function Home() {
  return <AgendaCabeleleiro />;
}
