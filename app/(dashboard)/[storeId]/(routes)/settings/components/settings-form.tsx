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



// Access the Store type from PrismaClient
type Store = PrismaClient['Store'];

interface SettingsFormProps {
    initialData: Store;
}

const formSchema = z.object({
    name: z.string().min(1),
});

type SettingsFormValues = z.infer<typeof formSchema>;

export const SettingsForm = ({ initialData }: SettingsFormProps) => {
    const params = useParams();
    const router = useRouter();


    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
    });
    
    const onSubmit = async (data: SettingsFormValues) => {
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
            title="Settings"
            description="Manage store preferences"
            />

            <Button 
            disabled={loading}
            variant = "destructive"
            size="icon"  
            onClick={()=> setOpen(true)}
            >
                <Trash className="h-4 w-4"/>

            </Button>
            
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
                        <FormLabel> Name</FormLabel>
                        <FormControl>  
                        <Input disabled = {loading} {...field} type="text" placeholder="Name" className="w-full"/>
                        </FormControl>                        
                        <FormMessage/>
                    </FormItem>
                )}
                />

            </div>
            <Button disabled={loading} type="submit">
                Save Changes
            </Button>
        
            </form>
        </Form>
        <Separator className="w-full"/>
        <ApiAlert 
         title="test"
         description="test-desc"
         variant="public"
         
         
         />

        </>



    );
};
