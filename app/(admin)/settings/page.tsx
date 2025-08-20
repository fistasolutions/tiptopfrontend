"use client";
import React from "react";
import { getSettings } from "@/services/settingsService";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import Settings from "@/components/settings/Settings";

const SettingsPage = async () => {
  const queryClient = new QueryClient();

  // Prefetch the settings data
  await queryClient.prefetchQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Settings />
    </HydrationBoundary>
  );
};

export default SettingsPage;
