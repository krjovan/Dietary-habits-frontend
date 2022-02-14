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
      this.sum.sumquantity += nutritions[i].quantity;
      this.sum.sumcalories += nutritions[i].nutrition.calories * nutritions[i].quantity / 100;
      this.sum.sumtotal_fat_g += nutritions[i].nutrition.total_fat_g * nutritions[i].quantity / 100;
      this.sum.sumsaturated_fat_g += nutritions[i].nutrition.saturated_fat_g * nutritions[i].quantity / 100;
      this.sum.sumcholesterol_mg += nutritions[i].nutrition.cholesterol_mg * nutritions[i].quantity / 100;
      this.sum.sumsodium_mg += nutritions[i].nutrition.sodium_mg * nutritions[i].quantity / 100;
      this.sum.sumcholine_mg += nutritions[i].nutrition.choline_mg * nutritions[i].quantity / 100;
      this.sum.sumfolate_mcg += nutritions[i].nutrition.folate_mcg * nutritions[i].quantity / 100;
      this.sum.sumfolic_acid_mcg += nutritions[i].nutrition.folic_acid_mcg * nutritions[i].quantity / 100;
      this.sum.sumniacin_mg += nutritions[i].nutrition.niacin_mg * nutritions[i].quantity / 100;
      this.sum.sumpantothenic_acid_mg += nutritions[i].nutrition.pantothenic_acid_mg * nutritions[i].quantity / 100;
      this.sum.sumriboflavin_mg += nutritions[i].nutrition.riboflavin_mg * nutritions[i].quantity / 100;
      this.sum.sumthiamin_mg += nutritions[i].nutrition.thiamin_mg * nutritions[i].quantity / 100;
      this.sum.sumvitamin_a_IU += nutritions[i].nutrition.vitamin_a_IU * nutritions[i].quantity / 100;
      this.sum.sumvitamin_a_rae_mcg += nutritions[i].nutrition.vitamin_a_rae_mcg * nutritions[i].quantity / 100;
      this.sum.sumcarotene_alpha_mcg += nutritions[i].nutrition.carotene_alpha_mcg * nutritions[i].quantity / 100;
      this.sum.sumcarotene_beta_mcg += nutritions[i].nutrition.carotene_beta_mcg * nutritions[i].quantity / 100;
      this.sum.sumcryptoxanthin_beta_mcg += nutritions[i].nutrition.cryptoxanthin_beta_mcg * nutritions[i].quantity / 100;
      this.sum.sumlutein_zeaxanthin_mcg += nutritions[i].nutrition.lutein_zeaxanthin_mcg * nutritions[i].quantity / 100;
      this.sum.sumvitamin_b12_mcg += nutritions[i].nutrition.vitamin_b12_mcg * nutritions[i].quantity / 100;
      this.sum.sumvitamin_b6_mg += nutritions[i].nutrition.vitamin_b6_mg * nutritions[i].quantity / 100;
      this.sum.sumvitamin_c_mg += nutritions[i].nutrition.vitamin_c_mg * nutritions[i].quantity / 100;
      this.sum.sumvitamin_d_IU += nutritions[i].nutrition.vitamin_d_IU * nutritions[i].quantity / 100;
      this.sum.sumvitamin_e_mg += nutritions[i].nutrition.vitamin_e_mg * nutritions[i].quantity / 100;
      this.sum.sumtocopherol_alpha_mg += nutritions[i].nutrition.tocopherol_alpha_mg * nutritions[i].quantity / 100;
      this.sum.sumvitamin_k_mcg += nutritions[i].nutrition.vitamin_k_mcg * nutritions[i].quantity / 100;
      this.sum.sumcalcium_mg += nutritions[i].nutrition.calcium_mg * nutritions[i].quantity / 100;
      this.sum.sumcopper_mg += nutritions[i].nutrition.copper_mg * nutritions[i].quantity / 100;
      this.sum.sumirom_mg += nutritions[i].nutrition.irom_mg * nutritions[i].quantity / 100;
      this.sum.summagnesium_mg += nutritions[i].nutrition.magnesium_mg * nutritions[i].quantity / 100;
      this.sum.summanganese_mg += nutritions[i].nutrition.manganese_mg * nutritions[i].quantity / 100;
      this.sum.sumphosphorous_mg += nutritions[i].nutrition.phosphorous_mg * nutritions[i].quantity / 100;
      this.sum.sumpotassium_mg += nutritions[i].nutrition.potassium_mg * nutritions[i].quantity / 100;
      this.sum.sumselenium_mcg += nutritions[i].nutrition.selenium_mcg * nutritions[i].quantity / 100;
      this.sum.sumzink_mg += nutritions[i].nutrition.zink_mg * nutritions[i].quantity / 100;
      this.sum.sumprotein_g += nutritions[i].nutrition.protein_g * nutritions[i].quantity / 100;
      this.sum.sumalanine_g += nutritions[i].nutrition.alanine_g * nutritions[i].quantity / 100;
      this.sum.sumarginine_g += nutritions[i].nutrition.arginine_g * nutritions[i].quantity / 100;
      this.sum.sumaspartic_acid_g += nutritions[i].nutrition.aspartic_acid_g * nutritions[i].quantity / 100;
      this.sum.sumcystine_g += nutritions[i].nutrition.cystine_g * nutritions[i].quantity / 100;
      this.sum.sumglutamic_acid_g += nutritions[i].nutrition.glutamic_acid_g * nutritions[i].quantity / 100;
      this.sum.sumglycine_g += nutritions[i].nutrition.glycine_g * nutritions[i].quantity / 100;
      this.sum.sumhistidine_g += nutritions[i].nutrition.histidine_g * nutritions[i].quantity / 100;
      this.sum.sumhydroxyproline_g += nutritions[i].nutrition.hydroxyproline_g * nutritions[i].quantity / 100;
      this.sum.sumisoleucine_g += nutritions[i].nutrition.isoleucine_g * nutritions[i].quantity / 100;
      this.sum.sumleucine_g += nutritions[i].nutrition.leucine_g * nutritions[i].quantity / 100;
      this.sum.sumlysine_g += nutritions[i].nutrition.lysine_g * nutritions[i].quantity / 100;
      this.sum.summethionine_g += nutritions[i].nutrition.methionine_g * nutritions[i].quantity / 100;
      this.sum.sumphenylalanine_g += nutritions[i].nutrition.phenylalanine_g * nutritions[i].quantity / 100;
      this.sum.sumproline_g += nutritions[i].nutrition.proline_g * nutritions[i].quantity / 100;
      this.sum.sumserine_g += nutritions[i].nutrition.serine_g * nutritions[i].quantity / 100;
      this.sum.sumthreonine_g += nutritions[i].nutrition.threonine_g * nutritions[i].quantity / 100;
      this.sum.sumtryptophan_g += nutritions[i].nutrition.tryptophan_g * nutritions[i].quantity / 100;
      this.sum.sumtyrosine_g += nutritions[i].nutrition.tyrosine_g * nutritions[i].quantity / 100;
      this.sum.sumvaline_g += nutritions[i].nutrition.valine_g * nutritions[i].quantity / 100;
      this.sum.sumcarbohydrate_g += nutritions[i].nutrition.carbohydrate_g * nutritions[i].quantity / 100;
      this.sum.sumfiber_g += nutritions[i].nutrition.fiber_g * nutritions[i].quantity / 100;
      this.sum.sumsugars_g += nutritions[i].nutrition.sugars_g * nutritions[i].quantity / 100;
      this.sum.sumfructose_g += nutritions[i].nutrition.fructose_g * nutritions[i].quantity / 100;
      this.sum.sumgalactose_g += nutritions[i].nutrition.galactose_g * nutritions[i].quantity / 100;
      this.sum.sumglucose_g += nutritions[i].nutrition.glucose_g * nutritions[i].quantity / 100;
      this.sum.sumlactose_g += nutritions[i].nutrition.lactose_g * nutritions[i].quantity / 100;
      this.sum.summaltose_g += nutritions[i].nutrition.maltose_g * nutritions[i].quantity / 100;
      this.sum.sumsucrose_g += nutritions[i].nutrition.sucrose_g * nutritions[i].quantity / 100;
      this.sum.sumfat_g += nutritions[i].nutrition.fat_g * nutritions[i].quantity / 100;
      this.sum.sumsaturated_fatty_acids_g += nutritions[i].nutrition.saturated_fatty_acids_g * nutritions[i].quantity / 100;
      this.sum.summonounsaturated_fatty_acids_g += nutritions[i].nutrition.monounsaturated_fatty_acids_g * nutritions[i].quantity / 100;
      this.sum.sumpolyunsaturated_fatty_acids_g += nutritions[i].nutrition.polyunsaturated_fatty_acids_g * nutritions[i].quantity / 100;
      this.sum.sumfatty_acids_total_trans_g += nutritions[i].nutrition.fatty_acids_total_trans_g * nutritions[i].quantity / 100;
      this.sum.sumalcohol_g += nutritions[i].nutrition.alcohol_g * nutritions[i].quantity / 100;
      this.sum.sumash_g += nutritions[i].nutrition.ash_g * nutritions[i].quantity / 100;
      this.sum.sumcaffeine_mg += nutritions[i].nutrition.caffeine_mg * nutritions[i].quantity / 100;
      this.sum.sumtheobromine_mg += nutritions[i].nutrition.theobromine_mg * nutritions[i].quantity / 100;
      this.sum.sumwater_g += nutritions[i].nutrition.water_g * nutritions[i].quantity / 100;
    }
  }

  setAllToZero() {
    this.sum.sumquantity = 0;
    this.sum.sumcalories = 0;
    this.sum.sumtotal_fat_g = 0;
    this.sum.sumsaturated_fat_g = 0;
    this.sum.sumcholesterol_mg = 0;
    this.sum.sumsodium_mg = 0;
    this.sum.sumcholine_mg = 0;
    this.sum.sumfolate_mcg = 0;
    this.sum.sumfolic_acid_mcg = 0;
    this.sum.sumniacin_mg = 0;
    this.sum.sumpantothenic_acid_mg = 0;
    this.sum.sumriboflavin_mg = 0;
    this.sum.sumthiamin_mg = 0;
    this.sum.sumvitamin_a_IU = 0;
    this.sum.sumvitamin_a_rae_mcg = 0;
    this.sum.sumcarotene_alpha_mcg = 0;
    this.sum.sumcarotene_beta_mcg = 0;
    this.sum.sumcryptoxanthin_beta_mcg = 0;
    this.sum.sumlutein_zeaxanthin_mcg = 0;
    this.sum.sumvitamin_b12_mcg = 0;
    this.sum.sumvitamin_b6_mg = 0;
    this.sum.sumvitamin_c_mg = 0;
    this.sum.sumvitamin_d_IU = 0;
    this.sum.sumvitamin_e_mg = 0;
    this.sum.sumtocopherol_alpha_mg = 0;
    this.sum.sumvitamin_k_mcg = 0;
    this.sum.sumcalcium_mg = 0;
    this.sum.sumcopper_mg = 0;
    this.sum.sumirom_mg = 0;
    this.sum.summagnesium_mg = 0;
    this.sum.summanganese_mg = 0;
    this.sum.sumphosphorous_mg = 0;
    this.sum.sumpotassium_mg = 0;
    this.sum.sumselenium_mcg = 0;
    this.sum.sumzink_mg = 0;
    this.sum.sumprotein_g = 0;
    this.sum.sumalanine_g = 0;
    this.sum.sumarginine_g = 0;
    this.sum.sumaspartic_acid_g = 0;
    this.sum.sumcystine_g = 0;
    this.sum.sumglutamic_acid_g = 0;
    this.sum.sumglycine_g = 0;
    this.sum.sumhistidine_g = 0;
    this.sum.sumhydroxyproline_g = 0;
    this.sum.sumisoleucine_g = 0;
    this.sum.sumleucine_g = 0;
    this.sum.sumlysine_g = 0;
    this.sum.summethionine_g = 0;
    this.sum.sumphenylalanine_g = 0;
    this.sum.sumproline_g = 0;
    this.sum.sumserine_g = 0;
    this.sum.sumthreonine_g = 0;
    this.sum.sumtryptophan_g = 0;
    this.sum.sumtyrosine_g = 0;
    this.sum.sumvaline_g = 0;
    this.sum.sumcarbohydrate_g = 0;
    this.sum.sumfiber_g = 0;
    this.sum.sumsugars_g = 0;
    this.sum.sumfructose_g = 0;
    this.sum.sumgalactose_g = 0;
    this.sum.sumglucose_g = 0;
    this.sum.sumlactose_g = 0;
    this.sum.summaltose_g = 0;
    this.sum.sumsucrose_g = 0;
    this.sum.sumfat_g = 0;
    this.sum.sumsaturated_fatty_acids_g = 0;
    this.sum.summonounsaturated_fatty_acids_g = 0;
    this.sum.sumpolyunsaturated_fatty_acids_g = 0;
    this.sum.sumfatty_acids_total_trans_g = 0;
    this.sum.sumalcohol_g = 0;
    this.sum.sumash_g = 0;
    this.sum.sumcaffeine_mg = 0;
    this.sum.sumtheobromine_mg = 0;
    this.sum.sumwater_g = 0;
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
          { y: this.sum.sumprotein_g, name: "Protein" },
          { y: this.sum.sumcarbohydrate_g, name: "Carbohydrate" },
          { y: this.sum.sumtotal_fat_g, name: "Fat" }
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
            { y: this.sum.sumwater_g, label: "Today" }
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
          { label: "Vitamin C", y: this.sum.sumvitamin_c_mg / this.dri.vitamin_c_mg_min * 100 },
          { label: "Vitamin B3", y: this.sum.sumniacin_mg / this.dri.niacin_mg_min * 100 },
          { label: "Vitamin B2", y: this.sum.sumriboflavin_mg / this.dri.riboflavin_mg_min * 100 }
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
    this.sum['sumquantity'] = 0;
    this.sum['sumcalories'] = 0;
    this.sum['sumtotal_fat_g'] = 0;
    this.sum['sumsaturated_fat_g'] = 0;
    this.sum['sumcholesterol_mg'] = 0;
    this.sum['sumsodium_mg'] = 0;
    this.sum['sumcholine_mg'] = 0;
    this.sum['sumfolate_mcg'] = 0;
    this.sum['sumfolic_acid_mcg'] = 0;
    this.sum['sumniacin_mg'] = 0;
    this.sum['sumpantothenic_acid_mg'] = 0;
    this.sum['sumriboflavin_mg'] = 0;
    this.sum['sumthiamin_mg'] = 0;
    this.sum['sumvitamin_a_IU'] = 0;
    this.sum['sumvitamin_a_rae_mcg'] = 0;
    this.sum['sumcarotene_alpha_mcg'] = 0;
    this.sum['sumcarotene_beta_mcg'] = 0;
    this.sum['sumcryptoxanthin_beta_mcg'] = 0;
    this.sum['sumlutein_zeaxanthin_mcg'] = 0;
    this.sum['sumvitamin_b12_mcg'] = 0;
    this.sum['sumvitamin_b6_mg'] = 0;
    this.sum['sumvitamin_c_mg'] = 0;
    this.sum['sumvitamin_d_IU'] = 0;
    this.sum['sumvitamin_e_mg'] = 0;
    this.sum['sumtocopherol_alpha_mg'] = 0;
    this.sum['sumvitamin_k_mcg'] = 0;
    this.sum['sumcalcium_mg'] = 0;
    this.sum['sumcopper_mg'] = 0;
    this.sum['sumirom_mg'] = 0;
    this.sum['summagnesium_mg'] = 0;
    this.sum['summanganese_mg'] = 0;
    this.sum['sumphosphorous_mg'] = 0;
    this.sum['sumpotassium_mg'] = 0;
    this.sum['sumselenium_mcg'] = 0;
    this.sum['sumzink_mg'] = 0;
    this.sum['sumprotein_g'] = 0;
    this.sum['sumalanine_g'] = 0;
    this.sum['sumarginine_g'] = 0;
    this.sum['sumaspartic_acid_g'] = 0;
    this.sum['sumcystine_g'] = 0;
    this.sum['sumglutamic_acid_g'] = 0;
    this.sum['sumglycine_g'] = 0;
    this.sum['sumhistidine_g'] = 0;
    this.sum['sumhydroxyproline_g'] = 0;
    this.sum['sumisoleucine_g'] = 0;
    this.sum['sumleucine_g'] = 0;
    this.sum['sumlysine_g'] = 0;
    this.sum['summethionine_g'] = 0;
    this.sum['sumphenylalanine_g'] = 0;
    this.sum['sumproline_g'] = 0;
    this.sum['sumserine_g'] = 0;
    this.sum['sumthreonine_g'] = 0;
    this.sum['sumtryptophan_g'] = 0;
    this.sum['sumtyrosine_g'] = 0;
    this.sum['sumvaline_g'] = 0;
    this.sum['sumcarbohydrate_g'] = 0;
    this.sum['sumfiber_g'] = 0;
    this.sum['sumsugars_g'] = 0;
    this.sum['sumfructose_g'] = 0;
    this.sum['sumgalactose_g'] = 0;
    this.sum['sumglucose_g'] = 0;
    this.sum['sumlactose_g'] = 0;
    this.sum['summaltose_g'] = 0;
    this.sum['sumsucrose_g'] = 0;
    this.sum['sumfat_g'] = 0;
    this.sum['sumsaturated_fatty_acids_g'] = 0;
    this.sum['summonounsaturated_fatty_acids_g'] = 0;
    this.sum['sumpolyunsaturated_fatty_acids_g'] = 0;
    this.sum['sumfatty_acids_total_trans_g'] = 0;
    this.sum['sumalcohol_g'] = 0;
    this.sum['sumash_g'] = 0;
    this.sum['sumcaffeine_mg'] = 0;
    this.sum['sumtheobromine_mg'] = 0;
    this.sum['sumwater_g'] = 0;
  }
}
