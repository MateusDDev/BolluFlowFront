import { ResultOf } from "@/shared/types/result";
import { CustomerDTO } from "./customer.dto";
import {apiClient} from "@/shared/api/client";

export function getCustomers() {
    return apiClient<ResultOf<CustomerDTO[]>>("/customers", "GET");
}

export function createCustomer(data: {
    name: string;
    whatsapp: string;
    address: string;
}) {
    return apiClient<ResultOf<CustomerDTO>>("/customers", "POST", data);
}

export function updateCustomer(id: number, data: Partial<CustomerDTO>) {
    return apiClient<ResultOf<CustomerDTO>>(`/customers/${id}`, "PUT", data);
}

export function deleteCustomer(id: number) {
    return apiClient<ResultOf<null>>(`/customers/${id}`, "DELETE");
}