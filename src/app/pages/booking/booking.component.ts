import { Component, OnInit,ViewChild } from '@angular/core';
import { ServiceGQl } from 'src/app/service/graphql';
import { User } from 'src/app/model/user';
import { Apollo } from 'apollo-angular';
import {  Subscription, of as observableOf } from 'rxjs';
import { Group } from 'src/app/model/group';
import { Canteen } from 'src/app/model/canteen';
import { PopupComponent } from 'ngx-weui';
import { Booking } from 'src/app/model/booking';

class SourceData {
  breakfast: number;
  lunch: number;
  dinner: number;
}

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.less']
})
export class BookingComponent implements OnInit {
  private subscription: Subscription;

  group:Group;
  currentUser:User;
  canteens:Canteen[] = [];

  dataSource:SourceData;
  isLoadingResults:boolean = false;
  
  bookingCount:number = 0 ; 
  bookings:Booking[] = [] ; 

  showHint:boolean = false; 
  hint:string = "";

  res: any = {
    canteen: 0,
    select:"",
    date:"", 
    number:1,
  };
  
  cancelDone:boolean = true;

  nameMap = {
    "breakfast" :"早餐",
    "lunch" :"午餐",
    "dinner" :"晚餐",
  };

  @ViewChild('full', {static: false}) fullPopup: PopupComponent;

  radio: any[] = [{ id: "breakfast", name: '早餐',gqlStr:ServiceGQl.bookingBreakfastGQL }, 
                  { id: "lunch", name: '午餐',gqlStr:ServiceGQl.bookingLunchGQL }, 
                  { id: "dinner", name: '晚餐',gqlStr:ServiceGQl.bookingDinnerGQL }];

  constructor(private apollo: Apollo) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.dataSource = new SourceData();
    this.dataSource.breakfast = 0;
    this.dataSource.breakfast = 0;
    this.dataSource.breakfast = 0;
    if ( this.currentUser ){
      // this.dataSource = this.currentUser['tickets']['count'];
      if (this.currentUser['groups']['rows']){
        this.group =  this.currentUser['groups']['rows'][0];
        this.getCanteens();
      }
     
      this.updateCount();
    }
   
    this.fullPopup.hide();
  }

  updateCount():void {
    this.isLoadingResults = true  ;
    this.subscription = this.apollo.watchQuery({
      query: ServiceGQl.queryTicketsGQL,
      variables: {
        userId: this.currentUser.id,
      },
      fetchPolicy:"no-cache",
      })
    .valueChanges
    .subscribe((result) => { 
      this.isLoadingResults = false  ;
      this.dataSource = result.data['tickets']['count'];
      console.log(this.dataSource);
    },(error)=>{
      this.isLoadingResults = false  ;
      alert("error:"+error);
    });
  }

  getCanteens() : void {
    if ( !this.group ) return ; 
    this.isLoadingResults = true  ;
    this.subscription = this.apollo.watchQuery({
      query: ServiceGQl.queryCanteensOfGroupGQL,
      variables: {
        gid: this.group.id,
      },
      fetchPolicy:"no-cache",
      })
    .valueChanges
    .subscribe((result) => { 
      this.isLoadingResults = false  ;
      if ( result.data['groups']['rows'].length > 0 ){
        if ( result.data['groups']['rows'][0]['canteens'] ) {
          this.canteens = result.data['groups']['rows'][0]['canteens']['rows'] || [];
        }
      }

      if ( this.canteens.length > 0 ){
        this.res.canteen = this.canteens[0].id;
      }
    },(error)=>{
      this.isLoadingResults = false  ;
      alert("error:"+error);
    });
  }

  booking():void{
    switch(this.res.select){
      case "breakfast":
        if ( this.res.number > this.dataSource.breakfast ){
          alert("没有足够餐卷");
          return ; 
        }
        break;
      case "lunch":
        if ( this.res.number > this.dataSource.lunch ){
          alert("没有足够餐卷");
          return ; 
        }
        break;
      case "dinner":
        if ( this.res.number > this.dataSource.dinner ){
          alert("没有足够餐卷");
          return ; 
        }
        break;
    }
    
    this.isLoadingResults = true  ;
    this.apollo.mutate({
      mutation: this.res.select.gqlStr,
      variables: {
        userId:+this.currentUser.id, 
        canteenId:+this.res.canteen,
        date:this.res.date,
        number:this.res.number,
      },
    }).subscribe((data) => {
      console.log("data",data);
      alert("预订成功")
      this.isLoadingResults = false ;
      this.updateCount();
    },(error) => {
      this.isLoadingResults = false ;
      alert("预订失败...   " +  "    🤢🤢🤢" + error);
    });

  }

  onChange(select):void{
    let curDate = new Date();

    // 添加分隔符“-”
    // var seperator = "-";
    this.showHint = false ;
    if ( select.id == "breakfast" || (select.id == "lunch" && curDate.getHours() >= 11 ) || (select.id == "dinner" && curDate.getHours() >= 17 ) ) {
      //如果是早餐，将时间设定为明天 
      curDate.setDate(curDate.getDate()+1);
      this.showHint = true ; 
      this.hint = "已为您将预订日期调整为明天";
    } 

    let year = curDate.getFullYear();
    let month = "" ;
    let day = "";
    let hour = curDate.getHours();

        // // 对月份进行处理，1-9月在前面添加一个“0”
    if ( (curDate.getMonth()+1) >= 1 && (curDate.getMonth()+1) <= 9) {
      month = "0" + (curDate.getMonth()+1);
    }else{
      month = "" + (curDate.getMonth()+1);
    }

    // // 对月份进行处理，1-9号在前面添加一个“0”
    if ( curDate.getDate() >= 0 && curDate.getDate() <= 9) {
      day = "0" + curDate.getDate();
    }else{
      day = "" + curDate.getDate();
    }

    this.res.date = year + "-" + month + "-" + day ;
  }

  getBookings() : void {
    this.isLoadingResults = true  ;
    this.subscription = this.apollo.watchQuery({
      query: ServiceGQl.queryBookingGQL,
      variables: {
        userId: this.currentUser.id,
      },
      fetchPolicy:"no-cache",
      })
    .valueChanges
    .subscribe((result) => { 
      this.isLoadingResults = false  ;
      this.bookingCount = result.data['booking']['totalCount'];
      this.bookings = result.data['booking']['rows'] ;
      if ( this.canteens ){
        if ( this.canteens.length > 0 ){
          this.res.canteen = this.canteens[0].id;
        }
      }
      
    },(error)=>{
      this.isLoadingResults = false  ;
      alert("error:"+error);
    });
  }
  
  popupShow():void{
    this.getBookings();
    this.fullPopup.show();
  }

  cancelBooking(bookingId:number):void {
    this.cancelDone = false  ;
    this.apollo.mutate({
      mutation: ServiceGQl.cancelBookingGQL,
      variables: {
        userId:+this.currentUser.id, 
        bookingId:bookingId,
      },
    }).subscribe((data) => {
      alert("取消成功");
      this.cancelDone = true ;
      this.updateCount();
    },(error) => {
      this.cancelDone = true ;
      console.log("error", error);
      alert("取消预订失败...   " +  error + "    🤢🤢🤢");
    });
  }
}
