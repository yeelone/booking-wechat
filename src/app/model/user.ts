import { Group } from "./group";
import { Role } from "./role";

export interface User {
    id: number;
    username: string;
    password: string;
    email:string;
    id_card: string ;
    picture:   string;
    createdAt: string; 
    updatedAt: string; 
    group:number;
    groups: Group[];
    roles: Role[];
    state:number ; 
    token:string;
}