import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private apiUri = '/api/auth';
  authSubject = new BehaviorSubject(false);

  constructor(private http: HttpClient) {}

  // LOGIN
  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUri}/login`, data)
      .pipe(
        tap((res: any) => {
          if (res?.datosUsuario?.token) {
            localStorage.setItem("ACCESS_TOKEN", res.datosUsuario.token);
            localStorage.setItem("USER_DATA", JSON.stringify(res.datosUsuario));
            this.authSubject.next(true);
          }
        })
      );
  }

  // SIGNUP
  signup(data: any): Observable<any> {
    return this.http.post(`${this.apiUri}/signup`, data)
      .pipe(
        tap((res: any) => {
          if (res?.datosUsuario?.token) {
            localStorage.setItem("ACCESS_TOKEN", res.datosUsuario.token);
            localStorage.setItem("USER_DATA", JSON.stringify(res.datosUsuario));
            this.authSubject.next(true);
          }
        })
      );
  }

  logout() {
    localStorage.removeItem("ACCESS_TOKEN");
    localStorage.removeItem("USER_DATA");
    this.authSubject.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem("ACCESS_TOKEN");
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
