export interface User {
    id: number;
    name: string;
    email: string;
    token: string;
    profileImageUrl?: string;
    createdAt: Date;
}