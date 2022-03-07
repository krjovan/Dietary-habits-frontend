import { Component, OnInit } from '@angular/core';
import { UserNutritionService } from '../../services/user-nutrition.service';
import { DriService } from '../../services/dri.service';
import { AuthenticationService } from '../../services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import * as CanvasJS from '../../../assets/canvasjs.min.js';
import { SummedUpNutritions } from '../../models/summed-up-nutritions';
import { Dri } from '../../models/dri';

@Component({
  selector: 'app-my-diet',
  templateUrl: './my-diet.component.html',
  styleUrls: ['./my-diet.component.css']
})
export class MyDietComponent implements OnInit {

  dri: Dri = <Dri>{};
  colors: any = <any>{};
  isLoaded: Boolean = false;
  dateOfConsumption = new Date();
  nutritions: any[] = [];
  sumQuantity: number = 0;
  sumNutritions: SummedUpNutritions;

  constructor(
    private userNutritionService: UserNutritionService,
    private auth: AuthenticationService,
    private driService: DriService,
    private toastr: ToastrService
  ) { }

  onDateChange(date) {
    this.isLoaded = false;
    this.sumQuantity = 0;
    this.sumNutritions = new SummedUpNutritions();
    this.dateOfConsumption = new Date(date);
    var body = {
      id: this.auth.getUserDetails()._id,
      date_of_consumption: date
    }
    this.userNutritionService.getUserNutritions(body)
      .subscribe(nutritions => {
        this.nutritions = nutritions;
        this.calculateSum(nutritions);
        this.isLoaded = true;
        this.toastr.success('Found ' + nutritions.length + ' nutrition/s', 'Success');
      });
  }

  calculateSum(nutritions) {
    let sumNutritionKeys = Object.keys(this.sumNutritions);
    for (let i = 0; i < nutritions.length; i++) {
      this.sumQuantity += nutritions[i].quantity;
      //divided by 100 to get the ratio for quantity from grams, e.g. 50g = 0.5, 100g = 1, 1000g = 10...
      //because all database entries in the 'Nutrition' collection are for 100g
      let nutritionQuantityRatio = nutritions[i].quantity / 100;
      let nutrition = nutritions[i].nutrition;
      for (let j = 0; j < sumNutritionKeys.length; j++) {
        let key = sumNutritionKeys[j];
        this.sumNutritions[key] += nutrition[key] * nutritionQuantityRatio;
      }
    }
  }

  updateUserNutrition(nutrition) {
    var req = JSON.parse(JSON.stringify(nutrition));
    const x = document.getElementById(req._id.toString()) as HTMLInputElement;
    if (Number(x.value) === 0) {
      this.toastr.error('Enter valid quantity of food.', 'Error');
    } else {
      delete req.nutrition;
      req.quantity = Number(x.value);
      this.userNutritionService.updateNutrition(req).subscribe(() => {
        this.onDateChange(this.dateOfConsumption.toISOString().split('T')[0]);
        this.toastr.success('You successfully updated the quantity!', 'Success');
      }, (err) => {
        this.toastr.error(err.error.message, 'Error');
      });
    }
  }

  deleteUserNutrition(id) {
    this.userNutritionService.deleteNutrition(id).subscribe(() => {
      this.onDateChange(this.dateOfConsumption.toISOString().split('T')[0]);
      this.toastr.success('You successfully deleted the food!', 'Success');
    }, (err) => {
      this.toastr.error(err.error.message, 'Error');
    });
  }

  openAddForm() {
    document.getElementById('id01').style.display = 'block';
  }

  closedAddFoodDialog() {
    document.getElementById('id01').style.display='none';
    this.onDateChange(this.dateOfConsumption.toISOString().split('T')[0]);
  }

  ngOnInit(): void {
    this.driService.getUserActiveDris()
      .subscribe(dris => {
        this.onDateChange(this.dateOfConsumption.toISOString().split('T')[0]);
        Object.assign(this.dri, dris[0]);
      });
  }
}
