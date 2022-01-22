import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Nutrition } from '../models/nutrition';

@Injectable({
  providedIn: 'root'
})
export class NutritionService {

  private API_URL = 'https://dietary-habits.herokuapp.com/nutritions';

  constructor(private httpClient: HttpClient) { }

  public getNutritions(search): Observable<Nutrition[]> {
    return this.httpClient.get<Nutrition[]>(this.API_URL + '/all?search=' + search);
  }
  
  public getNutritionNamesAndIds(search): Observable<any[]> {
    return this.httpClient.get<any[]>(this.API_URL + '/getNutritionsNameAndId?search=' + search);
  }

  public getNutritionsWithPagination(page, limit): Observable<Nutrition[]> {
    return this.httpClient.get<Nutrition[]>(this.API_URL + '/withPagination?page=' + page + '&limit=' + limit);
  }

  public getNutritionsCount(): Observable<any> {
    return this.httpClient.get<any>(this.API_URL + '/numberOfNutritions');
  }

  public addNutrition(nutrition: Nutrition): Observable<any> {
    return this.httpClient.post(this.API_URL + '/add', nutrition);
  }

  public updateNutrition(nutrition: Nutrition): Observable<any> {
    return this.httpClient.put(this.API_URL + '/update/' + nutrition._id, nutrition);
  }

  public deleteNutrition(id): Observable<any> {
    return this.httpClient.delete(this.API_URL + '/delete/' + id);
  }
}
