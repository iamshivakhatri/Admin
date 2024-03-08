"use client";

import * as z from "zod";
import { PrismaClient } from '@prisma/client';
import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Form, FormControl, FormField , FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";
import { ApiAlert } from "@/components/ui/api-alert";
import { useOrigin } from "@/hooks/use-origin";
import { Billboard } from "@prisma/client";




// Access the Store type from PrismaClient


interface BillboardFormProps {
    initialData: Billboard | null;
}

const formSchema = z.object({
    label: z.string().min(1),
    imageUrl: z.string().min(1),
});

type BillboardFormValues = z.infer<typeof formSchema>;

export const BillboardForm = ({ initialData }: BillboardFormProps) => {
    const params = useParams();
    const router = useRouter();
    const origin = useOrigin();


    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? "Edit Billboard" : "Create Billboard";

    const description = initialData ? "Edit Billboard" : "Add a new billboard";


    const toastMessage = initialData ? "Billboard Updated" : "Billboard Created";

    const action = initialData ? "Save Changes" : "Create";


    const form = useForm<BillboardFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData||{
            label:'',
            imageUrl:'',
        }
    });
    
    const onSubmit = async (data: BillboardFormValues) => {
        // update store
        try {
            setLoading(true);
            console.log('values', data);
            await axios.patch(`/api/stores/${params.storeId}`,data );
            router.refresh();
            toast.success('Store updated successfully');
        } catch (error) {
            toast.error('Failed to update store');
            console.error('[SETTINGS_FORM]', error);
        } finally {
            setLoading(false);
        }
    }

    const onDelete = async ()=>{
        try{
            console.log("This is printing from ondelete function");


            setLoading(true);
            await axios.delete(`/api/stores/${params.storeId}`);
            router.refresh();
            router.push("/");
            toast.success('Store deleted successfully');
        }catch(error){
            toast.error('Failed to delete store');
            console.error('[SETTINGS_DELETE]', error);


        }finally{
            setLoading(false);
        
        }

    }

    return (
        <>
        <AlertModal 
        isOpen={open}
        onClose={()=> setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
         />
        
        <div className='flex items-center justify-between'>
            <Heading
            title={title}
            description={description}
            />
        {initialData && (
            <Button 
            disabled={loading}
            variant = "destructive"
            size="icon"  
            onClick={()=> setOpen(true)}
            >
                <Trash className="h-4 w-4"/>

            </Button>   
        
        )}
            
            
        </div>

        <Separator className="w-full"/>

        <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)}  className="space-y-8 w-full">
            <div className="grid grid-cols-3 gap-8">
                <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel> Label</FormLabel>
                        <FormControl>  
                        <Input disabled = {loading} {...field} type="text" placeholder="Billboard Label" className="w-full"/>
                        </FormControl>                        
                        <FormMessage/>
                    </FormItem>
                )}
                />

            </div>
            <Button disabled={loading} type="submit">
                {action}
            </Button>
        
            </form>
        </Form>
        <Separator className="w-full"/>
        

        </>



    );
};
