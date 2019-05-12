import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { ServiceGQl } from './service/graphql';
import config from './config/config';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(private apollo: Apollo) {
  }

  load(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      return this.apollo.subscribe({
        query: ServiceGQl.queryConfigGQL,
      }).subscribe((resp) => {
          console.log("config", resp)
          config.appid = resp.data['config']['wxAppID'];
          config.prompt = resp.data['config']['prompt'];

          resolve(resp);

        },
        (err)=>{
            reject(err);
        });
    });
  }

}