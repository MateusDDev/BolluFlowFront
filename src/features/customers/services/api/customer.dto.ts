import {DeliveryAddressType} from "@/shared/types/deliveryAddressType";

export interface CustomerDTO {
    id: number;
    name: string;
    whatsapp: string;
    deliveryAddress: DeliveryAddressType;
    preferences?: string;
    birthday?: Date;
}
