"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Toaster } from "sonner";
import dynamic from "next/dynamic";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Providers = dynamic(() => import("@/components/layout/Providers"), {
  ssr: false,
});

export default function LayoutProvider({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    document.body.dataset.pathname = pathname;
  }, [pathname]);

  return (
    <Providers>
      <Header />
      <main>{children}</main>
      <Footer />
      <Toaster
        position="bottom-left"
        theme="dark"
        expand={true}
        toastOptions={{
          classNames: {
            toast: "toast-block",
          },
        }}
      />
    </Providers>
  );
}
