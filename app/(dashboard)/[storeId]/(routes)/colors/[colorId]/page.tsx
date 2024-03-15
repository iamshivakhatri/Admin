import prismadb from '@/lib/prismadb';
import {ColorForm} from './components/color-form';

const ColorPage = async ({ params }: { params: { colorId: string } }) => {
    // Check if ColorId is 'new', handle creation of new Color

    
    

    // Fetch existing Color
    const color = await prismadb.color.findUnique({
        where: {
            id: params.colorId || undefined,
        }
    });


    // Render existing Color
    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'> 
                <ColorForm initialData={color}/> 
            </div> 
            
        </div>
    );
}

export default ColorPage;

//http://localhost:3000/296baf98-64d7-4325-947a-02f525d18861/Colors

//http://localhost:3000/296baf98-64d7-4325-947a-02f525d18861/Colors/d2ea560a-b9f5-4315-b6e0-aa722fa4bea3