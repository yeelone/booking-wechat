import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import {  Subscription, of as observableOf } from 'rxjs';
import { ServiceGQl } from 'src/app/service/graphql';
import { Message } from 'src/app/model/message';
import { User } from 'src/app/model/user';
import { Canteen } from 'src/app/model/canteen';

@Component({
  selector: 'app-canteen-admin',
  templateUrl: './canteen-admin.component.html',
  styleUrls: ['./canteen-admin.component.less']
})
export class CanteenAdminComponent implements OnInit {
  private subscription: Subscription;

  isLoading:boolean = false; 
  message:Message ;
  messages:Message[] = []; 
  canteens:Canteen[] = [];

  connectSuccess:boolean = false; 
  currentUser:User;

  constructor(private apollo:Apollo) { 
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.getCanteens();
  }

  getCanteens() : void {
    if ( !this.currentUser ) return ; 
    this.isLoading = true  ;
    this.subscription = this.apollo.watchQuery({
      query: ServiceGQl.queryCanteensByAdminGQL,
      variables: {
        adminId: +this.currentUser.id,
      },
      fetchPolicy:"no-cache",
      })
    .valueChanges
    .subscribe((result) => { 
      console.log(result)
      this.isLoading = false  ;
      if ( result.data['canteens']['rows'].length > 0 ){
          this.canteens = result.data['canteens']['rows'];
      }
    },(error)=>{
      this.isLoading = false  ;
      alert("error:"+error);
    });
  }

  playAudio(){
    let audio = new Audio();
    audio.src = "http://localhost:8080/download/audio/9444.mp3";
    audio.load();
    audio.play();
  }

  sub(c:Canteen){
    this.isLoading = true ; 
    this.apollo.subscribe({
      query: ServiceGQl.receiveMessageGQL,
      variables: {
        tunnel: c.qrcodeUuid, 
        adminId: c.admin.id,
      },
    }).subscribe((resp) => {
        console.log(resp)
        this.message = resp.data['messageAdded'];
        this.playAudio();
        this.messages.push(this.message);
        this.isLoading = false; 
        this.connectSuccess = true ; 
      },
      (error)=>{
        console.log("error",error)
        this.connectSuccess = false; 
      });
  }

}
