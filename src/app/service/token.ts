import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MyService } from './service';
import config from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class TokenService  extends MyService {

  constructor(private http: HttpClient) { super() }

  getToken(wechatUrl:string): Observable<Response[]> {
    let url = config.baseurl + "/query/wechatToken";
    let data = { url:wechatUrl };

    console.log("data",data);
    return this.http.post<Response[]>(url,data)
      .pipe(
        tap(response => this.log('get wechat token')),
        catchError(this.handleError('getToken', []))
      );
  }
}