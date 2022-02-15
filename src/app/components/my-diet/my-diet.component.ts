import { Component, OnInit } from '@angular/core';
import { UserNutritionService } from '../../services/user-nutrition.service';
import { DriService } from '../../services/dri.service';
import { AuthenticationService } from '../../services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import * as CanvasJS from '../../../assets/canvasjs.min.js';

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
  sum:any = <any>{};

  constructor(
    private userNutritionService: UserNutritionService,
    private auth: AuthenticationService,
    private driService: DriService,
    private toastr: ToastrService,
  ) { }

  onDateChange(date) {
    this.dateOfConsumption = new Date(date);
    this.isLoaded = false;
    var body = {
      id: this.auth.getUserDetails()._id,
      date_of_consumption: date
    }
    this.userNutritionService.getUserNutritions(body)
      .subscribe(nutritions => {
        this.isLoaded = true;
        this.nutritions = nutritions;
        this.calculateSum(nutritions);
        this.updateCharts();
        this.toastr.success('Found ' + nutritions.length + ' nutrition/s', 'Success');
      });
  }

  calculateSum(nutritions) {
    this.setAllToZero();

    for (let i = 0; i < nutritions.length; i++) {
      this.sum.quantity += nutritions[i].quantity;

      this.sum.calories += nutritions[i].nutrition.calories * nutritions[i].quantity / 100;
      this.sum.carbohydrate_g += nutritions[i].nutrition.carbohydrate_g * nutritions[i].quantity / 100;
      this.sum.fiber_g += nutritions[i].nutrition.fiber_g * nutritions[i].quantity / 100;
      this.sum.protein_g += nutritions[i].nutrition.protein_g * nutritions[i].quantity / 100;
      this.sum.total_fat_g += nutritions[i].nutrition.total_fat_g * nutritions[i].quantity / 100;
      this.sum.saturated_fat_g += nutritions[i].nutrition.saturated_fat_g * nutritions[i].quantity / 100;
      this.sum.fatty_acids_total_trans_g += nutritions[i].nutrition.fatty_acids_total_trans_g * nutritions[i].quantity / 100;
      this.sum.cholesterol_mg += nutritions[i].nutrition.cholesterol_mg * nutritions[i].quantity / 100;
      this.sum.sugars_g += nutritions[i].nutrition.sugars_g * nutritions[i].quantity / 100;
      this.sum.water_g += nutritions[i].nutrition.water_g * nutritions[i].quantity / 100;

      this.sum.vitamin_a_rae_mcg += nutritions[i].nutrition.vitamin_a_rae_mcg * nutritions[i].quantity / 100;
      this.sum.thiamin_mg += nutritions[i].nutrition.thiamin_mg * nutritions[i].quantity / 100;
      this.sum.riboflavin_mg += nutritions[i].nutrition.riboflavin_mg * nutritions[i].quantity / 100;
      this.sum.niacin_mg += nutritions[i].nutrition.niacin_mg * nutritions[i].quantity / 100;
      this.sum.pantothenic_acid_mg += nutritions[i].nutrition.pantothenic_acid_mg * nutritions[i].quantity / 100;
      this.sum.vitamin_b6_mg += nutritions[i].nutrition.vitamin_b6_mg * nutritions[i].quantity / 100;
      this.sum.folate_mcg += nutritions[i].nutrition.folate_mcg * nutritions[i].quantity / 100;
      this.sum.vitamin_b12_mcg += nutritions[i].nutrition.vitamin_b12_mcg * nutritions[i].quantity / 100;
      this.sum.choline_mg += nutritions[i].nutrition.choline_mg * nutritions[i].quantity / 100;
      this.sum.vitamin_c_mg += nutritions[i].nutrition.vitamin_c_mg * nutritions[i].quantity / 100;
      this.sum.vitamin_d_IU += nutritions[i].nutrition.vitamin_d_IU * nutritions[i].quantity / 100;
      this.sum.vitamin_e_mg += nutritions[i].nutrition.vitamin_e_mg * nutritions[i].quantity / 100;
      this.sum.vitamin_k_mcg += nutritions[i].nutrition.vitamin_k_mcg * nutritions[i].quantity / 100;

      this.sum.calcium_mg += nutritions[i].nutrition.calcium_mg * nutritions[i].quantity / 100;
      this.sum.copper_mg += nutritions[i].nutrition.copper_mg * nutritions[i].quantity / 100;
      this.sum.irom_mg += nutritions[i].nutrition.irom_mg * nutritions[i].quantity / 100;
      this.sum.magnesium_mg += nutritions[i].nutrition.magnesium_mg * nutritions[i].quantity / 100;
      this.sum.manganese_mg += nutritions[i].nutrition.manganese_mg * nutritions[i].quantity / 100;
      this.sum.phosphorous_mg += nutritions[i].nutrition.phosphorous_mg * nutritions[i].quantity / 100;
      this.sum.potassium_mg += nutritions[i].nutrition.potassium_mg * nutritions[i].quantity / 100;
      this.sum.selenium_mcg += nutritions[i].nutrition.selenium_mcg * nutritions[i].quantity / 100;
      this.sum.sodium_mg += nutritions[i].nutrition.sodium_mg * nutritions[i].quantity / 100;
      this.sum.zink_mg += nutritions[i].nutrition.zink_mg * nutritions[i].quantity / 100;
    }
  }

  setAllToZero() {
    for (let i = 0; i < Object.keys(this.sum).length; i++) {
      this.sum[Object.keys(this.sum)[i]] = 0;
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
          { y: this.sum.protein_g, name: "Protein" },
          { y: this.sum.carbohydrate_g, name: "Carbohydrate" },
          { y: this.sum.total_fat_g, name: "Fat" }
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
            { y: this.sum.water_g, label: "Today" }
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
          { label: "Vitamin C", y: this.sum.vitamin_c_mg / this.dri.vitamin_c_mg_min * 100 },
          { label: "Vitamin B3", y: this.sum.niacin_mg / this.dri.niacin_mg_min * 100 },
          { label: "Vitamin B2", y: this.sum.riboflavin_mg / this.dri.riboflavin_mg_min * 100 }
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
      this.sum['quantity'] = 0;

      this.sum['calories'] = 0;
      this.sum['carbohydrate_g'] = 0;
      this.sum['fiber_g'] = 0;
      this.sum['protein_g'] = 0;
      this.sum['total_fat_g'] = 0;
      this.sum['saturated_fat_g'] = 0;
      this.sum['fatty_acids_total_trans_g'] = 0;
      this.sum['cholesterol_mg'] = 0;
      this.sum['sugars_g'] = 0;
      this.sum['water_g'] = 0;

      this.sum['vitamin_a_rae_mcg'] = 0;
      this.sum['thiamin_mg'] = 0;
      this.sum['riboflavin_mg'] = 0;
      this.sum['niacin_mg'] = 0;
      this.sum['pantothenic_acid_mg'] = 0;
      this.sum['vitamin_b6_mg'] = 0;
      this.sum['folate_mcg'] = 0;
      this.sum['vitamin_b12_mcg'] = 0;
      this.sum['choline_mg'] = 0;
      this.sum['vitamin_c_mg'] = 0;
      this.sum['vitamin_d_IU'] = 0;
      this.sum['vitamin_e_mg'] = 0;
      this.sum['vitamin_k_mcg'] = 0;

      this.sum['calcium_mg'] = 0;
      this.sum['copper_mg'] = 0;
      this.sum['irom_mg'] = 0;
      this.sum['magnesium_mg'] = 0;
      this.sum['manganese_mg'] = 0;
      this.sum['phosphorous_mg'] = 0;
      this.sum['potassium_mg'] = 0;
      this.sum['selenium_mcg'] = 0;
      this.sum['sodium_mg'] = 0;
      this.sum['zink_mg'] = 0;
  }
}
