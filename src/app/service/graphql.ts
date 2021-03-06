import { Injectable } from '@angular/core';
import { Query } from 'apollo-angular';
import { receiveMessage,queryMessage } from './message';
import { queryTickets, updateUser, loginUser, logoutUser, queryCanteensOfGroup, bookingBreakfast, bookingLunch, bookingDinner, queryBooking, cancelBooking, spend, transfer, queryCanteensByAdmin, queryConfig, subComments, queryComments, createComment } from './user';

export interface Response {
}

@Injectable({
    providedIn: 'root',
  }) 
export class ServiceGQl extends Query<Response> {
    public static receiveMessageGQL = receiveMessage ; 
    public static queryMessageGQL = queryMessage ;

    public static queryTicketsGQL = queryTickets ;
    public static updateUserGQL = updateUser;
    public static loginGQL = loginUser;
    public static logoutGQL = logoutUser ;  
    public static queryCanteensOfGroupGQL = queryCanteensOfGroup;

    public static bookingBreakfastGQL = bookingBreakfast ; 
    public static bookingLunchGQL = bookingLunch ; 
    public static bookingDinnerGQL = bookingDinner ; 
    public static queryBookingGQL = queryBooking ;
    public static cancelBookingGQL = cancelBooking ; 

    public static spendGQL = spend ; 
    public static transferGQL = transfer; 

    public static queryCanteensByAdminGQL = queryCanteensByAdmin;
    public static queryConfigGQL = queryConfig; 

    public static subCommentsGQL = subComments;
    public static createCommentGQL = createComment; 
    public static queryCommentsGQL = queryComments;

}