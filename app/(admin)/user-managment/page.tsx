import { getUsers } from "@/services/userService";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import UserManagement from "@/components/admin-components/user/UserManagment";

const page = async () => {
  const queryClient = new QueryClient();

  // Prefetch the users data
  await queryClient.prefetchQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserManagement />
    </HydrationBoundary>
  );
};

export default page;
