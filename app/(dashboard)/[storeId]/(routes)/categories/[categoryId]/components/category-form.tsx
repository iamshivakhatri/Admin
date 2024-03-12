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
import { Category } from "@prisma/client";
import ImageUpload from "@/components/ui/image-upload";




// Access the Store type from PrismaClient


interface CategoryFormProps {
    initialData: Category | null;
}

const formSchema = z.object({
    name: z.string().min(1),
    billboardId: z.string().min(1),
});

type CategoryFormValues = z.infer<typeof formSchema>;

export const CategoryForm = ({ initialData }: CategoryFormProps) => {
    const params = useParams();
    const router = useRouter();



    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? "Edit Category" : "Create Category";

    const description = initialData ? "Edit Category" : "Add a new Category";


    const toastMessage = initialData ? "Category Updated" : "Category Created";

    const action = initialData ? "Save Changes" : "Create";


    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData||{
            name:'',
            billboardId:'',
        }
    });
    
    const onSubmit = async (data: CategoryFormValues) => {
        // update store
        try {
            setLoading(true);
            if(initialData){
                await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`,data );
            }else{
            console.log('values', data);
            await axios.post(`/api/${params.storeId}/categories`,data );
            }
            
            
            router.push(`/${params.storeId}/categories`)
            router.refresh();
            toast.success(toastMessage);
        } catch (error) {
            
            toast.error('Failed to update categories');
            console.error('[CATEGORY_FORM]', error);
        } finally {
            setLoading(false);
        }
    }

    const onDelete = async ()=>{
        try{
     


            setLoading(true);
            await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`);
            
            router.push(`/${params.storeId}/categories`);
            router.refresh();
            toast.success('Category deleted successfully');
        }catch(error){
            toast.error('Make sure you remove all categories using this category first');
            console.error('[CATEGORY_DELETE]', error);


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
                        <FormLabel> Label</FormLabel>
                        <FormControl>  
                        <Input disabled = {loading} placeholder="Category name" className="w-full" {...field}/>
                        </FormControl>                        
                        <FormMessage/>
                    </FormItem>
                )}
                />

            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel> Label</FormLabel>
                        <FormControl>  
                        <Input disabled = {loading} placeholder="Category name" className="w-full" {...field}/>
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
