
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { SkipInterceptor } from './backend.interceptor';
import { CustomerModel } from '../model/CustomerModel';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authResponse : AuthResponse = {
    token: '',
    user_email: '',
    user_nicename: '',
    user_display_name: ''
  };

  private WP_AUTH_URL = environment.auth_url;
  private WP_JWT_VERIFY_URL = environment.token_verify_url;
  private serverUrl = environment.backend_api_url;
  private currentAuthState = false;
  returnUrl: string;
  x : any;
  authState$ = new BehaviorSubject<boolean>(false);



  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private loadingController: LoadingController,
    private route: ActivatedRoute,
    private alertController: AlertController
  ) {
    this.init();
  }

  async login(username: string, password: string) {
    this.returnUrl = this.route.snapshot.queryParams.returnUrl;

    const headers = new HttpHeaders().set(SkipInterceptor, '');
   // console.log(headers)
    const loader = await this.loadingController.create({
        animated: true,
        backdropDismiss: true,
        message: "Authenticating Account",
        spinner: "crescent",
        id: "auth"
    });

    await loader.present().then();

    if (!this.currentAuthState) {//No hay usuario logueado?
        this.httpClient.post(`${this.WP_AUTH_URL}`, {username, password}, {headers})
            .subscribe(async (data: AuthResponse) => {
                await loader.dismiss().then(); //Quita el loader
                if (data.token !== null) {
                  localStorage.setItem('data',JSON.stringify({...data}));
                  //  this.storage.set('data', {...data}).then(resp => {
                        this.currentAuthState = true; //si hay usuario
                        this.authState$.next(this.currentAuthState);
                        this.fetchUserDetails(data.user_email).toPromise().
                        then((user: CustomerModel) => {
                          localStorage.setItem('user',JSON.stringify(user));
                      //     this.storage.set('user', user);
                            this.router.navigate([this.returnUrl]).then();
                        });
                } else {
                    this.currentAuthState = false;
                    this.authState$.next(this.currentAuthState);
                }
            }, async (err: ErrorResponse) => {
                await loader.dismiss().then();
                this.currentAuthState = false;
                this.authState$.next(this.currentAuthState);
                if (err instanceof HttpErrorResponse) {
                    if (err.status === 403) {
                        const alert = await this.alertController.create({
                            message: 'Bad Username Or Password',
                            buttons: [
                                {
                                    role: 'cancel',
                                    text: 'Ok'
                                }
                            ],
                            header: 'Authentication Failed'
                        });

                        await alert.present().then();
                    } else {
                        const alert = await this.alertController.create({
                            message: err.statusText,
                            buttons: [
                                {
                                    role: 'cancel',
                                    text: 'Ok'
                                }
                            ],
                            header: 'Authentication Failed'
                        });
                        await alert.present().then();
                    }
                }
            });
    } else {
        await loader.dismiss().then();
        this.router.navigateByUrl('/').then();
        return;
    }
}

logout() {
  this.currentAuthState = false;
  this.authState$.next(this.currentAuthState);
  localStorage.removeItem('user');
  localStorage.removeItem('data');
 // this.storage.remove('user').then();
 // this.storage.remove('data').then();
  this.router.navigateByUrl('/').then();
}


private fetchUserDetails(email: string) {
  return this.httpClient.get(`${this.serverUrl}/customers?email=${email}`).pipe(
      take(1)
  );
}

init() {
  if(localStorage.getItem('data')!==null){

   if(this.x = JSON.parse(localStorage.getItem('data')!)!=null){
      async (data : AuthResponse) =>{
       data = this.x;
      if (data.token !== null) {
          // Verify the token validity
          this.httpClient.post(`${this.WP_JWT_VERIFY_URL}`, {token: data.token}, {
              headers: {
                  Authorization: `Bearer ${data.token}`
              }
          }).toPromise().then((res: jwtVerifyResponse) => {
              if (res.data.status === 200) {
                  this.fetchUserDetails(data.user_email).toPromise().
                  then((user: CustomerModel) => {
                    localStorage.setItem('user',JSON.stringify(user));
                  //  this.storage.set('user', user);
                      this.currentAuthState = true;
                      this.authState$.next(this.currentAuthState);
                  })
              } else {
                  this.currentAuthState = false;
                  this.authState$.next(this.currentAuthState);
              }
          }).catch(async (err: HttpErrorResponse) => {
              const alert = await this.alertController.create({
                  message: err.statusText,
                  animated: true,
                  buttons: [
                      {
                          role: 'cancel',
                          text: 'Ok'
                      }
                  ]
              });

              await alert.present().then();
          })
        }
 // }).catch(err => console.log('Token not present'));
    } //async
  } //Segundo if
} //si no hay datos en "data" o hay un token

}

getAuthState$(): Observable<boolean> {
  return this.authState$.asObservable();
}

getCurrentAuthState(): boolean {
  return this.currentAuthState;
}


}



export interface AuthResponse {
  token: string;
  user_email: string;
  user_nicename: string;
  user_display_name: string;
}

// tslint:disable-next-line:class-name
export interface jwtVerifyResponse {
  code: string;
  data: {
      status: number
  };
}


interface ErrorResponse {
  status: number;
  statusText: string;
}
