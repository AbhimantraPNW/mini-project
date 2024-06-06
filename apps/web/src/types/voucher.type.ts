export interface Voucher {
    id: number;
    code: string;
    discountAmount: number;
    limit: number;  
    expirationDate: Date;
    createdAt: Date;
    updatedAt: Date
}