"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { mapUserToUserModel } from "@/features/login/domain/user.mapper";
import { login } from "@/features/login/services/api/user.api.js";

type LoginPayload = {
  email: string;
  password: string;
};

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ email, password }: LoginPayload) => {
      const res = await login(email, password);

      if (!res.isSuccessful) {
        throw new Error(res.errorMessage ?? "Erro ao fazer login");
      }

      const user = mapUserToUserModel(res.value!);

      localStorage.setItem("authToken", user.token ?? "");

      return user;
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["user"] });
    },

    onError: (err) => {
      console.error("Erro ao fazer login:", err);
    },
  });
}
