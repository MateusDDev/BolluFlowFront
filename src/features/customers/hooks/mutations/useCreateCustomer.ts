import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCustomer } from "@/features/customers/services/api/customer.api";
import { mapCustomerModel } from "@/features/customers/domain/customer.mapper";

type CreateCustomerInput = {
    name: string;
    whatsapp: string;
    address: string;
};

export function useCreateCustomer() {
    const client = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateCustomerInput) => {
            const res = await createCustomer(data);

            if (!res.isSuccessful) {
                throw new Error(res.errorMessage ?? "Erro ao criar cliente");
            }

            return mapCustomerModel(res.value!);
        },
        onSuccess: async () => {
            await client.invalidateQueries({ queryKey: ["customers"] });
        },
        onError: (err) => {
            console.error("Erro ao criar cliente:", err);
        }
    });
}
