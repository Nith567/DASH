'use client'
import React, { useEffect } from 'react'

import { useStoreModal } from '@/hooks/use-store-modal'
import { Divide } from 'lucide-react';
function Page() {
  const onOpen = useStoreModal((state) => state.onOpen);
  const isOpen = useStoreModal((e) => e.isOpen);

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  return (<div>
    Hello World

  </div>);
};



export default Page
