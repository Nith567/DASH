import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { z } from "zod";
import prismadb from '@/lib/prismadb';

export async function POST(
  req: Request,
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    const nameExists = await prismadb.store.findFirst({
        where: {
          name,
        },
      });

 if(nameExists){
     return new Response("store name  already exists please try another ", { status: 409 })
    }

    const store = await prismadb.store.create({
      data: {
        name,
        userId,
      }
    });
  
    return NextResponse.json(store);
  } catch (error) {
    if (error instanceof z.ZodError) {

        return new Response(error.message, { status: 422 });
      }
    console.log('so the [STORES_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};