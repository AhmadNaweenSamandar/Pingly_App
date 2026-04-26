import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import "./style/index.css";
import App from "./app/App";


// 1. Create the Client (The Cache Brain)
// We declare this OUTSIDE the component tree so it doesn't get recreated on every render.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // These are enterprise-grade defaults
      staleTime: 1000 * 60 * 5, // Data stays "fresh" for 5 minutes before refetching in background
      refetchOnWindowFocus: false, // Prevents annoying refetches every time the user clicks away and back
      retry: 1, // Only retry failed requests once to save server load
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 2. Wrap your application with the Provider */}
    <QueryClientProvider client={queryClient}>
      
      <App />
      
      {/* 3. The Devtools (Only renders in development mode) 
          This gives you a floating button in the bottom corner of your app.
          Click it to literally see inside your cache, watch queries fire, and test loading states!
      */}
      <ReactQueryDevtools initialIsOpen={false} />
      
    </QueryClientProvider>
  </React.StrictMode>
);
