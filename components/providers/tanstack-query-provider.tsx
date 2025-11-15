"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function TanstackQueryProvider({ children }: { children: React.ReactNode}) {
	const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: true,
        staleTime: 60 * 1000,
        gcTime: Infinity,
      },
    },
  });
 
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

}
