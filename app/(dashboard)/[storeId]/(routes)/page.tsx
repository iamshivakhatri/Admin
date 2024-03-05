import prismadb from "@/lib/prismadb";

interface DashboardPageProps {
    params: { storeId: string }
}

//regula react functional component which accepts the params as the argument. Interface is just created to define the type of the argument
const DashboardPage: React.FC<DashboardPageProps> = async ({params}) => {

    const store = await prismadb.store.findFirst({
        where:{
            id: params.storeId
        }
    });
    return ( 
        <div>
            <h1>Dashboard Page</h1>
            <p>Active Store: {store?.name} </p>
        </div>
     );
}
 
export default DashboardPage;

