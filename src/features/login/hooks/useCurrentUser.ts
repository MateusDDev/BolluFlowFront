"use client";

import { useQueryClient } from "@tanstack/react-query";
import { UserModel } from "@/features/login/services/api/user.model";

export function useCurrentUser() {
  const queryClient = useQueryClient();

  return queryClient.getQueryData<UserModel>(["user"]);
}
