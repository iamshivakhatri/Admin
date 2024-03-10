import prismadb from '@/lib/prismadb';
import {BillboardForm} from './components/billboard-form';

const BillboardPage = async ({ params }: { params: { billboardId: string } }) => {
    // Check if billboardId is 'new', handle creation of new billboard

    
    

    // Fetch existing billboard
    const billboard = await prismadb.billboard.findUnique({
        where: {
            id: params.billboardId || undefined,
        }
    });


    // Render existing billboard
    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'> 
                <BillboardForm initialData={billboard}/> 
            </div> 
            
        </div>
    );
}

export default BillboardPage;

//http://localhost:3000/296baf98-64d7-4325-947a-02f525d18861/billboards

//http://localhost:3000/296baf98-64d7-4325-947a-02f525d18861/billboards/d2ea560a-b9f5-4315-b6e0-aa722fa4bea3