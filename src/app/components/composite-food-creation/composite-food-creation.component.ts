import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SummedUpNutritions } from 'src/app/models/summed-up-nutritions';
import { CompositeFoodService } from 'src/app/services/composite-food.service';
import { NutritionService } from 'src/app/services/nutrition.service';

@Component({
  selector: 'app-composite-food-creation',
  templateUrl: './composite-food-creation.component.html',
  styleUrls: ['./composite-food-creation.component.css']
})
export class CompositeFoodCreationComponent implements OnInit {

  search = '';
  compositeName = '';
  nutritions: any [] = [];
  isLoaded: Boolean = true;
  ingredients: any[] = [];

  constructor(private nutritionService: NutritionService,
    private compositeFoodService: CompositeFoodService,
    private toastr: ToastrService) { }

  getNutritions() {
    this.isLoaded = false;
      this.nutritionService.getNutritions(this.search)
      .subscribe(nutritions => {
        this.nutritions = nutritions;
        this.isLoaded = true;
        this.toastr.success('Found ' + nutritions.length + ' nutrition/s', 'Success');
    });
  }

  addIngredient(nutrition) {
    const qunatity = document.getElementById(nutrition._id.toString()) as HTMLInputElement;
    if(Number(qunatity.value) === 0) {
      this.toastr.error('You must enter a proper value for quantity.', 'Error');
    } else {
      this.ingredients.push({nutrition: nutrition, ingredient_quantity: Number(qunatity.value)});
      this.nutritions = [];
    }
  }

  openAddForm() {
    document.getElementById('id01').style.display = 'block';
  }

  removeIngredient(id) {
    let indexOfIngredientToBeRemoved = this.ingredients.map((element) => element.nutrition._id).indexOf(id);
    this.ingredients.splice(indexOfIngredientToBeRemoved, 1);
  }

  createCompositeFood() {
    document.getElementById("create-btn").innerHTML = "<i class='fa fa-circle-o-notch fa-spin' style='margin-right: 8px;'></i>Creating";
    let calculatedNutritionValues = new SummedUpNutritions();
    let initialValue: number = 0;

    let totalQuantity = this.ingredients.reduce((previousValue, currentValue) => previousValue + currentValue.ingredient_quantity
      , initialValue);

    let ingredientRatios = this.ingredients.map((ingredient) => { 
      return { ingredient_ratio: ingredient.ingredient_quantity / totalQuantity, ingredient_id: ingredient.nutrition._id };
    })

    let nutritionKeys = Object.keys(calculatedNutritionValues);
    for (let i = 0; i < this.ingredients.length; i++) {
      nutritionKeys.forEach(key => {
        calculatedNutritionValues[key] += this.ingredients[i].nutrition[key] * ingredientRatios[i].ingredient_ratio;
      });
    }

    let nutrition = JSON.parse(JSON.stringify(calculatedNutritionValues));
    nutrition.name = this.compositeName;

    let compositeFood = {
      calculatedNutrition: nutrition,
      ingredients: ingredientRatios
    }

    this.compositeFoodService.addCompositeFood(compositeFood)
      .subscribe(() => {
        document.getElementById("create-btn").innerHTML = "<i class='fa fa-plus'></i> Create food";
        this.toastr.success('Created "' + this.compositeName + '" composite food!', 'Success');
      }, (err) => {
        document.getElementById("create-btn").innerHTML = "<i class='fa fa-plus'></i> Create food";
        this.toastr.error(err.message, 'Error');
      });
  }

  ngOnInit(): void {
  }

}
