import prismadb from '@/lib/prismadb';
import {SizeForm} from './components/size-form';

const SizePage = async ({ params }: { params: { sizeId: string } }) => {
    // Check if SizeId is 'new', handle creation of new Size

    
    

    // Fetch existing Size
    const size = await prismadb.size.findUnique({
        where: {
            id: params.sizeId || undefined,
        }
    });


    // Render existing Size
    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'> 
                <SizeForm initialData={size}/> 
            </div> 
            
        </div>
    );
}

export default SizePage;

//http://localhost:3000/296baf98-64d7-4325-947a-02f525d18861/Sizes

//http://localhost:3000/296baf98-64d7-4325-947a-02f525d18861/Sizes/d2ea560a-b9f5-4315-b6e0-aa722fa4bea3