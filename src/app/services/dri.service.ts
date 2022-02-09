import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class DriService {

  private API_URL = 'https://mydietaryhabits.herokuapp.com/dri';

  constructor(private httpClient: HttpClient,
			  private auth: AuthenticationService) { }

  public getUserActiveDris(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.API_URL + '/user-active-dri/' + this.auth.getUserDetails()._id);
  }

  public getUserDris(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.API_URL + '/user-dris/' + this.auth.getUserDetails()._id);
  }

  public addDri(dri): Observable<any> {
    dri.user_id = this.auth.getUserDetails()._id;
    dri.active = true;
    return this.httpClient.post(this.API_URL + '/add', dri);
  }

  public setStatusToActive(dri): Observable<any> {
    return this.httpClient.put(this.API_URL + '/setStatusToActive', dri);
  }

  public updateDri(dri): Observable<any> {
    return this.httpClient.put(this.API_URL + '/update/' + dri._id, dri);
  }

  public deleteDri(id): Observable<any> {
    return this.httpClient.delete(this.API_URL + '/delete/' + id);
  }
}
