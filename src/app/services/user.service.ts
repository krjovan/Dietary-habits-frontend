import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { TokenPayload } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private API_URL = 'https://dietary-habits.herokuapp.com/users';

  constructor(private httpClient: HttpClient) { }

  public getUsers(search): Observable<User[]> {
    return this.httpClient.get<User[]>(this.API_URL + '/all?search=' + search);
  }
  
  public getUsersWithPagination(page, limit): Observable<User[]> {
    return this.httpClient.get<User[]>(this.API_URL + '/withPagination?page=' + page + '&limit=' + limit);
  }

  public getUsersCount(): Observable<any> {
    return this.httpClient.get<any>(this.API_URL + '/numberOfUsers');
  }
  
  public addUser(user: TokenPayload): Observable<any> {
    return this.httpClient.post(this.API_URL + '/add', user);
  }
  
  public updateUser(user): Observable<any> {
    return this.httpClient.put(this.API_URL + '/admin/update/' + user._id, user);
  }
  
  public deleteUser(id): Observable<any> {
    return this.httpClient.delete(this.API_URL + '/delete/' + id);
  }
  
  public resetPassword(user): Observable<any> {
    return this.httpClient.put(this.API_URL + '/resetPassword', user);
  }
}