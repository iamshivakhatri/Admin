import prismadb from '@/lib/prismadb';
import {CategoryForm} from './components/category-form';

const CategoryPage = async ({ params }: { params: { categoryId: string, storeId: string } }) => {
    // Check if billboardId is 'new', handle creation of new billboard

    
    

    // Fetch existing billboard
    const category = await prismadb.category.findUnique({
        where: {
            id: params.categoryId || undefined,
        }
    });

    const billboards = await prismadb.billboard.findMany({
        where:{
            storeId: params.storeId,

        }
    })


    // Render existing billboard
    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'> 
                <CategoryForm billboards={billboards} initialData={category}/> 
            </div> 
            
        </div>
    );
}

export default CategoryPage;

//http://localhost:3000/296baf98-64d7-4325-947a-02f525d18861/billboards

//http://localhost:3000/296baf98-64d7-4325-947a-02f525d18861/billboards/d2ea560a-b9f5-4315-b6e0-aa722fa4bea3