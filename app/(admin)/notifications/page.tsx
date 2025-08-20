import { getNotificationsByFilter } from "@/services/notificationService";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import Notifications from "@/components/admin-components/notifications/Notifications";

const NotificationsPage = async () => {
  const queryClient = new QueryClient();

  // Prefetch the notifications data for 'all' filter
  await queryClient.prefetchQuery({
    queryKey: ["notifications", "all"],
    queryFn: () => getNotificationsByFilter("all"),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Notifications />
    </HydrationBoundary>
  );
};

export default NotificationsPage;
