import { Component, AfterViewInit , OnDestroy } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { ServiceGQl } from 'src/app/service/graphql';
import { TokenService } from '../../service/token';
import config from 'src/app/config/config';
import { User } from 'src/app/model/user';
import { Message } from 'src/app/model/message';
import { Role } from 'src/app/model/role';

declare var wx: any;
// declare var WeixinJSBridge : any;

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.less']
})
export class IndexComponent implements AfterViewInit , OnDestroy {
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

  messages:Message[] = [];

  url:string = config.server;
  currentUser:User;
  role:Role;

  constructor(private apollo: Apollo,private tokenService:TokenService) { 
  }

  ngAfterViewInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (this.currentUser && this.currentUser.token) {
      if (this.currentUser['roles']['rows']){
        this.role =  this.currentUser['roles']['rows'][0];
      }
    }
  }

  ngOnDestroy() {
  }

  openScanQRCode():void{

    // let result = "BookingConfirm:true;id:1;name:第一食堂;date:2019-04-22 17:58;qrcode_uuid:biup0aul0s10lc99j8p0";
    // let data = result.split(";");
    // let canteenId = 0 ; 
    // let uuid = "";
    // if ( data.length > 0 ){
    //   let idStr = data[1];
    //   canteenId = +idStr.split(":").pop();
    //   let uuidStr = data.pop();
    //   uuid = uuidStr.split(":").pop();
    // }

    // this.spend(canteenId, uuid)
    
    // return ;

    this.tokenService.getToken(location.href)
      .subscribe(
        response => {
          wx.config({
            debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数
            appId: config.appid, // 必填，公众号的唯一标识
            timestamp: response['timestamp'], // 必填，生成签名的时间戳
            nonceStr: response['nonce_str'], // 必填，生成签名的随机串
            signature: response['signature'],// 必填。注意，signature应由后台返回
            jsApiList: ['scanQRCode'] // 必填
          });

          wx.error(function(res) {
            alert("出错了：" + JSON.stringify(res));//这个地方的好处就是wx.config配置错误，会弹出窗口哪里错误，然后根据微信文档查询即可。
          });

          // wx.ready(function() {
          //     wx.checkJsApi({
          //         jsApiList : ['scanQRCode'],
          //         success : function(res) {
          //             console.log("check success")
          //         }
          //     });
          // });
          wx.scanQRCode({
            needResult : 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType : [ "qrCode"], // 可以指定扫二维码还是一维码，默认二者都有
            success : function(res) {
              let data = res.split(";");
              let canteenId = 0 ; 
              let uuid = "";
              if ( data.length > 0 ){
                let idStr = data[1];
                canteenId = +idStr.split(":").pop();
                let uuidStr = data.pop();
                uuid = uuidStr.split(":").pop();
              }
          
              this.spend(canteenId, uuid)
            },
            error : function(){
            }
          });
        }
      )
  }

  spend(canteenId:number,uuid:string ):void{
      this.isLoadingResults = true  ;
      this.apollo.mutate({
        mutation: ServiceGQl.spendGQL,
        variables: {
          userId:+this.currentUser.id, 
          canteenId:canteenId,
          uuid:uuid,
        },
      }).subscribe((data) => {
        alert("确认成功");
        this.isLoadingResults = false ;
      },(error) => {
        this.isLoadingResults = false ;
        console.log("error", error)
        alert("确认失败...   " +  "    🤢🤢🤢" + error);
      });
  }

  confirmBooking(uuid:string):void{
    //扫描二维码之后，会得到二维码的uuid
  }
}

