import { getFacilities } from "@/services/facilityService";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import FacilitiesManagement from "@/components/admin-components/facilities/FacilitiesManagement";

const FacilitiesPage = async () => {
  const queryClient = new QueryClient();

  // Prefetch the facilities data
  await queryClient.prefetchQuery({
    queryKey: ["facilities"],
    queryFn: getFacilities,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FacilitiesManagement />
    </HydrationBoundary>
  );
};

export default FacilitiesPage;
