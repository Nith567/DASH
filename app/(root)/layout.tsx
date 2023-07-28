import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }
console.log("hello layout bhai");
  const store = await prismadb.store.findFirst({
    where: {
      userId,
    }
  });

  if (store) {
    console.log("pews");
    console.log(store.id);
    redirect(`/${store.id}`);
  };

  return (
    <>
    <div className='gradient' />
      {children}
      
    </>
  );
};