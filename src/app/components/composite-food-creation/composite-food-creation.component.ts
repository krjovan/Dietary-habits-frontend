import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NutritionService } from 'src/app/services/nutrition.service';

@Component({
  selector: 'app-composite-food-creation',
  templateUrl: './composite-food-creation.component.html',
  styleUrls: ['./composite-food-creation.component.css']
})
export class CompositeFoodCreationComponent implements OnInit {

  search = '';
  nutritions: any [] = [];
  isLoaded: Boolean = true;

  constructor(private nutritionService: NutritionService,
    private toastr: ToastrService) { }

  getNutritions() {
    this.isLoaded = false;
      this.nutritionService.getNutritionNamesAndIds(this.search)
      .subscribe(nutritions => {
        this.nutritions = nutritions;
        this.isLoaded = true;
        this.toastr.success('Found ' + nutritions.length + ' nutrition/s', 'Success');
    });
  }

  addIngredient(id) {
    const x = document.getElementById(id.toString()) as HTMLInputElement;
    if(Number(x.value) === 0) {
      this.toastr.error('You must enter a proper value for quantity.', 'Error');
    } else {
      console.log(id, Number(x.value));
    }
  }

  openAddForm() {
    document.getElementById('id01').style.display = 'block';
  }

  ngOnInit(): void {
  }

}
