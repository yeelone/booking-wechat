import { Component, AfterViewInit , OnDestroy } from '@angular/core';
import { merge, Subscription, of as observableOf } from 'rxjs';
import { Apollo, QueryRef } from 'apollo-angular';
import { ServiceGQl } from 'src/app/service/graphql';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.less']
})
export class UserComponent implements AfterViewInit , OnDestroy {
  private userSubscription: Subscription;
  private subscriptMessages: QueryRef<any>; 
  private msgSubscription: QueryRef<any>;
  returnMsg:string = "";

  loading = true;
  deleteLoading = false;

  error: any;

  disableDelBtn = true ; //禁用删除按钮

  resultsLength = 0;
  isLoadingResults = true;

  defaultTake = 10 ;
  skip:number = 0 ;
  take:number = this.defaultTake ;

  messages:string[] = [];

  constructor(private apollo: Apollo) { }

  ngAfterViewInit() {
    // this.queryUsers(null);
    this.sub();

  }

  ngOnDestroy() {
  }

  sub(){
    this.apollo.subscribe({
      query: ServiceGQl.receiveMessageGQL
      }).subscribe(resp => {
      console.log('Subscription ', resp);
        this.messages.push(resp.data['messageAdded']);
      });
  }


  queryUsers(filter:Map<string,string>):void{
    let username = "";
    let email = "";
    if ( filter != null ){
      username = filter.get("username");
      email = filter.get("email");
    }
    this.isLoadingResults = true  ;
    this.userSubscription = this.apollo.watchQuery({
      query: ServiceGQl.userGQL,
      variables: {
        skip: this.skip,
        take: this.take,
        username,
        email,
      },
      fetchPolicy:"no-cache",
      })
    .valueChanges
    .subscribe((result) => { 
      this.isLoadingResults = false  ;
        this.resultsLength = result.data['users']['totalCount'];
        const users = result.data['users']['rows'] ;
        console.log(users);
    },(error)=>{
      this.isLoadingResults = false  ;
      alert("error:"+error);
    });
  }

}
