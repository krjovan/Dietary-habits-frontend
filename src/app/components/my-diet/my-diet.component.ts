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
  isLoaded: Boolean = false;
  dateOfConsumption = new Date();
  nutritions: any[] = [];
  sumQuantity: number = 0;
  sumNutritions: SummedUpNutritions;

  constructor(
    private userNutritionService: UserNutritionService,
    private auth: AuthenticationService,
    private driService: DriService,
    private toastr: ToastrService,
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
        this.updateCharts();
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

  updateCharts() {
    let chart = new CanvasJS.Chart("chartContainer", {
      theme: "light2",
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: "Macronuntritions"
      },
      data: [{
        type: "pie",
        showInLegend: true,
        toolTipContent: "<b>{name}</b>: {y} g (#percent%)",
        indexLabel: "{name} - #percent%",
        dataPoints: [
          { y: this.sumNutritions.protein_g, name: "Protein" },
          { y: this.sumNutritions.carbohydrate_g, name: "Carbohydrate" },
          { y: this.sumNutritions.total_fat_g, name: "Fat" }
        ]
      }]
    });

    chart.render();

    var chart2 = new CanvasJS.Chart("chartContainer2", {
      animationEnabled: true,
      theme: "light2",
      title:{
        text: "Water intake"
      },
      axisY: {
        title: "Water (g)"
      },
      toolTip: {
        shared: true
      },
      data: [{
        type: "column",
        name: "Consumed",
        color: "#0099cc",
        toolTipContent: "<span style=\"color:#0099cc\">{name}</span>: {y} (g)",
        dataPoints: [
            { y: this.sumNutritions.water_g, label: "Today" }
          ]
        },
        {
          type: "error",
          name: "Variance",
          color: "red",
          toolTipContent: "<span style=\"color:#C0504E\">{name}</span>: {y[0]} - {y[1]} (g)",
          dataPoints: [
            { y: [this.dri.water_g, this.dri.water_g_max], label: "Today" }
          ]
        }
      ]
    });
    chart2.render();

    var chart1 = new CanvasJS.Chart("chartContainer1", {
      animationEnabled: true,
      title: {
        text: "Vitamins"
      },
      axisX: {
        interval: 1
      },
      axisY: {
        scaleBreaks: {
          type: "wavy",
          customBreaks: [{
            startValue: 150,
            endValue: 5000
          }
          ]
        }
      },
      data: [{
        type: "bar",
        toolTipContent: "<b>{label}</b>",
        dataPoints: [
          { label: "Vitamin C", y: this.sumNutritions.vitamin_c_mg / this.dri.vitamin_c_mg * 100 },
          { label: "Vitamin B3", y: this.sumNutritions.niacin_mg / this.dri.niacin_mg * 100 },
          { label: "Vitamin B2", y: this.sumNutritions.riboflavin_mg / this.dri.riboflavin_mg * 100 }
        ]
      },
      {
        type: "error",
        name: "Variability Range",
        toolTipContent: "<span style=\"color:#C0504E\">{name}</span>: {y[0]} - {y[1]}",
        dataPoints: [
          { y: [100, this.dri.vitamin_c_mg_max / this.dri.vitamin_c_mg * 100], label: "Vitamin C" },
          { y: [100, this.dri.niacin_mg_max / this.dri.niacin_mg * 100], label: "Vitamin B3" },
          { y: [100, this.dri.riboflavin_mg_max / this.dri.riboflavin_mg * 100], label: "Vitamin B2" }
        ]
      }
      ]
    });
    chart1.render();


    var macronutrients = new CanvasJS.Chart("macronutrients", {
      animationEnabled: true,
      zoomEnabled: true,
      zoomType: "y",
      title: {
        text: "Macronutrients "
      },
      axisX: {
        interval: 1
      },
      axisY: {
        viewportMinimum: 0,
        viewportMaximum: 120
      },
      toolTip: {
        shared: true
      },
      data: [{
        type: "bar",
        toolTipContent: "<span style=\"color:#0099cc\">{label}</span>: {y} (g)",
        dataPoints: [
          { label: "water_g", y: this.checkForFinite(this.sumNutritions.water_g / this.dri.water_g * 100 )},
          { label: "sugars_g", y: this.checkForFinite(this.sumNutritions.sugars_g / this.dri.sugars_g * 100 )},
          { label: "cholesterol_mg", y: this.checkForFinite(this.sumNutritions.cholesterol_mg / this.dri.cholesterol_mg * 100 )},
          { label: "fatty_acids_total_trans_g", y: this.checkForFinite(this.sumNutritions.fatty_acids_total_trans_g / this.dri.fatty_acids_total_trans_g * 100 )},
          { label: "saturated_fat_g", y: this.checkForFinite(this.sumNutritions.saturated_fat_g / this.dri.saturated_fat_g * 100 )},
          { label: "total_fat_g", y: this.checkForFinite(this.sumNutritions.total_fat_g / this.dri.total_fat_g * 100 )},
          { label: "protein_g", y: this.checkForFinite(this.sumNutritions.protein_g / this.dri.protein_g * 100 )},
          { label: "fiber_g", y: this.checkForFinite(this.sumNutritions.fiber_g / this.dri.fiber_g * 100 )},
          { label: "carbohydrate_g", y: this.checkForFinite(this.sumNutritions.carbohydrate_g / this.dri.carbohydrate_g * 100 )},
          { label: "calories", y: this.checkForFinite(this.sumNutritions.calories / this.dri.calories * 100 )}
        ]
      },
      {
        type: "error",
        name: "Variability Range",
        toolTipContent: "<span style=\"color:#C0504E\">{name}</span>: {y[0]} - {y[1]}",
        dataPoints: [
          { y: [this.checkForZero(this.dri.water_g), this.checkForFinite(this.dri.water_g_max / this.dri.water_g * 100)], label: "water_g" },
          { y: [this.checkForZero(this.dri.sugars_g), this.checkForFinite(this.dri.sugars_g_max / this.dri.sugars_g * 100)], label: "sugars_g" },
          { y: [this.checkForZero(this.dri.cholesterol_mg), this.checkForFinite(this.dri.cholesterol_mg_max / this.dri.cholesterol_mg * 100)], label: "cholesterol_mg" },
          { y: [this.checkForZero(this.dri.fatty_acids_total_trans_g), this.checkForFinite(this.dri.fatty_acids_total_trans_g_max / this.dri.fatty_acids_total_trans_g * 100)], label: "fatty_acids_total_trans_g" },
          { y: [this.checkForZero(this.dri.saturated_fat_g), this.checkForFinite(this.dri.saturated_fat_g_max / this.dri.saturated_fat_g * 100)], label: "saturated_fat_g" },
          { y: [this.checkForZero(this.dri.total_fat_g), this.checkForFinite(this.dri.total_fat_g_max / this.dri.total_fat_g * 100)], label: "total_fat_g" },
          { y: [this.checkForZero(this.dri.protein_g), this.checkForFinite(this.dri.protein_g_max / this.dri.protein_g * 100)], label: "protein_g" },
          { y: [this.checkForZero(this.dri.fiber_g), this.checkForFinite(this.dri.fiber_g_max / this.dri.fiber_g * 100)], label: "fiber_g" },
          { y: [this.checkForZero(this.dri.carbohydrate_g), this.checkForFinite(this.dri.carbohydrate_g_max / this.dri.carbohydrate_g * 100)], label: "carbohydrate_g" },
          { y: [this.checkForZero(this.dri.calories), this.checkForFinite(this.dri.calories_max / this.dri.calories * 100)], label: "calories" }
        ]
      }
      ]
    });
    macronutrients.render();
  }

  checkForZero(number: number): number {
    if (number === 0) {
      return 0;
    }
    return 100;
  }

  checkForFinite(number: number): number {
    if (isFinite(number)) {
      return number;
    }
    return 0;
  }

  ngOnInit(): void {
    this.driService.getUserActiveDris()
      .subscribe(dris => {
        this.onDateChange(this.dateOfConsumption.toISOString().split('T')[0]);
        Object.assign(this.dri, dris[0]);
        this.updateCharts();
      });
  }
}
