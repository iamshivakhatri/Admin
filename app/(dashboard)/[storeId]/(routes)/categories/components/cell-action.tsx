"use client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { BillboardColumn } from "./columns";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { useState } from "react";
import { AlertModal } from "@/components/modals/alert-modal";



interface CellActionProps {
    data: BillboardColumn;
   
}

export const CellAction:React.FC<CellActionProps> = ({data})=>{
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const router = useRouter();
    const params = useParams();

    const onCopy = (id:string)=>{
        navigator.clipboard.writeText(id);
        toast.success('Id Copied to clipboard.');

    };

    const onDelete = async ()=>{
        try{
            


            setLoading(true);
            await axios.delete(`/api/${params.storeId}/billboards/${data.id}`);
            router.refresh();
            
            toast.success('Billboard deleted successfully');
        }catch(error){
            toast.error('Make sure you remove all categories using this billboard first');
            console.error('[BILLBOARD_DELETE]', error);


        }finally{
            setLoading(false);
            setOpen(false);
        
        }

    }

    return(
        <>
        <AlertModal 
        isOpen={open}
        onClose={()=> setOpen(false)}
        onConfirm={onDelete}
        loading={loading}

        
        />
       <DropdownMenu> 
        <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only"> Open menu</span>
            <MoreHorizontal className="h-5 w-5"/>

        </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuLabel>
                Actions
            </DropdownMenuLabel>
                <DropdownMenuItem onClick={()=> onCopy(data.id)}>
                    <Copy className="h-4 w-4 mr-2"/>
                    Copy Id
                </DropdownMenuItem>
                <DropdownMenuItem onClick={()=> router.push(`/${params.storeId}/billboards/${data.id}`)}>
                    <Edit className="h-4 w-4 mr-2"/>
                    Update
                </DropdownMenuItem>
                <DropdownMenuItem onClick={()=> setOpen(true)}>
                    <Trash className="h-4 w-4 mr-2"/>
                    Delete
                </DropdownMenuItem>

           

        </DropdownMenuContent>

       </DropdownMenu>
       </>
    )
}