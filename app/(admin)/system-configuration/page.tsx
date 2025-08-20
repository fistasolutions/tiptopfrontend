import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import SystemConfiguration from "@/components/admin-components/system-configuration/SystemConfiguration";

const Page = async () => {
  const queryClient = new QueryClient();

  // Prefetch any system configuration data if needed
  // await queryClient.prefetchQuery({
  //   queryKey: ['system-configuration'],
  //   queryFn: () => getSystemConfiguration(),
  // });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SystemConfiguration />
    </HydrationBoundary>
  );
};

export default Page;
