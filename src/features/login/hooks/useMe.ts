"use client";

import { useQuery } from "@tanstack/react-query";
import { mapUserToUserModel } from "@/features/login/domain/user.mapper";
import { me } from "@/features/login/services/api/user.api.js";

export function useMe() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await me();

      if (!res.isSuccessful) {
        throw new Error(res.errorMessage ?? "Not authenticated");
      }

      return mapUserToUserModel(res.value!);
    },
    retry: false,
  });
}
