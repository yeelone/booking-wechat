import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { ServiceGQl } from 'src/app/service/graphql';
import { User } from 'src/app/model/user';
import { Subscription } from 'rxjs';
import config from 'src/app/config/config';
import { Comment } from 'src/app/model/comment';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.less']
})
export class CommentComponent implements OnInit {

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  private subscription: Subscription;

  isLoadingResults = true;
  comments:Comment[] = [];
  currentUser:User;
  body:string;

  constructor(private apollo: Apollo) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.query();
    this.sub();


    this.scrollToBottom();
  }

  ngAfterViewChecked() {        
      this.scrollToBottom();        
  } 

  scrollToBottom(): void {
      try {
          this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      } catch(err) { }                 
  }

  query():void{
    this.isLoadingResults = true  ;
    this.subscription = this.apollo.watchQuery({
      query: ServiceGQl.queryCommentsGQL,
      variables:{
        take:100,
        skip:0,
      },
      fetchPolicy:"no-cache",
      })
    .valueChanges
    .subscribe((result) => { 
      this.isLoadingResults = false  ;
      this.comments = result.data['comments']['rows'];
      this.subscription.unsubscribe();
    },(error)=>{
      this.isLoadingResults = false  ;
      this.subscription.unsubscribe();
      alert("error:"+error);
    });
  }

  comment():void{
    this.isLoadingResults = true  ;
    this.apollo.mutate({
      mutation: ServiceGQl.createCommentGQL,
      variables: {
        userId:+this.currentUser.id, 
        body:this.body,
        tunnel:config.company,
      },
    }).subscribe((result) => {
      this.isLoadingResults = false ;
      this.comments.push(result.data['createComment']);
      this.body = "";
    },(error) => {
      this.isLoadingResults = false ;
      console.log("error", error)
      alert("确认失败...   " +  "    🤢🤢🤢" + error);
    });
  }

  sub(){
    this.isLoadingResults = true ; 
    this.apollo.subscribe({
      query: ServiceGQl.subCommentsGQL,
      variables: {
        roomName: config.company, 
        userId: +this.currentUser.id,
      },
    }).subscribe((result) => {
        let comment = result.data['subComment'];
        this.comments[this.comments.length - 1] = comment;
        this.isLoadingResults = false; 
      },
      (error)=>{
        console.log("error",error)
        this.isLoadingResults = false; 
      });
  }

  check(c:Comment):string{
    if ( !c ) {
      return "left";
    }
    if ( c.user.id == this.currentUser.id ) {
      return "right";
    }
    
    return "left";
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
