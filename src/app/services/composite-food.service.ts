import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompositeFoodService {

  private API_URL = 'https://mydietaryhabits.herokuapp.com/composite-food';

  constructor(private httpClient: HttpClient) { }

  public addCompositeFood(compositeFood: any): Observable<any> {
    return this.httpClient.post(this.API_URL + '/add', compositeFood);
  }
}
