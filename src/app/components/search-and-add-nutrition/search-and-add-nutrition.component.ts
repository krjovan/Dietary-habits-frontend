import { Component, OnInit } from '@angular/core';
import { NutritionService } from '../../services/nutrition.service';
import { AuthenticationService } from '../../services/authentication.service';
import { UserNutritionService } from '../../services/user-nutrition.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-search-and-add-nutrition',
  templateUrl: './search-and-add-nutrition.component.html',
  styleUrls: ['./search-and-add-nutrition.component.css']
})
export class SearchAndAddNutritionComponent implements OnInit {

  search = '';
  nutritions: any [] = [];
  isLoaded: Boolean = true;
  dateOfConsumption = new Date();

  constructor(private nutritionService: NutritionService,
			  private auth: AuthenticationService,
			  private userNutritionService: UserNutritionService,
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

  addNutrition(id: number) {
    const x = document.getElementById(id.toString()) as HTMLInputElement;
    if(Number(x.value) === 0) {
      this.toastr.error('You must enter a proper value for quantity.', 'Error');
    } else {
      var d = new Date(this.dateOfConsumption);
      d.setHours(12,0,0,0);
      var nutrition = {
        quantity: Number(x.value),
        date_of_consumption: d.toISOString(),
        user_id: this.auth.getUserDetails()._id,
        nutrition_id: id
      };
      this.userNutritionService.addNutrition(nutrition).subscribe(() => {
        this.nutritions = [];
        this.toastr.success('You successfully added the food!', 'Success');
        window.scrollTo(0, 0);
      }, (err) => {
        this.toastr.error(err.error.message, 'Error');
      });
    }
  }

  onDateChange(date){
	  this.dateOfConsumption = date;
  }


  ngOnInit(): void {
  }

}
