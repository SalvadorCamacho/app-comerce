import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment.prod';

export const skiptInterceptor:string = 'X-Skip-Interceptor';
export const writeObject:string = 'X-Write-Object';

@Injectable()
export class BackendInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
     //This will skip the incerception of SkipIntercepto header is present
     if(request.headers.has(skiptInterceptor)){
       const headers: HttpHeaders = request.headers.delete(skiptInterceptor);
       return next.handle(request.clone({headers}));
      }
    //This will also skip the interception if Writ-Object header is present
    if(request.headers.has(writeObject)){
      const headers: HttpHeaders = request.headers.delete(writeObject);
      const updateRequest: HttpRequest<unknown> = request.clone({
        setParams: {
          consumer_key: environment.writableKeys.consumer_key,
          consumer_secret: environment.writableKeys.consumer_secret
        },
        headers
      });
     return next.handle(updateRequest);
    }

    //If both the headers are not present, process normally
    const modifiedRequest: HttpRequest<unknown> = request.clone({
      setParams: {
        consumer_key: environment.readOnlyKeys.consumer_key,
        consumer_secret: environment.readOnlyKeys.consumer_secret
      }
    });
    return next.handle(modifiedRequest);
  }

}
