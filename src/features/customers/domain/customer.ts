import {DeliveryAddressType} from "@/shared/types/deliveryAddressType";

export interface Customer {
    id: number;
    name: string;
    whatsapp: string;
    address: DeliveryAddressType;
    preferences?: string;
    birthdate: Date;
}
