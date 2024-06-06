import { Event } from './event.type';
import { User } from './user.type';

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETE = 'COMPLETE',
  WAITING = 'WAITING',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

export interface Transaction {
    id: number;
    amount: number;
    total: number;
    status: string;
    eventId: number;
    userId: number;
    paymentProof: string;
    userVoucherId?: number | null;
    createdAt: string;

    event: Event
    user: User
}

export interface IFormTransaction {
    total: number;
    amount: number;
    status: string;
    userId?: number;
    eventId?: number
    transactionId?: number;
    paymentProof: File[]
    userVoucherId?: number | null
}