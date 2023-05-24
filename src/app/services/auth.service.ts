import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

const baseUrl = environment.serverURL + '/kas/api';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject: BehaviorSubject<User | null>;
  public user: Observable<User | null>;

  constructor( private router: Router, private http: HttpClient ) { 
    this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
    this.user = this.userSubject.asObservable();
  }

  public get userValue() {
    return this.userSubject.value;
  }

  public signIn(userData: User){
    localStorage.setItem('ACCESS_TOKEN', "access_token");
  }
  public isLoggedIn(){
    return localStorage.getItem('ACCESS_TOKEN') !== null;
  }

  login(data: any): Observable<any> {
    return this.http.post<any>(baseUrl + '/login', data).pipe(map(user => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      localStorage.setItem('user', JSON.stringify(user));
      this.userSubject.next(user);//next(user)
      return user;
  }));
  }

  logout(){
    // localStorage.removeItem('ACCESS_TOKEN');
    // localStorage.removeItem('user');
    localStorage.clear();
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }
  
  generatePasswordLink(data: any): Observable<any> {
    return this.http.put(baseUrl + '/password_link', data);
  }

  verifyPasswordToken(link: any): Observable<any> {
    return this.http.put(baseUrl + '/verify_password_token', link);
  }

  resetPassword(data: any): Observable<any> {
    return this.http.post(baseUrl + '/reset_password', data);
  }

  signup(data: any): Observable<any> {
    return this.http.post(baseUrl + '/registration', data);
  }

  tenant() {
    return this.http.get(baseUrl + '/tenants');
  }

  getUsertenant(data: any): Observable<any> {
    return this.http.post(baseUrl + '/get_tenant', data);
  }

  updateTenant(data: any): Observable<any> {
    return this.http.post(baseUrl + '/update_tenant', data);
  }

  verifySocialUser(data: any): Observable<any> {
    return this.http.post(baseUrl + '/get_user', data);
  }
}
