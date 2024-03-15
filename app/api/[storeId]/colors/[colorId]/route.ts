import prismadb from '@/lib/prismadb';
import {auth} from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function GET(
    req: Request,
    {params} : {params: {colorId: string}}
   ){
     try{
      
 
         if(!params.colorId){
             return new NextResponse("color ID is required", {status: 400});
         }

         
 
      const colors = await prismadb.color.findUnique({
         where :{
             id: params.colorId,
         
         },
     })
     return NextResponse.json(colors);
     }catch(error){
         console.log('[COLOR_GET]', error);
         return new NextResponse("Internal Server Error", {status: 500});
     }
 
   }

  export async function PATCH(
  
   req: Request,
   {params} : {params: {storeId: string, colorId: string}}
  ){

    try{
        const {userId} = auth();
        const body = await req.json();
        const {name, value} = body;
        console.log("This is params in api", params);
        console.log("This is userId in api", userId);
      
        if(!userId){
            return new NextResponse("Unauthorized", {status: 401});
        }
        if(!name){
            return new NextResponse("Name is required", {status: 400});
        } 
        if(!value){
            return new NextResponse("Value Id is required", {status: 400});
        } 

        if(!params.colorId){
            return new NextResponse("color id is required", {status: 400});
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





     const colors = await prismadb.color.updateMany({
        where :{
            id: params.colorId,
           
        },
        data:{
            name,
            value
        }
    })
    return NextResponse.json(colors);
    }catch(error){
        console.log('[color_PATCH]', error);
        return new NextResponse("Internal Server Error", {status: 500});
    }

  }

  export async function DELETE(
    req: Request,
    {params} : {params: {storeId: string, colorId: string}}
   ){
     try{
         const {userId} = auth();

    
         if(!userId){
             return new NextResponse("Unauthorized", {status: 401});
         }
       
 
         if(!params.colorId){
             return new NextResponse("colorID is required", {status: 400});
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

 
      const colors= await prismadb.color.deleteMany({
        
         where :{
             id: params.colorId,
         
         },
     })
     return NextResponse.json(colors);
     }catch(error){
         console.log('[COLOR_DELETE]', error);
         return new NextResponse("Internal Server Error", {status: 500});
     }
 
   }