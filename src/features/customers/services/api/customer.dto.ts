import {DeliveryAddressType} from "@/shared/types/deliveryAddressType";

export interface CustomerDTO {
    id: number;
    name: string;
    whatsapp: string;
    address: DeliveryAddressType;
    preferences?: string;
    birthdate: Date;
}
