import { Component, OnInit } from '@angular/core';
import { Nutrition } from '../../models/nutrition';
import { ToastrService } from 'ngx-toastr';
import { NutritionService } from '../../services/nutrition.service';

@Component({
  selector: 'app-nutrition',
  templateUrl: './nutrition.component.html',
  styleUrls: ['./nutrition.component.css']
})
export class NutritionComponent implements OnInit {

  selectedNutrition: Nutrition = {
    name: "",
    calories: 0,
    total_fat_g: 0,
    saturated_fat_g: 0,
    cholesterol_mg: 0,
    sodium_mg: 0,
    choline_mg: 0,
    folate_mcg: 0,
    folic_acid_mcg: 0,
    niacin_mg: 0,
    pantothenic_acid_mg: 0,
    riboflavin_mg: 0,
    thiamin_mg: 0,
    vitamin_a_IU: 0,
    vitamin_a_rae_mcg: 0,
    carotene_alpha_mcg: 0,
    carotene_beta_mcg: 0,
    cryptoxanthin_beta_mcg: 0,
    lutein_zeaxanthin_mcg: 0,
    vitamin_b12_mcg: 0,
    vitamin_b6_mg: 0,
    vitamin_c_mg: 0,
    vitamin_d_IU: 0,
    vitamin_e_mg: 0,
    tocopherol_alpha_mg: 0,
    vitamin_k_mcg: 0,
    calcium_mg: 0,
    copper_mg: 0,
    irom_mg: 0,
    magnesium_mg: 0,
    manganese_mg: 0,
    phosphorous_mg: 0,
    potassium_mg: 0,
    selenium_mcg: 0,
    zink_mg: 0,
    protein_g: 0,
    alanine_g: 0,
    arginine_g: 0,
    aspartic_acid_g: 0,
    cystine_g: 0,
    glutamic_acid_g: 0,
    glycine_g: 0,
    histidine_g: 0,
    hydroxyproline_g: 0,
    isoleucine_g: 0,
    leucine_g: 0,
    lysine_g: 0,
    methionine_g: 0,
    phenylalanine_g: 0,
    proline_g: 0,
    serine_g: 0,
    threonine_g: 0,
    tryptophan_g: 0,
    tyrosine_g: 0,
    valine_g: 0,
    carbohydrate_g: 0,
    fiber_g: 0,
    sugars_g: 0,
    fructose_g: 0,
    galactose_g: 0,
    glucose_g: 0,
    lactose_g: 0,
    maltose_g: 0,
    sucrose_g: 0,
    fat_g: 0,
    saturated_fatty_acids_g: 0,
    monounsaturated_fatty_acids_g: 0,
    polyunsaturated_fatty_acids_g: 0,
    fatty_acids_total_trans_g: 0,
    alcohol_g: 0,
    ash_g: 0,
    caffeine_mg: 0,
    theobromine_mg: 0,
    water_g: 0
  }
  nutritions: Nutrition [] = [];
  nutrition: Nutrition = {
    name: "",
    calories: 0,
    total_fat_g: 0,
    saturated_fat_g: 0,
    cholesterol_mg: 0,
    sodium_mg: 0,
    choline_mg: 0,
    folate_mcg: 0,
    folic_acid_mcg: 0,
    niacin_mg: 0,
    pantothenic_acid_mg: 0,
    riboflavin_mg: 0,
    thiamin_mg: 0,
    vitamin_a_IU: 0,
    vitamin_a_rae_mcg: 0,
    carotene_alpha_mcg: 0,
    carotene_beta_mcg: 0,
    cryptoxanthin_beta_mcg: 0,
    lutein_zeaxanthin_mcg: 0,
    vitamin_b12_mcg: 0,
    vitamin_b6_mg: 0,
    vitamin_c_mg: 0,
    vitamin_d_IU: 0,
    vitamin_e_mg: 0,
    tocopherol_alpha_mg: 0,
    vitamin_k_mcg: 0,
    calcium_mg: 0,
    copper_mg: 0,
    irom_mg: 0,
    magnesium_mg: 0,
    manganese_mg: 0,
    phosphorous_mg: 0,
    potassium_mg: 0,
    selenium_mcg: 0,
    zink_mg: 0,
    protein_g: 0,
    alanine_g: 0,
    arginine_g: 0,
    aspartic_acid_g: 0,
    cystine_g: 0,
    glutamic_acid_g: 0,
    glycine_g: 0,
    histidine_g: 0,
    hydroxyproline_g: 0,
    isoleucine_g: 0,
    leucine_g: 0,
    lysine_g: 0,
    methionine_g: 0,
    phenylalanine_g: 0,
    proline_g: 0,
    serine_g: 0,
    threonine_g: 0,
    tryptophan_g: 0,
    tyrosine_g: 0,
    valine_g: 0,
    carbohydrate_g: 0,
    fiber_g: 0,
    sugars_g: 0,
    fructose_g: 0,
    galactose_g: 0,
    glucose_g: 0,
    lactose_g: 0,
    maltose_g: 0,
    sucrose_g: 0,
    fat_g: 0,
    saturated_fatty_acids_g: 0,
    monounsaturated_fatty_acids_g: 0,
    polyunsaturated_fatty_acids_g: 0,
    fatty_acids_total_trans_g: 0,
    alcohol_g: 0,
    ash_g: 0,
    caffeine_mg: 0,
    theobromine_mg: 0,
    water_g: 0
  };
  search = '';
  currentPage = 0;
  currnetLimit = 8;
  numberOfPages = 0;

  constructor(private nutritionService: NutritionService, private toastr: ToastrService) { }

  getNutritions() {
    if (this.search === '') {
      this.nutritionService.getNutritionsWithPagination(this.currentPage, this.currnetLimit)
      .subscribe(nutritions => {
        this.nutritions = nutritions;
      });
    this.nutritionService.getNutritionsCount()
      .subscribe(res => {
        this.numberOfPages = Math.ceil(res.numberOfNutritions / this.currnetLimit);
      });
    } else {
      this.nutritionService.getNutritions(this.search)
      .subscribe(nutritions => {
        this.nutritions = nutritions;
        this.toastr.success('Found ' + nutritions.length + ' nutrition/s', 'Success');
      });
    }

  }

  addNutrition() {
    this.nutritionService.addNutrition(this.nutrition).subscribe(() => {
      this.toastr.success('You successfully added a nutrition!', 'Success');
      document.getElementById('id01').style.display = 'none'
      this.clearDialog();
      this.getNutritions();
    }, (err) => {
      this.toastr.error(err.error.message, 'Error');
    });
  }

  updateNutrition() {
    this.nutritionService.updateNutrition(this.selectedNutrition)
      .subscribe(data => {
        document.getElementById('id02').style.display = 'none';
        this.toastr.success('You successfully updated this nutrition!', 'Success');
        this.getNutritions();
      }, (err) => {
        this.toastr.error(err.error.message, 'Error');
      });
  }

  deleteNutrition() {
    this.nutritionService.deleteNutrition(this.selectedNutrition._id)
      .subscribe(data => {
        document.getElementById('id03').style.display = 'none';
        this.toastr.success('You successfully deleted this nutrition!', 'Success');
        if (data.n == 1) {
          for (var i = 0; i < this.nutritions.length; i++) {
            if (this.selectedNutrition._id == this.nutritions[i]._id) {
              this.nutritions.splice(i, 1);
            }
          }
        }
      }, (err) => {
        this.toastr.error(err.error.message, 'Error');
      });
  }

  selectNutrition(option, nutrition) {
    if (nutrition != null && option != null) {
      this.selectedNutrition = nutrition;
      if (option === 2) {
        document.getElementById('id02').style.display = 'block'
      } else if (option === 3) {
        document.getElementById('id03').style.display = 'block';
      } else {
        console.log("Something unexpected hapend!");
      }
    }
  }

  clearDialog() {
    this.nutrition.name = '';
    this.nutrition.calories = 0;
  }

  nextPage() {
    if (this.currentPage >= this.numberOfPages - 1) {
      this.toastr.error('No next page!', 'Error');
      return;
    }
    ++this.currentPage;
    this.getNutritions();
  }

  previousPage() {
    if (this.currentPage <= 0) {
      this.toastr.error('No previous page!', 'Error');
      return;
    }
    --this.currentPage;
    this.getNutritions();
  }

  jumpToPage(event) {
    if (event.target.value >= 1 && event.target.value <= this.numberOfPages) {
      this.currentPage = event.target.value - 1;
      this.getNutritions();
    } else {
      this.toastr.error('This page does not exist!', 'Error');
    }
  }

  onLimitChange(value) {
    this.currentPage = 0;
    this.getNutritions();
  }

  ngOnInit(): void {
    this.getNutritions();
  }

}
