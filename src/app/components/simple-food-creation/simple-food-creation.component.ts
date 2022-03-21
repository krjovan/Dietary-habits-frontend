import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Nutrition } from 'src/app/models/nutrition';
import { NutritionService } from 'src/app/services/nutrition.service';

@Component({
  selector: 'app-simple-food-creation',
  templateUrl: './simple-food-creation.component.html',
  styleUrls: ['./simple-food-creation.component.css']
})
export class SimpleFoodCreationComponent implements OnInit {

  nutrition: Nutrition = new Nutrition();

  constructor(private nutritionService: NutritionService, private toastr: ToastrService) { }

  addNutrition() {
    this.nutritionService.addNutrition(this.nutrition).subscribe(() => {
      this.toastr.success('You successfully added a nutrition!', 'Success');
    }, (err) => {
      this.toastr.error(err.error.message, 'Error');
    });
  }

  ngOnInit(): void {
    this.nutrition = new Nutrition();
  }

}
