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
        const {name, value} = body;
        console.log("This is name", name);
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if(!name){
            return new NextResponse("Name is required", { status: 400 });

        }
        if(!value){
            return new NextResponse("Value  is required", { status: 400 });

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

       

        const colors = await prismadb.color.create({
            data: {
                name,
                value,
                storeId: params.storeId
            },
        });


        return new NextResponse(JSON.stringify(colors));
   

    }catch(error){
        console.log('[COLOR_POST]',error);
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
    
            const colors = await prismadb.size.findMany({
                where: {
                   
                    storeId: params.storeId
                },
            });
         
    
            return new NextResponse(JSON.stringify(colors));
       
    
        }catch(error){
            console.log('[COLORS_ERROR]',error);
            return new NextResponse("Internal Server Error", { status: 500 });
        }
    }