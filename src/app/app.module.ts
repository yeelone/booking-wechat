import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER ,Injector } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WeUiModule } from 'ngx-weui';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { IndexComponent } from './pages/index/index.component';
import { LoginComponent } from './pages/login/login.component';
import { BookingComponent } from './pages/booking/booking.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { CanteenAdminComponent } from './pages/canteen-admin/canteen-admin.component';
import { ConfigService } from './config.service';
import { CommentComponent } from './pages/comment/comment.component';

export function loadConfigFactory(configService: ConfigService): Function {
  return () => configService.load();
}

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    LoginComponent,
    BookingComponent,
    ProfileComponent,
    CanteenAdminComponent,
    CommentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    WeUiModule,
    BrowserAnimationsModule,
    GraphQLModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [{
    provide: APP_INITIALIZER,
    useFactory: loadConfigFactory,
    deps: [ConfigService, Injector],
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
