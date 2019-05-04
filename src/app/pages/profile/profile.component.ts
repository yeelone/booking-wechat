import { Component, OnInit,ViewChild} from '@angular/core';
import { User } from 'src/app/model/user';
import { Role } from 'src/app/model/role';
import config from 'src/app/config/config';
import { ServiceGQl } from 'src/app/service/graphql';
import { Apollo } from 'apollo-angular';
import { Router } from '@angular/router';
import { PopupComponent } from 'ngx-weui';
import { TokenService } from 'src/app/service/token';

declare var wx: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less']
})
export class ProfileComponent implements OnInit {

  currentUser:User;
  role:Role;
  qrcode:string = "";
  isLoadingResults:boolean = false; 

  resetPassword:string = "";
  confirmPassword:string = "";
  transferToUser:User = {} as User ;

  res: any = {
    ticketType:"lunch",
    number: 0,
  };
  
  nameMap = {
    "breakfast" :"早餐",
    "lunch" :"午餐",
    "dinner" :"晚餐",
  };

  radio: any[] = [{ id: "breakfast", name: '早餐' }, 
  { id: "lunch", name: '午餐'}, 
  { id: "dinner", name: '晚餐'}];

  @ViewChild('full') fullPopup: PopupComponent;
  @ViewChild('transfer') transferPopup: PopupComponent;

  constructor(private apollo: Apollo,private router: Router,private tokenService:TokenService) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (this.currentUser && this.currentUser.token) {
      this.qrcode = config.baseurl + this.currentUser['qrcode'];
      if (this.currentUser['roles']['rows']){
        this.role =  this.currentUser['roles']['rows'][0];
      }
    }
  }

  logout():void{
    this.isLoadingResults = true  ;
    this.apollo.mutate({
      mutation: ServiceGQl.logoutGQL,
      variables: {
        username:this.currentUser.username, 
      }
    })
    .subscribe((result) => { 
      this.isLoadingResults = false  ;
      localStorage.removeItem('currentUser');
      localStorage.removeItem('permissions');
      localStorage.removeItem('currentToken');
      this.router.navigate(["login"]);
    },(error)=>{
      this.isLoadingResults = false  ;
      alert("error:"+error);
    });
  }

  reset():void{
    this.fullPopup.show();
  }

  scanToTransfer():void{
    // let result = "module:profile;id:2;username:yilong222;date:2019-04-22 17:58;qrcode_uuid:biupoauios10ic99j8po";
    // let data = result.split(";");
    // let uuid = "";
    // if ( data.length > 0 ){
    //   let idStr = data[1];
    //   this.transferToUser.id = +idStr.split(":").pop();
    //   let nameStr = data[2];
    //   this.transferToUser.username = nameStr.split(":").pop();
    //   let uuidStr = data.pop();
    //   uuid = uuidStr.split(":").pop();
    // }
    // this.transferPopup.show();
    // return ;
    this.tokenService.getToken(location.href)
    .subscribe(
      response => {
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数
          appId: config.appid, // 必填，公众号的唯一标识
          timestamp: response['timestamp'], // 必填，生成签名的时间戳
          nonceStr: response['nonce_str'], // 必填，生成签名的随机串
          signature: response['signature'],// 必填。注意，signature应由后台返回
          jsApiList: ['scanQRCode'] // 必填
        });

        wx.error(function(res) {
          alert("出错了：" + JSON.stringify(res));//这个地方的好处就是wx.config配置错误，会弹出窗口哪里错误，然后根据微信文档查询即可。
        });

        wx.scanQRCode({
          needResult : 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType : [ "qrCode"], // 可以指定扫二维码还是一维码，默认二者都有
          success : function(res) {
            let result = res.resultStr;
            let data = result.split(";");
            if ( data.length > 0 ){
              let idStr = data[1];
              this.transferToUser.id = +idStr.split(":").pop();
              let nameStr = data[2];
              this.transferToUser.username = nameStr.split(":").pop();
              // let uuidStr = data.pop();
              // uuid = uuidStr.split(":").pop();
              alert(this.transferToUser.id);
              alert(this.transferToUser.username);
              this.transferPopup.show();
            }
          },
          error : function(){
          }
        });
      }
    )
  }

  submitTransfer():void{
    this.isLoadingResults = true; 
    this.apollo.mutate({
      mutation: ServiceGQl.transferGQL,
      variables: {
        fromUserId:+this.currentUser.id,
        toUserId:+this.transferToUser.id,
        number:+this.res.number,
        type: this.res.ticketType.id,
      },
    }).subscribe((data) => {
      this.isLoadingResults = false; 
      alert("成功");
    },(error) => {
      this.isLoadingResults = false;
      console.log("error", error);
      alert("修改失败...   " +  "    🤢🤢🤢" + error);
      
    });
  }

  onResetSave():void{
    if ( this.resetPassword != this.confirmPassword ){
      alert("再次密码输入不一致...   " +  "    🤢🤢🤢" );
      return ; 
    }
    
    this.isLoadingResults = true; 
    this.apollo.mutate({
      mutation: ServiceGQl.updateUserGQL,
      variables: {
        id:+this.currentUser.id,
        password: this.resetPassword,
      },
    }).subscribe((data) => {
      this.isLoadingResults = false; 
      alert("成功");
    },(error) => {
      this.isLoadingResults = false;
      console.log("error", error)
      alert("修改失败...   " +  "    🤢🤢🤢" + error);
      
    });
  }
}
