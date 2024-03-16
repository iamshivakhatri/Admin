import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function POST(
req: Request,
{params}:{params:{storeId:string}}
){
    try{
        const {userId} = auth();
        console.log("This is userId", userId);
        const body = await req.json();
        const {
            name,
            price,
            categoryId,
            colorId,
            sizeId,
            images,
            isFeatured,
            isArchived,



        } = body;
      
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if(!name){
            return new NextResponse("Name is required", { status: 400 });

        }
        if(!price){
            return new NextResponse("Price  is required", { status: 400 });

        }
        if(!categoryId){
            return new NextResponse("Category Id  is required", { status: 400 });

        }
        if(!colorId){
            return new NextResponse("Color Id  is required", { status: 400 });

        }
        if(!sizeId){
            return new NextResponse("sizeId  is required", { status: 400 });

        }
        if(!images){
            return new NextResponse("Images  is required", { status: 400 });

        }
       
        if(!params.storeId){
            return new NextResponse("StoreId  is required", { status: 400 });
 
        }

        const storeByUserId   = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId,
            },
        });

        if(!storeByUserId){
            return new NextResponse("Unauthorized", { status: 403 });
        }

       

        const products = await prismadb.product.create({
            data: {
            name,
            price,
            categoryId,
            colorId,
            sizeId,
            images:{
                createMany:{
                    data:[
                        ...images.map((image:{url:string})=>image)
                    ]
                

            }},
            isFeatured,
            isArchived,
            storeId: params.storeId
            },
        });
        return new NextResponse(JSON.stringify(products));
   

    }catch(error){
        console.log('[PRODUCTS_POST]',error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function GET(
    req: Request,
    {params}:{params:{storeId:string}}
    ){
        try{
            const {searchParams} = new URL(req.url);
            const categoryId = searchParams.get('categoryId') || undefined;
            const colorId = searchParams.get('colorId') || undefined;
            const sizeId = searchParams.get('sizeId') || undefined;
            const isFeatured = searchParams.get('isFeatured');
            const isArchived = searchParams.get('isArchived');
            
            if(!params.storeId){
                return new NextResponse("StoreId  is required", { status: 400 });
    
            }
    
            const products = await prismadb.product.findMany({
                where: {
                    categoryId,
                    colorId,
                    sizeId,
                    isFeatured: isFeatured? true: undefined,
                    isArchived: false,

                
                    storeId: params.storeId
                },
                include: {
                    images: true,
                    category: true,
                    size: true,
                    color: true,
    
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
         
    
            return new NextResponse(JSON.stringify(products));
       
    
        }catch(error){
            console.log('[PRODUCTS_ERROR]',error);
            return new NextResponse("Internal Server Error", { status: 500 });
        }
    }