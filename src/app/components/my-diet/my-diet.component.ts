import { Component, OnInit } from '@angular/core';
import { UserNutritionService } from '../../services/user-nutrition.service';
import { DriService } from '../../services/dri.service';
import { AuthenticationService } from '../../services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import * as CanvasJS from '../../../assets/canvasjs.min.js';
import { SummedUpNutritions } from '../../models/summed-up-nutritions';

@Component({
  selector: 'app-my-diet',
  templateUrl: './my-diet.component.html',
  styleUrls: ['./my-diet.component.css']
})
export class MyDietComponent implements OnInit {

  dri: any = <any>{};
  notNullDri: any = <any>{};
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
    this.setAllToZero();
    let sumNutritionKeys = Object.keys(this.sumNutritions);
    for (let i = 0; i < nutritions.length; i++) {
      this.sumQuantity += nutritions[i].quantity;
      //divided by 100 to get the ratio for quantity from grams, e.g. 50g = 0.5, 100g = 1, 1000g = 10...
      let nutritionQuantityRatio = nutritions[i].quantity / 100;
      let nutrition = nutritions[i].nutrition;
      for (let j = 0; j < sumNutritionKeys.length; j++) {
        let key = sumNutritionKeys[j];
        this.sumNutritions[key] += nutrition[key] * nutritionQuantityRatio;
      }
    }
  }

  setAllToZero() {
    this.sumQuantity = 0;
    for (let i = 0; i < Object.keys(this.sumNutritions).length; i++) {
      this.sumNutritions[Object.keys(this.sumNutritions)[i]] = 0;
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

    console.log(this.notNullDri);
    var arrayForVitamins = [];

    for (let i = 0; i < Object.values(this.notNullDri).length; i += 2) {
      if (Object.keys(this.notNullDri)[i]) {
        arrayForVitamins.push();
      }
    }

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
            { y: [this.dri.water_g_min, this.dri.water_g_max], label: "Today" }
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
          { label: "Vitamin C", y: this.sumNutritions.vitamin_c_mg / this.dri.vitamin_c_mg_min * 100 },
          { label: "Vitamin B3", y: this.sumNutritions.niacin_mg / this.dri.niacin_mg_min * 100 },
          { label: "Vitamin B2", y: this.sumNutritions.riboflavin_mg / this.dri.riboflavin_mg_min * 100 }
        ]
      },
      {
        type: "error",
        name: "Variability Range",
        toolTipContent: "<span style=\"color:#C0504E\">{name}</span>: {y[0]} - {y[1]}",
        dataPoints: [
          { y: [100, this.dri.vitamin_c_mg_max / this.dri.vitamin_c_mg_min * 100], label: "Vitamin C" },
          { y: [100, this.dri.niacin_mg_max / this.dri.niacin_mg_min * 100], label: "Vitamin B3" },
          { y: [100, this.dri.riboflavin_mg_max / this.dri.riboflavin_mg_min * 100], label: "Vitamin B2" }
        ]
      }
      ]
    });
    chart1.render();
  }

  ngOnInit(): void {
    this.sumNutritions = new SummedUpNutritions();
    this.driService.getUserActiveDris()
      .subscribe(dris => {
        this.onDateChange(this.dateOfConsumption.toISOString().split('T')[0]);
        Object.assign(this.dri, dris[0]);
        this.notNullDri = {};
        const ordered = Object.keys(this.dri).sort().reduce(
          (obj, key) => {
            obj[key] = this.dri[key];
            return obj;
          },
          {}
        );
        delete ordered['active'];
        delete ordered['name'];
        delete ordered['user_id'];
        delete ordered['__v'];
        delete ordered['_id'];
        for (let i = 0; i < Object.values(ordered).length; i += 2) {
          if (Object.values(ordered)[i] === null || Object.values(ordered)[i + 1] === null) {
            continue;
          } else {
            this.notNullDri[Object.keys(ordered)[i]] = Object.values(ordered)[i];
            this.notNullDri[Object.keys(ordered)[i+1]] = Object.values(ordered)[i+1];
          }
        }
        this.updateCharts();
      });
  }
}
