import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class DriService {

  private API_URL = 'https://dietary-habits.herokuapp.com/dri';

  constructor(private httpClient: HttpClient,
			  private auth: AuthenticationService) { }

  public getUserActiveDris(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.API_URL + '/user-active-dri/' + this.auth.getUserDetails()._id);
  }

  public updateDri(dri): Observable<any> {
    return this.httpClient.put(this.API_URL + '/update/' + dri._id, dri);
  }
}
