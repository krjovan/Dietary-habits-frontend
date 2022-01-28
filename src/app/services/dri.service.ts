import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DriService {

  private API_URL = 'https://dietary-habits.herokuapp.com/dri';

  constructor(private httpClient: HttpClient) { }

  public getDris(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.API_URL + '/all');
  }
}
