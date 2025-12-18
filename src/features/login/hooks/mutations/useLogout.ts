"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return () => {
    localStorage.removeItem("authToken");

    queryClient.removeQueries({ queryKey: ["user"] });

    router.push("/login");
  };
}
