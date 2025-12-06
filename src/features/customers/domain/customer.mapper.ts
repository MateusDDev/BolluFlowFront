import { Customer } from "./customer";
import {CustomerDTO} from "@/features/customers/services/api/customer.dto";

export function mapCustomerDTO(dto: CustomerDTO): Customer {
    return {
        id: dto.id,
        name: dto.name,
        whatsapp: dto.whatsapp,
        address: dto.address,
    };
}