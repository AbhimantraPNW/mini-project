import { Event } from "./event.type";
import { User } from "./user.type";

export interface Review {
    id: number;
    userId: number;
    eventId: number;
    rating: number;
    comment: string;
    
    event: Event
    user: User
}

export interface IFormReview {
    userId? : number;
    eventId? : number;
    rating: string;
    comment: string;
}