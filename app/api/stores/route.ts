import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function POST(
req: Request,
){
    try{
        const {userId} = auth();
        console.log("This is userId", userId);
        const body = await req.json();
        const {name} = body;
        console.log("This is name", name);
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if(!name){
            return new NextResponse("Name is required", { status: 400 });

        }
       

        const store = await prismadb.store.create({
            data: {
                name,
                userId,
            },
        });
        console.log("This is store", store);

        return new NextResponse(JSON.stringify(store), { status: 201 });
   

    }catch(error){
        console.log('[STORE_POST]',error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}