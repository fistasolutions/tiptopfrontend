import { getProducts } from '@/services/productService';
import ProductManagement from '@/components/products/Product-Management';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';

const page = async () => {
  const queryClient = new QueryClient();
  const userId = 2; // In production, get this from the session

  // Prefetch the products data
  await queryClient.prefetchQuery({
    queryKey: ['products', userId],
    queryFn: () => getProducts(userId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductManagement />
    </HydrationBoundary>
  );
};

export default page;
