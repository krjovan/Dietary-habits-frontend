import { Component, OnInit } from '@angular/core';
import { UserNutritionService } from '../../services/user-nutrition.service';
import { AuthenticationService } from '../../services/authentication.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-my-diet',
  templateUrl: './my-diet.component.html',
  styleUrls: ['./my-diet.component.css']
})
export class MyDietComponent implements OnInit {

  dateOfConsumption = new Date();
  nutritions: any [] = [];

  constructor(
	private userNutritionService :UserNutritionService,
	private auth :AuthenticationService,
	private toastr: ToastrService
  ) { }
  
  onDateChange(date){
	  var body = {
		  id: this.auth.getUserDetails()._id,
		  date_of_consumption: date
	  }
	  this.userNutritionService.getUserNutritions(body)
      .subscribe(nutritions => {
        this.nutritions = nutritions;
        this.toastr.success('Found ' + nutritions.length + ' nutrition/s', 'Success');
	  });
  }
  
  updateUserNutrition(nutrition) {
	  console.log(nutrition);
  }
  
  deleteUserNutrition(nutrition) {
	  console.log(nutrition);
  }

  ngOnInit(): void {
	  this.onDateChange(this.dateOfConsumption.toISOString().split('T')[0]);
  }

}
