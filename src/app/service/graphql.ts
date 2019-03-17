import { Injectable } from '@angular/core';
import { Query } from 'apollo-angular';
import { queryUsers,queryUserWithGroup, queryUserWithRole } from './user';
import { createUser,updateUser,deleteUsers } from './user';
import { receiveMessage,queryMessage } from './message';
import { queryTest } from './test';

export interface Response {
}

@Injectable({
    providedIn: 'root',
  }) 
export class ServiceGQl extends Query<Response> {
    public static userGQL = queryUsers;
    public static userWithGroupGQL = queryUserWithGroup;
    public static userWithRoleGQL = queryUserWithRole;
    public static updateUserGQL = updateUser;
    public static createUserGQL = createUser;
    public static deleteUserGQL = deleteUsers ;
    public static queryTest = queryTest ; 
    public static receiveMessageGQL = receiveMessage ; 
    public static queryMessageGQL = queryMessage ;

}