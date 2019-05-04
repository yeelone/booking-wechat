import { User } from './user';

export class Canteen {
    id: number;
    name: string;
	groupID: number;
	breakfastTime: string;
	breakfastPicture: string;
	bookingBreakfastDeadline: string;
	lunchpicture: string;
	lunchTime: string;
	bookingLunchDeadline: string;
	dinnerPicture: string;
	dinnerTime: string;
	bookingDinnerDeadline : string;
	cancelTime : number;
	qrcode:string;
	qrcodeUuid:string;
	admin:User;
}