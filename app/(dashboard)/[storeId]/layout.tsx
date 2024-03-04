import prismadb from "@/lib/prismadb";
import {auth} from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: { storeId: string }
}) {
    const {userId} = auth();
    console.log("This is userId", userId);
    if(!userId){
        redirect("/sign-in");
    }
    { /*  id: params.storeId  */}
   { /*  id is passed from the url and userId is obtained from the auth clerk and we check the store where both id and userId matches  */}
    const store = await prismadb.store.findFirst({
        where: { 
          id: params.storeId, 
          userId
        }
    });

    if(!store){
        redirect("/");
    }

    return (
        <>
        <div>
            This will be a navbar
        </div>
        {children}
        </>
    );
  
    
}