import { Component, OnInit } from '@angular/core';
import { ServiceGQl } from 'src/app/service/graphql';
import { User } from 'src/app/model/user';
import { Apollo } from 'apollo-angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {

  username:string = "";
  password:string = "";

  constructor(private apollo: Apollo) { }

  ngOnInit() {
  }

  onSave() {
    this.login();
  }

  login() : void {
    this.apollo.mutate({
      mutation: ServiceGQl.loginGQL,
      variables: {
        username: this.username,
        password: this.password
      },
    }).subscribe((data) => {
      let currentUser:User;
      currentUser = data['data']['login']['user'];
      currentUser.token = data['data']['login']['token'];
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      localStorage.setItem('currentToken', currentUser.token);
      localStorage.setItem('permissions', data['data']['login']['permissions']);
      location.href = "/"; 
    },(error) => {
      console.log("error", error)
      alert("登录失败...   " +  "    🤢🤢🤢" + error);
      
    });

  }
}
