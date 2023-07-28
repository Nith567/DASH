import React from 'react'
import prismadb from '@/lib/prismadb'
import Navbar from '../../components/navbar';

interface DashboardPageProps{
   params:{storeId:string}
};

const DashboardPage: React.FC<DashboardPageProps> = async ({ 
    params
  }) => {
     const store=await prisma?.store.findFirst({
        where:{
            id:params.storeId
        }
     })
     return(
        <div>Active:{store?.name}
        {/* <Navbar/> */}
        </div>

     )
  }

export default DashboardPage