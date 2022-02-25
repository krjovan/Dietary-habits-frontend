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
        this.assignColor();
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

  assignColor() {
    let sumNutritionKeys = Object.keys(this.sumNutritions);
    for (let i = 0; i < sumNutritionKeys.length; i++) {
      let key = sumNutritionKeys[i];
      if (this.sumNutritions[key] < this.dri[key]) {
        this.colors[key] = "#2196F3";
      } else if (this.sumNutritions[key] >= this.dri[key] && this.sumNutritions[key] <= this.dri[key + "_max"]) {
        this.colors[key] = "#4CAF50";
      } else if (this.sumNutritions[key] > this.dri[key + "_max"]) {
        this.colors[key] = "#f44336";
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

  onClick(e) {
    console.log(e);

    document.getElementById('id01').style.display = 'block';

    var chartOptions = {
      title: {
        text: "Pie Chart"
      },
      animationEnabled: true,
      data: [
        {
          type: "pie",
          indexLabelPlacement: "inside",
          indexLabel: "#percent%",
          showInLegend: true,
          dataPoints: []
        }
      ]
    };
    var pieChartMacro = {};
    pieChartMacro = new CanvasJS.Chart('pie-chart', chartOptions);
    pieChartMacro["options"].title.text = e.dataPoint.label + " from food";
    pieChartMacro["options"].data[0].dataPoints = [];
    for (let i = 0; i < e.dataPoint.nutritions.length; i++) {
      const name = e.dataPoint.nutritions[i].nutrition["name"];
      const value = e.dataPoint.nutritions[i].quantity * e.dataPoint.nutritions[i].nutrition[e.dataPoint.key];
      if(value !== 0)
      pieChartMacro["options"].data[0].dataPoints.push({y: value, name: name});
    }
    pieChartMacro['render']();
  }

  updateCharts() {
    var chartOptions = {
      title: {
        text: "Pie Chart"
      },
      data: [
        {
          type: "pie",
          indexLabelPlacement: "inside",
          indexLabel: "#percent%",
          showInLegend: true,
          dataPoints: []
        }
      ]
    };
    var pieChartMacro = {};
    var pieChartVit = {};
    var pieChartMin = {};

    var macronutrients = new CanvasJS.Chart("macronutrients", {
      animationEnabled: true,
      zoomEnabled: true,
      zoomType: "y",
      title: {
        text: "Macronutrients"
      },
      axisX: {
        interval: 1
      },
      axisY: {
        viewportMinimum: 0,
        viewportMaximum: 150,
        valueFormatString:  "#' %'"
      },
      toolTip:{
        enabled: false,
      },
      /*toolTip: {
        shared: true,
        updated: function(e) {
          typeof pieChartMacro["destroy"] === "function" && pieChartMacro['destroy']();
          pieChartMacro = new CanvasJS.Chart('pie-chart-macro', chartOptions);
          pieChartMacro["options"].title.text = e.entries[0].dataPoint.label + " from food";
          pieChartMacro["options"].data[0].dataPoints = [];
          for (let i = 0; i < e.entries[0].dataPoint.nutritions.length; i++) {
            const name = e.entries[0].dataPoint.nutritions[i].nutrition["name"];
            const value = e.entries[0].dataPoint.nutritions[i].quantity * e.entries[0].dataPoint.nutritions[i].nutrition[e.entries[0].dataPoint.key];
            if(value !== 0)
            pieChartMacro["options"].data[0].dataPoints.push({y: value, name: name});
          }
          pieChartMacro['render']();
        },
        contentFormatter: function(e) {
          return "<div style='overflow-y: auto'><span style=\"color: " + e.entries[0].dataPoint.color + "\">" + e.entries[0].dataPoint.label + ": </span>" + e.entries[0].dataPoint.y.toFixed(2) + "%<br><span style=\"color:#4CAF50\">" + e.entries[1].dataSeries.name + "</span>: "+e.entries[1].dataPoint.y[0] + "% - " + e.entries[1].dataPoint.y[1].toFixed(2) + "%" +  "<div id='pie-chart-macro' style='width:200px; height:300px;'></div></div>";
        },
        hidden: function() {
          typeof pieChartMacro["destroy"] === "function" && pieChartMacro['destroy']();
        }
      },*/
      data: [{
        type: "bar",
        click: this.onClick,
        dataPoints: [
          { label: "Water", y: this.sumNutritions.water_g / this.dri.water_g * 100, color:this.colors["water_g"], key: "water_g", nutritions: this.nutritions },
          { label: "Sugar", y: this.sumNutritions.sugars_g / this.dri.sugars_g * 100, color:this.colors["sugars_g"], key: "sugars_g", nutritions: this.nutritions },
          { label: "Cholesterol", y: this.sumNutritions.cholesterol_mg / this.dri.cholesterol_mg * 100, color:this.colors["cholesterol_mg"], key: "cholesterol_mg", nutritions: this.nutritions },
          { label: "Total trans fat", y: this.sumNutritions.fatty_acids_total_trans_g / this.dri.fatty_acids_total_trans_g * 100, color:this.colors["fatty_acids_total_trans_g"], key: "fatty_acids_total_trans_g", nutritions: this.nutritions },
          { label: "Saturated fat", y: this.sumNutritions.saturated_fat_g / this.dri.saturated_fat_g * 100, color:this.colors["saturated_fat_g"], key: "saturated_fat_g", nutritions: this.nutritions },
          { label: "Total fat", y: this.sumNutritions.total_fat_g / this.dri.total_fat_g * 100, color:this.colors["total_fat_g"], key: "total_fat_g", nutritions: this.nutritions },
          { label: "Proteins", y: this.sumNutritions.protein_g / this.dri.protein_g * 100, color:this.colors["protein_g"], key: "protein_g", nutritions: this.nutritions },
          { label: "Fiber", y: this.sumNutritions.fiber_g / this.dri.fiber_g * 100, color:this.colors["fiber_g"], key: "fiber_g", nutritions: this.nutritions },
          { label: "Carbohydrates", y: this.sumNutritions.carbohydrate_g / this.dri.carbohydrate_g * 100, color:this.colors["carbohydrate_g"], key: "carbohydrate_g", nutritions: this.nutritions },
          { label: "Calories", y: this.sumNutritions.calories / this.dri.calories * 100, color:this.colors["calories"], key: "calories", nutritions: this.nutritions }
        ]
      },
      {
        type: "error",
        name: "Healthy range",
        color: "black",
        dataPoints: [
          { y: [100, this.dri.water_g_max / this.dri.water_g * 100], label: "Water" },
          { y: [100, this.dri.sugars_g_max / this.dri.sugars_g * 100], label: "Sugar" },
          { y: [100, this.dri.cholesterol_mg_max / this.dri.cholesterol_mg * 100], label: "Cholesterol" },
          { y: [100, this.dri.fatty_acids_total_trans_g_max / this.dri.fatty_acids_total_trans_g * 100], label: "Total trans fat" },
          { y: [100, this.dri.saturated_fat_g_max / this.dri.saturated_fat_g * 100], label: "Saturated fat" },
          { y: [100, this.dri.total_fat_g_max / this.dri.total_fat_g * 100], label: "Total fat" },
          { y: [100, this.dri.protein_g_max / this.dri.protein_g * 100], label: "Proteins" },
          { y: [100, this.dri.fiber_g_max / this.dri.fiber_g * 100], label: "Fiber" },
          { y: [100, this.dri.carbohydrate_g_max / this.dri.carbohydrate_g * 100], label: "Carbohydrates" },
          { y: [100, this.dri.calories_max / this.dri.calories * 100], label: "Calories" }
        ]
      }
      ]
    });
    macronutrients.render();

    var vitamins = new CanvasJS.Chart("vitamins", {
      animationEnabled: true,
      zoomEnabled: true,
      zoomType: "y",
      title: {
        text: "Vitamins"
      },
      axisX: {
        interval: 1
      },
      axisY: {
        viewportMinimum: 0,
        viewportMaximum: 150,
        valueFormatString:  "#' %'"
      },
      toolTip: {
        shared: true,
        updated: function(e) {
          typeof pieChartVit["destroy"] === "function" && pieChartVit['destroy']();
          pieChartVit = new CanvasJS.Chart('pie-chart-vit', chartOptions);
          pieChartVit["options"].title.text = e.entries[0].dataPoint.label + " from food";
          pieChartVit["options"].data[0].dataPoints = [];
          for (let i = 0; i < e.entries[0].dataPoint.nutritions.length; i++) {
            const name = e.entries[0].dataPoint.nutritions[i].nutrition["name"];
            const value = e.entries[0].dataPoint.nutritions[i].quantity * e.entries[0].dataPoint.nutritions[i].nutrition[e.entries[0].dataPoint.key];
            if(value !== 0)
            pieChartVit["options"].data[0].dataPoints.push({y: value, name: name});
          }
          pieChartVit['render']();
        },
        contentFormatter: function(e) {
          return "<span style=\"color: " + e.entries[0].dataPoint.color + "\">" + e.entries[0].dataPoint.label + ": </span>" + e.entries[0].dataPoint.y.toFixed(2) + "%<br><span style=\"color:#4CAF50\">" + e.entries[1].dataSeries.name + "</span>: "+e.entries[1].dataPoint.y[0] + "% - " + e.entries[1].dataPoint.y[1].toFixed(2) + "%" +  "<div id='pie-chart-vit' style='width:200px; height:300px;'></div>";
        },
        hidden: function() {
          typeof pieChartVit["destroy"] === "function" && pieChartVit['destroy']();
        }
      },
      data: [{
        type: "bar",
        dataPoints: [
          { label: "Vitamin K", y: this.sumNutritions.vitamin_k_mcg / this.dri.vitamin_k_mcg * 100, color:this.colors["vitamin_k_mcg"], key: "vitamin_k_mcg", nutritions: this.nutritions },
          { label: "Vitamin E", y: this.sumNutritions.vitamin_e_mg / this.dri.vitamin_e_mg * 100, color:this.colors["vitamin_e_mg"], key: "vitamin_e_mg", nutritions: this.nutritions },
          { label: "Vitamin D", y: this.sumNutritions.vitamin_d_IU / this.dri.vitamin_d_IU * 100, color:this.colors["vitamin_d_IU"], key: "vitamin_d_IU", nutritions: this.nutritions },
          { label: "Vitamin C", y: this.sumNutritions.vitamin_c_mg / this.dri.vitamin_c_mg * 100, color:this.colors["vitamin_c_mg"], key: "vitamin_c_mg", nutritions: this.nutritions },
          { label: "Choline", y: this.sumNutritions.choline_mg / this.dri.choline_mg * 100, color:this.colors["choline_mg"], key: "choline_mg", nutritions: this.nutritions },
          { label: "Vitamin B12", y: this.sumNutritions.vitamin_b12_mcg / this.dri.vitamin_b12_mcg * 100, color:this.colors["vitamin_b12_mcg"], key: "vitamin_b12_mcg", nutritions: this.nutritions },
          { label: "Folate - B9", y: this.sumNutritions.folate_mcg / this.dri.folate_mcg * 100, color:this.colors["folate_mcg"], key: "folate_mcg", nutritions: this.nutritions },
          { label: "Vitamin B6", y: this.sumNutritions.vitamin_b6_mg / this.dri.vitamin_b6_mg * 100, color:this.colors["vitamin_b6_mg"], key: "vitamin_b6_mg", nutritions: this.nutritions },
          { label: "Pantothenic acid - B5", y: this.sumNutritions.pantothenic_acid_mg / this.dri.pantothenic_acid_mg * 100, color:this.colors["pantothenic_acid_mg"], key: "pantothenic_acid_mg", nutritions: this.nutritions },
          { label: "Niacin - B3", y: this.sumNutritions.niacin_mg / this.dri.niacin_mg * 100, color:this.colors["niacin_mg"], key: "niacin_mg", nutritions: this.nutritions },
          { label: "Riboflavin - B2", y: this.sumNutritions.riboflavin_mg / this.dri.riboflavin_mg * 100, color:this.colors["riboflavin_mg"], key: "riboflavin_mg", nutritions: this.nutritions },
          { label: "Thiamin - B1", y: this.sumNutritions.thiamin_mg / this.dri.thiamin_mg * 100, color:this.colors["thiamin_mg"], key: "thiamin_mg", nutritions: this.nutritions },
          { label: "Vitamin A", y: this.sumNutritions.vitamin_a_rae_mcg / this.dri.vitamin_a_rae_mcg * 100, color:this.colors["vitamin_a_rae_mcg"], key: "vitamin_a_rae_mcg", nutritions: this.nutritions }
        ]
      },
      {
        type: "error",
        name: "Healthy range",
        color: "black",
        dataPoints: [
          { y: [100, this.dri.vitamin_k_mcg_max / this.dri.vitamin_k_mcg * 100], label: "Vitamin K" },
          { y: [100, this.dri.vitamin_e_mg_max / this.dri.vitamin_e_mg * 100], label: "Vitamin E" },
          { y: [100, this.dri.vitamin_d_IU_max / this.dri.vitamin_d_IU * 100], label: "Vitamin D" },
          { y: [100, this.dri.vitamin_c_mg_max / this.dri.vitamin_c_mg * 100], label: "Vitamin C" },
          { y: [100, this.dri.choline_mg_max / this.dri.choline_mg * 100], label: "Choline" },
          { y: [100, this.dri.vitamin_b12_mcg_max / this.dri.vitamin_b12_mcg * 100], label: "Vitamin B12" },
          { y: [100, this.dri.folate_mcg_max / this.dri.folate_mcg * 100], label: "Folate - B9" },
          { y: [100, this.dri.vitamin_b6_mg_max / this.dri.vitamin_b6_mg * 100], label: "Vitamin B6" },
          { y: [100, this.dri.pantothenic_acid_mg_max / this.dri.pantothenic_acid_mg * 100], label: "Pantothenic acid - B5" },
          { y: [100, this.dri.niacin_mg_max / this.dri.niacin_mg * 100], label: "Niacin - B3" },
          { y: [100, this.dri.riboflavin_mg_max / this.dri.riboflavin_mg * 100], label: "Riboflavin - B2" },
          { y: [100, this.dri.thiamin_mg_max / this.dri.thiamin_mg * 100], label: "Thiamin - B1" },
          { y: [100, this.dri.vitamin_a_rae_mcg_max / this.dri.vitamin_a_rae_mcg * 100], label: "Vitamin A" }
        ]
      }
      ]
    });
    vitamins.render();

    var minerals = new CanvasJS.Chart("minerals", {
      animationEnabled: true,
      zoomEnabled: true,
      zoomType: "y",
      title: {
        text: "Minerals"
      },
      axisX: {
        interval: 1
      },
      axisY: {
        viewportMinimum: 0,
        viewportMaximum: 150,
        valueFormatString:  "#' %'"
      },
      toolTip: {
        shared: true,
        updated: function(e) {
          typeof pieChartMin["destroy"] === "function" && pieChartMin['destroy']();
          pieChartMin = new CanvasJS.Chart('pie-chart-min', chartOptions);
          pieChartMin["options"].title.text = e.entries[0].dataPoint.label + " from food";
          pieChartMin["options"].data[0].dataPoints = [];
          for (let i = 0; i < e.entries[0].dataPoint.nutritions.length; i++) {
            const name = e.entries[0].dataPoint.nutritions[i].nutrition["name"];
            const value = e.entries[0].dataPoint.nutritions[i].quantity * e.entries[0].dataPoint.nutritions[i].nutrition[e.entries[0].dataPoint.key];
            if(value !== 0)
            pieChartMin["options"].data[0].dataPoints.push({y: value, name: name});
          }
          pieChartMin['render']();
        },
        contentFormatter: function(e) {
          return "<span style=\"color: " + e.entries[0].dataPoint.color + "\">" + e.entries[0].dataPoint.label + ": </span>" + e.entries[0].dataPoint.y.toFixed(2) + "%<br><span style=\"color:#4CAF50\">" + e.entries[1].dataSeries.name + "</span>: "+e.entries[1].dataPoint.y[0] + "% - " + e.entries[1].dataPoint.y[1].toFixed(2) + "%" +  "<div id='pie-chart-min' style='width:200px; height:300px;'></div>";
        },
        hidden: function() {
          typeof pieChartMin["destroy"] === "function" && pieChartMin['destroy']();
        }
      },
      data: [{
        type: "bar",
        yValueFormatString:"#.00",
        dataPoints: [
          { label: "Zink", y: this.sumNutritions.zink_mg / this.dri.zink_mg * 100, color:this.colors["zink_mg"], key: "zink_mg", nutritions: this.nutritions},
          { label: "Sodium", y: this.sumNutritions.sodium_mg / this.dri.sodium_mg * 100, color:this.colors["sodium_mg"], key: "sodium_mg", nutritions: this.nutritions},
          { label: "Selenium", y: this.sumNutritions.selenium_mcg / this.dri.selenium_mcg * 100, color:this.colors["selenium_mcg"], key: "selenium_mcg", nutritions: this.nutritions},
          { label: "Potassium", y: this.sumNutritions.potassium_mg / this.dri.potassium_mg * 100, color:this.colors["potassium_mg"], key: "potassium_mg", nutritions: this.nutritions},
          { label: "Phosphorous", y: this.sumNutritions.phosphorous_mg / this.dri.phosphorous_mg * 100, color:this.colors["phosphorous_mg"], key: "phosphorous_mg", nutritions: this.nutritions},
          { label: "Manganese", y: this.sumNutritions.manganese_mg / this.dri.manganese_mg * 100, color:this.colors["manganese_mg"], key: "manganese_mg", nutritions: this.nutritions},
          { label: "Magnesium", y: this.sumNutritions.magnesium_mg / this.dri.magnesium_mg * 100, color:this.colors["magnesium_mg"], key: "magnesium_mg", nutritions: this.nutritions},
          { label: "Iron", y: this.sumNutritions.irom_mg / this.dri.irom_mg * 100, color:this.colors["irom_mg"], key: "irom_mg", nutritions: this.nutritions},
          { label: "Copper", y: this.sumNutritions.copper_mg / this.dri.copper_mg * 100, color:this.colors["copper_mg"], key: "copper_mg", nutritions: this.nutritions},
          { label: "Calcium", y: this.sumNutritions.calcium_mg / this.dri.calcium_mg * 100, color:this.colors["calcium_mg"], key: "calcium_mg", nutritions: this.nutritions}
        ]
      },
      {
        type: "error",
        name: "Healthy",
        color: "black",
        yValueFormatString:"#.00",
        dataPoints: [
          { y: [100, this.dri.zink_mg_max / this.dri.zink_mg * 100], label: "Zink" },
          { y: [100, this.dri.sodium_mg_max / this.dri.sodium_mg * 100], label: "Sodium" },
          { y: [100, this.dri.selenium_mcg_max / this.dri.selenium_mcg * 100], label: "Selenium" },
          { y: [100, this.dri.potassium_mg_max / this.dri.potassium_mg * 100], label: "Potassium" },
          { y: [100, this.dri.phosphorous_mg_max / this.dri.phosphorous_mg * 100], label: "Phosphorous" },
          { y: [100, this.dri.manganese_mg_max / this.dri.manganese_mg * 100], label: "Manganese" },
          { y: [100, this.dri.magnesium_mg_max / this.dri.magnesium_mg * 100], label: "Magnesium" },
          { y: [100, this.dri.irom_mg_max / this.dri.irom_mg * 100], label: "Iron" },
          { y: [100, this.dri.copper_mg_max / this.dri.copper_mg * 100], label: "Copper" },
          { y: [100, this.dri.calcium_mg_max / this.dri.calcium_mg * 100], label: "Calcium" }
        ]
      }
      ]
    });
    minerals.render();
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
