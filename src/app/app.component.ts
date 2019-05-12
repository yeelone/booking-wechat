import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './model/user';
import { Role } from './model/role';
import { Apollo } from 'apollo-angular';
import { ServiceGQl } from './service/graphql';
import { Message } from './model/message';
import config from './config/config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'booking-wechat';

  isLoading: boolean = false; 
  isLoggedIn$: Observable<boolean>;
  isLoggedIn:boolean = false;
  isCanteenAdmin:boolean = false ;

  currentUser:User;
  role: Role;
 
  constructor() {}

  ngOnInit() {
    console.log("Power by Jiangyilong 2019");

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (this.currentUser && this.currentUser.token) {
      this.isLoggedIn = true;
      if (this.currentUser['roles']['rows']){
        this.role =  this.currentUser['roles']['rows'][0];

        this.isCanteenAdmin = false ; 
        if ( this.role.name == "食堂管理员"){
          this.isCanteenAdmin = true ; 
        }
      }
    }else{
      this.isLoggedIn = false;
    }
    
  }

}
