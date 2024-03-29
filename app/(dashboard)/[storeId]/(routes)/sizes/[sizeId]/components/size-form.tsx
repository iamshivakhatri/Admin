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
import { Size } from "@prisma/client";
import ImageUpload from "@/components/ui/image-upload";




// Access the Store type from PrismaClient


interface SizeFormProps {
    initialData: Size | null;
}

const formSchema = z.object({
    name: z.string().min(1),
    value: z.string().min(1),
});

type SizeFormValues = z.infer<typeof formSchema>;

export const SizeForm = ({ initialData }: SizeFormProps) => {
    const params = useParams();
    const router = useRouter();



    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? "Edit Size" : "Create Size";

    const description = initialData ? "Edit Size" : "Add a new Size";


    const toastMessage = initialData ? "Size Updated" : "Size Created";

    const action = initialData ? "Save Changes" : "Create";


    const form = useForm<SizeFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData||{
            name:'',
            value:'',
        }
    });
    
    const onSubmit = async (data: SizeFormValues) => {
        // update store
        try {
            setLoading(true);
            if(initialData){
                await axios.patch(`/api/${params.storeId}/sizes/${params.sizeId}`,data );
            }else{
            console.log('values', data);
            await axios.post(`/api/${params.storeId}/sizes`,data );
            }
            
            
            router.push(`/${params.storeId}/sizes`)
            router.refresh();
            toast.success(toastMessage);
        } catch (error) {
            
            toast.error('Failed to update Size');
            console.error('[Size_FORM]', error);
        } finally {
            setLoading(false);
        }
    }

    const onDelete = async ()=>{
        try{
     


            setLoading(true);
            await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`);
            
            router.push(`/${params.storeId}/sizes`);
            router.refresh();
            toast.success('Size deleted successfully');
        }catch(error){
            toast.error('Make sure you remove all categories using this size first');
            console.error('[SIZE_DELETE]', error);


        }finally{
            setLoading(false);
            setOpen(false);
        
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
                name="name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel> Value</FormLabel>
                        <FormControl>  
                        <Input disabled = {loading} placeholder="Size Name" className="w-full" {...field}/>
                        </FormControl>                        
                        <FormMessage/>
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel> Value</FormLabel>
                        <FormControl>  
                        <Input disabled = {loading} placeholder="Size Label" className="w-full" {...field}/>
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

        

        </>



    );
};
