import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import prismadb from '@/lib/prismadb';
import { Billboard, Category } from '@prisma/client';
import Cors from 'cors';
// Initializing the cors middleware with allowed methods
const corsMiddleware = Cors({
  methods: ['POST', 'GET', 'HEAD'],
});

async function runMiddleware(req:Request, res:any, fn:any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result:any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req:any, res:any) {
  try {
    // Run the CORS middleware first
    await runMiddleware(req, res, corsMiddleware);

    // Now, based on the HTTP method (POST or GET), call the appropriate handler function
    if (req.method === 'POST') {
      return await POST(req, req.query);
    } else if (req.method === 'GET') {
      return await GET(req, req.query);
    } else {
      return new NextResponse("Method not allowed", { status: 405 });
    }
  } catch (error) {
    console.log('[API ERROR]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}





export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const {name,billboardId } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!billboardId) {
      return new NextResponse("BillboardIdis required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const category = await prismadb.category.create({
      data: {
        name,
        billboardId,
        storeId: params.storeId,
      }
    });
  
    return NextResponse.json(category);
  } catch (error) {
    console.log('[CATEGORIES_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const categories = await prismadb.category.findMany({
      where: {
        storeId: params.storeId
      }
    });
  
    return NextResponse.json(categories);
  } catch (error) {
    console.log('[CATEGORIES_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};