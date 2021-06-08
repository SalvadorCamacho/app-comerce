
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BackendInterceptor } from './backend.interceptor';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
  HttpClientModule, FormsModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
       provide: HTTP_INTERCEPTORS,
       useClass: BackendInterceptor,
       multi: true
    }, SplashScreen, StatusBar
  ],  bootstrap: [AppComponent],
})
export class AppModule {}
