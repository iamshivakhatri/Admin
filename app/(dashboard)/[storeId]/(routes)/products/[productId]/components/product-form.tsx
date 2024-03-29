"use client";

import * as z from "zod";
import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { Form, FormControl, FormDescription, FormField , FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";
import { Product, Image, Category, Color, Size } from "@prisma/client";
import ImageUpload from "@/components/ui/image-upload";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { set } from "date-fns";




// Access the Store type from PrismaClient


interface ProductFormProps {
    initialData: Product&{
        images: Image[]
    } | null;
    categories: Category[];
    colors: Color[];
    sizes: Size[];
}

const formSchema = z.object({
    name: z.string().min(1),
    images: z.object({url: z.string()}).array(),
    price: z.coerce.number().min(1),
    categoryId: z.string().min(1),
    colorId: z.string().min(1),
    sizeId: z.string().min(1),
    isFeatured: z.boolean().default(false).optional(),
    isArchived: z.boolean().default(false).optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;

export const ProductForm = ({ initialData, categories, colors, sizes }: ProductFormProps) => {
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const params = useParams();
    const router = useRouter();



    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData && initialData.images) {
            setImageUrls(initialData.images.map(image => image.url));
        }
    }, [initialData]);

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
            const formDataWithImages = {
                ...data,
                images: imageUrls.map(url => ({ url }))
            };
            if(initialData){
                await axios.patch(`/api/${params.storeId}/products/${params.productId}`,formDataWithImages );
            }else{
            console.log('This is the data to be uploaded values');
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
            await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
            
            router.push(`/${params.storeId}/products`);
            router.refresh();
            toast.success('Product deleted successfully');
        }catch(error){
            toast.error('Something went wrong. Please try again later.');
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
                        disabled={loading}
                        onChange={(url) => {
                            // Add the new URL to the imageUrls array
                            setImageUrls((prevUrls) => [...prevUrls, url]);
                            // Call onChange with the updated array
                            field.onChange([...field.value, {url}]);
                        }}
                        onRemove={(url) => {
                            // Remove the URL from the imageUrls array
                            setImageUrls((prevUrls) => prevUrls.filter((imageUrl) => imageUrl !== url));
                            // Call onChange with the updated array
                            field.onChange([...field.value.filter((current) => current.url !== url)]);
                        }}
                        value={imageUrls? imageUrls: []}

                    />
              
                        </FormControl>                        
                        <FormMessage/>
                    </FormItem>
                )}
                />

            <div className="grid grid-cols-3 gap-8">
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel> Name</FormLabel>
                        <FormControl>  
                        <Input disabled = {loading} placeholder="product name" className="w-full" {...field}/>
                        </FormControl>                        
                        <FormMessage/>
                    </FormItem>
                )}
                />

            <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel> Price</FormLabel>
                        <FormControl>  
                        <Input type="number" disabled = {loading} placeholder="9.99" className="w-full" {...field}/>
                        </FormControl>                        
                        <FormMessage/>
                    </FormItem>
                )}
                />

            <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel> Category </FormLabel>
                        <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue defaultValue={field.value} placeholder="Select a category"/>

                                </SelectTrigger>

                            </FormControl>
                            <SelectContent>
                                {categories.map((category)=>(
                                   <SelectItem key={category.id} value={category.id}>
                                       {category.name}
                                      </SelectItem>
                                    
                                ))}
                            </SelectContent>


                        </Select>
                                             
                        <FormMessage/>
                    </FormItem>
                     )}
                     />

          <FormField
                control={form.control}
                name="sizeId"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel> Size </FormLabel>
                        <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue defaultValue={field.value} placeholder="Select a size"/>

                                </SelectTrigger>

                            </FormControl>
                            <SelectContent>
                                {sizes.map((size)=>(
                                   <SelectItem key={size.id} value={size.id}>
                                       {size.name}
                                      </SelectItem>
                                    
                                ))}
                            </SelectContent>


                        </Select>
                                             
                        <FormMessage/>
                    </FormItem>
                     )}
                     />

            <FormField
                control={form.control}
                name="colorId"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel> Color </FormLabel>
                        <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue defaultValue={field.value} placeholder="Select a color"/>

                                </SelectTrigger>

                            </FormControl>
                            <SelectContent>
                                {colors.map((color)=>(
                                   <SelectItem key={color.id} value={color.id}>
                                       {color.name}
                                      </SelectItem>
                                    
                                ))}
                            </SelectContent>


                        </Select>
                                             
                        <FormMessage/>
                    </FormItem>
                     )}
                    
                    
            />

            <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>  
                            <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}

                            />
                        </FormControl> 
                        <div className="space-y-1  leading-none">
                            <FormLabel>Featured</FormLabel>
                            <FormDescription>
                                This product will appear on the home page
                            </FormDescription>
                        </div>                       
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="isArchived"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>  
                            <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}

                            />
                        </FormControl> 
                        <div className="space-y-1  leading-none">
                            <FormLabel>Archived</FormLabel>
                            <FormDescription>
                                This product will not appear anywhere in the store.
                            </FormDescription>
                        </div>                       
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
