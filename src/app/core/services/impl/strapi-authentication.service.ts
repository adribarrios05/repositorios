import { Inject, Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { BaseAuthenticationService } from './base-authentication.service';
import { AUTH_MAPPING_TOKEN, AUTH_ME_API_URL_TOKEN, AUTH_SIGN_IN_API_URL_TOKEN, AUTH_SIGN_UP_API_URL_TOKEN } from '../../repositories/repository.tokens';
import { HttpClient } from '@angular/common/http';
import { IAuthMapping } from '../interfaces/auth-mapping.interface';
import { StrapiMeResponse, StrapiSignInResponse, StrapiSignUpResponse } from './strapi-auth-mapping.service';

@Injectable({
  providedIn: 'root'
})
export class StrapiAuthenticationService extends BaseAuthenticationService {

  private jwt_token:string|null = null;
  constructor(
    @Inject(AUTH_SIGN_IN_API_URL_TOKEN) protected signInUrl: string,
    @Inject(AUTH_SIGN_UP_API_URL_TOKEN) protected signUpUrl: string,
    @Inject(AUTH_ME_API_URL_TOKEN) protected meUrl: string,
    @Inject(AUTH_MAPPING_TOKEN) authMapping: IAuthMapping,
    private httpClient:HttpClient
  ) {
    super(authMapping);
    this.jwt_token = localStorage.getItem('people-jwt-token');
    if (this.jwt_token) {
      this.me().subscribe({
        next:(resp) => {
          this._authenticated.next(true);
          this._user.next(this.authMapping.me(resp));
        },
        error: (err) => {
          this._authenticated.next(false);
          this._user.next(undefined);
        },
        complete:() => {
          this._ready.next(true); // Completar inicialización
        }
      });
    } else {
      this._ready.next(true); // Completar inicialización
    }
    
  }

  signIn(authPayload: any): Observable<any> {
    return this.httpClient.post<StrapiSignInResponse>(
      `${this.signInUrl}`, 
      this.authMapping.signInPayload(authPayload)).pipe(tap(resp=>{
      localStorage.setItem("people-jwt-token",resp.jwt);
      this._authenticated.next(true);
      this._user.next(this.authMapping.signIn(resp));
    }));
  }

  signUp(signUpPayload: any): Observable<any> {
    return this.httpClient.post<StrapiSignUpResponse>(
      `${this.signUpUrl}`, 
      this.authMapping.signUpPayload(signUpPayload)).pipe(tap(resp=>{
        localStorage.setItem("people-jwt-token",resp.jwt);
      this._authenticated.next(true);
      this._user.next(this.authMapping.signUp(resp))
    }));
  }

  signOut(): Observable<any> {
    return of(true).pipe(tap(_=>{
      localStorage.removeItem('people-jwt-token');
      this._authenticated.next(false);
      this._user.next(undefined);
    }));
  }

  me():Observable<any>{
    return this.httpClient.get<StrapiMeResponse>(
      `${this.meUrl}`,{headers:{Authorization: `Bearer ${this.jwt_token}`}});
  }
}
