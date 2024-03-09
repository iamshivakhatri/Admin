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
        const {label, imageUrl} = body;
        console.log("This is label", label);
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if(!label){
            return new NextResponse("Label is required", { status: 400 });

        }
        if(!imageUrl){
            return new NextResponse("ImageUrl  is required", { status: 400 });

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

       

        const billboard = await prismadb.billboard.create({
            data: {
                label,
                imageUrl,
                storeId: params.storeId
            },
        });
        console.log("This is store", label);

        return new NextResponse(JSON.stringify(billboard));
   

    }catch(error){
        console.log('[STORE_POST]',error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function GET(
    req: Request,
    {params}:{params:{storeId:string}}
    ){
        try{
            
            if(!params.storeId){
                return new NextResponse("StoreId  is required", { status: 400 });
    
            }
    
            const billboards = await prismadb.billboard.findMany({
                where: {
                   
                    storeId: params.storeId
                },
            });
         
    
            return new NextResponse(JSON.stringify(billboards));
       
    
        }catch(error){
            console.log('[BILLBOARDS_ERROR]',error);
            return new NextResponse("Internal Server Error", { status: 500 });
        }
    }