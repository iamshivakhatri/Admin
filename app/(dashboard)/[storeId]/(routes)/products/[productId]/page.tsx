import prismadb from '@/lib/prismadb';
import {ProductForm} from './components/product-form';

const ProductPage = async ({ params }: { params: { productId: string } }) => {
    // Check if ProductId is 'new', handle creation of new Product

    
    

    // Fetch existing Product
    const product = await prismadb.product.findUnique({
        where: {
            id: params.productId || undefined,

        },
        include: {
            images:true,
        }

    });


    // Render existing Product
    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'> 
                <ProductForm initialData={product}/> 
            </div> 
            
        </div>
    );
}

export default ProductPage;

//http://localhost:3000/296baf98-64d7-4325-947a-02f525d18861/Products

//http://localhost:3000/296baf98-64d7-4325-947a-02f525d18861/Products/d2ea560a-b9f5-4315-b6e0-aa722fa4bea3