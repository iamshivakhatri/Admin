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
import { Product, Image } from "@prisma/client";
import ImageUpload from "@/components/ui/image-upload";




// Access the Store type from PrismaClient


interface ProductFormProps {
    initialData: Product&{
        images: Image[]
    } | null;
}

const formSchema = z.object({
    name: z.string().min(1),
    images: z.object({url:z.string()}).array(),
    price: z.coerce.number().min(1),
    categoryId: z.string().min(1),
    colorId: z.string().min(1),
    sizeId: z.string().min(1),
    isFeatured: z.boolean().default(false).optional(),
    isArchived: z.boolean().default(false).optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;

export const ProductForm = ({ initialData }: ProductFormProps) => {
    const params = useParams();
    const router = useRouter();



    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? "Edit Product" : "Create Product";

    const description = initialData ? "Edit Product" : "Add a new Product";


    const toastMessage = initialData ? "Product Updated" : "Product Created";

    const action = initialData ? "Save Changes" : "Create";


    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData? {
            ...initialData,
            price: parseFloat(String(initialData?.price)),
        }
        : {
            name:'',
            images:[],
            price:0,
            categoryId:'',
            colorId:'',
            sizeId:'',
            isFeatured:false,
            isArchived:false,
        }
    });
    
    const onSubmit = async (data: ProductFormValues) => {
        // update store
        try {
            setLoading(true);
            if(initialData){
                await axios.patch(`/api/${params.storeId}/products/${params.ProductId}`,data );
            }else{
            console.log('values', data);
            await axios.post(`/api/${params.storeId}/products`,data );
            }
            
            
            router.push(`/${params.storeId}/products`)
            router.refresh();
            toast.success(toastMessage);
        } catch (error) {
            
            toast.error('Failed to update Product');
            console.error('[Product_FORM]', error);
        } finally {
            setLoading(false);
        }
    }

    const onDelete = async ()=>{
        try{
     


            setLoading(true);
            await axios.delete(`/api/${params.storeId}/products/${params.ProductId}`);
            
            router.push(`/${params.storeId}/products`);
            router.refresh();
            toast.success('Product deleted successfully');
        }catch(error){
            toast.error('Make sure you remove all categories using this Product first');
            console.error('[Product_DELETE]', error);


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
            <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel> Images</FormLabel>
                        <FormControl>  
                        <ImageUpload 
                        value={field.value.map((image) => image.url)}
                        disabled={loading}
                        onChange={(url)=> field.onChange([...field.value, {url}])}
                        onRemove={()=> field.onChange('')}

                        />
                        </FormControl>                        
                        <FormMessage/>
                    </FormItem>
                )}
                />

            <div className="grid grid-cols-3 gap-8">
                <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel> Label</FormLabel>
                        <FormControl>  
                        <Input disabled = {loading} placeholder="Product Label" className="w-full" {...field}/>
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