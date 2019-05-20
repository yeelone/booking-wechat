import { User } from './user';

export class Comment {
    id:number;
    userId:number;
    user:User;
    body:string;
    room:string;
    createdAt:string;
}