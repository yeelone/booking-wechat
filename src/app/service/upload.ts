import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MyService } from './service';
import config from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class UploadService  extends MyService {

  constructor(private http: HttpClient) { super() }

  upload(formData:any): Observable<Response[]> {
    let url = config.baseurl + "/upload";
    return this.http.post<Response[]>(url,formData)
      .pipe(
        tap(response => this.log('uploading data')),
        catchError(this.handleError('upload', []))
      );
  }
}