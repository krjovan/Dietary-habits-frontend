import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserNutritionService {

  private API_URL = 'https://dietary-habits.herokuapp.com/user-nutrition';

  constructor(private httpClient: HttpClient) { }

  public getUserNutritions(body): Observable<any[]> {
    return this.httpClient.get<any[]>(this.API_URL + '/get-user-nutritions?id='+body.id+'&date_of_consumption='+body.date_of_consumption);
  }

  public addNutrition(nutrition: any): Observable<any> {
    return this.httpClient.post(this.API_URL + '/add', nutrition);
  }
}
