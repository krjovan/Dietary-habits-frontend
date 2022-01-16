import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private API_URL = 'http://localhost:8080/users';

  constructor(private httpClient: HttpClient) { }

  public getUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.API_URL + '/all');
  }
/*
  public getDeloviByKataloski(searchKataloski: string): Observable<Deo[]> {
    let params = new HttpParams();
    params = params.append('kataloskiBroj', searchKataloski);
    this.httpClient.get<Deo[]>(this.API_URL, {params}).subscribe(data => {
        this.dataChange.next(data);
    },
    (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
    });
    return this.dataChange.asObservable();
  }
  public addDeo(deo: Deo): Observable<any> {
    return this.httpClient.post(this.API_URL, deo, httpOptions);
  }
  public updateDeo(deo: Deo): Observable<any> {
    return this.httpClient.put(this.API_URL + '/' + deo.DEO_ID, deo, httpOptions);
  }
  public deleteDeo(id: number): Observable<any> {
    return this.httpClient.delete(this.API_URL + '/' + id);
  }*/
}