import { ResultOf } from "@/shared/types/result";
import { CustomerModel } from "./customer.model";
import {apiClient} from "@/shared/api/client";

export function getCustomers() {
    return apiClient<ResultOf<CustomerModel[]>>("/customers", "GET");
}

export function createCustomer(data: {
    name: string;
    whatsapp: string;
    address: string;
}) {
    return apiClient<ResultOf<CustomerModel>>("/customers", "POST", data);
}

export function updateCustomer(id: number, data: Partial<CustomerModel>) {
    return apiClient<ResultOf<CustomerModel>>(`/customers/${id}`, "PUT", data);
}

export function deleteCustomer(id: number) {
    return apiClient<ResultOf<null>>(`/customers/${id}`, "DELETE");
}