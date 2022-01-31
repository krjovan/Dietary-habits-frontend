import { Component, OnInit } from '@angular/core';
import { UserNutritionService } from '../../services/user-nutrition.service';
import { DriService } from '../../services/dri.service';
import { AuthenticationService } from '../../services/authentication.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-my-diet',
  templateUrl: './my-diet.component.html',
  styleUrls: ['./my-diet.component.css']
})
export class MyDietComponent implements OnInit {

  dri: any = <any>{};
  isLoaded: Boolean = false;
  dateOfConsumption = new Date();
  nutritions: any [] = [];
  sumquantity = 0;
  sumcalories = 0;
  sumtotal_fat_g = 0;
  sumsaturated_fat_g = 0;
  sumcholesterol_mg = 0;
  sumsodium_mg = 0;
  sumcholine_mg = 0;
  sumfolate_mcg = 0;
  sumfolic_acid_mcg = 0;
  sumniacin_mg = 0;
  sumpantothenic_acid_mg = 0;
  sumriboflavin_mg = 0;
  sumthiamin_mg = 0;
  sumvitamin_a_IU = 0;
  sumvitamin_a_rae_mcg = 0;
  sumcarotene_alpha_mcg = 0;
  sumcarotene_beta_mcg = 0;
  sumcryptoxanthin_beta_mcg = 0;
  sumlutein_zeaxanthin_mcg = 0;
  sumvitamin_b12_mcg = 0;
  sumvitamin_b6_mg = 0;
  sumvitamin_c_mg = 0;
  sumvitamin_d_IU = 0;
  sumvitamin_e_mg = 0;
  sumtocopherol_alpha_mg = 0;
  sumvitamin_k_mcg = 0;
  sumcalcium_mg = 0;
  sumcopper_mg = 0;
  sumirom_mg = 0;
  summagnesium_mg = 0;
  summanganese_mg = 0;
  sumphosphorous_mg = 0;
  sumpotassium_mg = 0;
  sumselenium_mcg = 0;
  sumzink_mg = 0;
  sumprotein_g = 0;
  sumalanine_g = 0;
  sumarginine_g = 0;
  sumaspartic_acid_g = 0;
  sumcystine_g = 0;
  sumglutamic_acid_g = 0;
  sumglycine_g = 0;
  sumhistidine_g = 0;
  sumhydroxyproline_g = 0;
  sumisoleucine_g = 0;
  sumleucine_g = 0;
  sumlysine_g = 0;
  summethionine_g = 0;
  sumphenylalanine_g = 0;
  sumproline_g = 0;
  sumserine_g = 0;
  sumthreonine_g = 0;
  sumtryptophan_g = 0;
  sumtyrosine_g = 0;
  sumvaline_g = 0;
  sumcarbohydrate_g = 0;
  sumfiber_g = 0;
  sumsugars_g = 0;
  sumfructose_g = 0;
  sumgalactose_g = 0;
  sumglucose_g = 0;
  sumlactose_g = 0;
  summaltose_g = 0;
  sumsucrose_g = 0;
  sumfat_g = 0;
  sumsaturated_fatty_acids_g = 0;
  summonounsaturated_fatty_acids_g = 0;
  sumpolyunsaturated_fatty_acids_g = 0;
  sumfatty_acids_total_trans_g = 0;
  sumalcohol_g = 0;
  sumash_g = 0;
  sumcaffeine_mg = 0;
  sumtheobromine_mg = 0;
  sumwater_g = 0;

  constructor(
	private userNutritionService :UserNutritionService,
	private auth :AuthenticationService,
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
        this.nutritions = nutritions;
		    this.calculateSum(nutritions);
		    this.isLoaded = true;
        this.toastr.success('Found ' + nutritions.length + ' nutrition/s', 'Success');
	  });
  }

  calculateSum(nutritions) {
    this.setAllToZero();

	  for (let i = 0; i < nutritions.length; i++) {
		  this.sumquantity += nutritions[i].quantity;
      this.sumcalories += nutritions[i].nutrition.calories * nutritions[i].quantity / 100;
      this.sumtotal_fat_g += nutritions[i].nutrition.total_fat_g * nutritions[i].quantity /100;
      this.sumsaturated_fat_g += nutritions[i].nutrition.saturated_fat_g * nutritions[i].quantity /100;
      this.sumcholesterol_mg += nutritions[i].nutrition.cholesterol_mg * nutritions[i].quantity /100;
      this.sumsodium_mg += nutritions[i].nutrition.sodium_mg * nutritions[i].quantity /100;
      this.sumcholine_mg += nutritions[i].nutrition.choline_mg * nutritions[i].quantity /100;
      this.sumfolate_mcg += nutritions[i].nutrition.folate_mcg * nutritions[i].quantity /100;
      this.sumfolic_acid_mcg += nutritions[i].nutrition.folic_acid_mcg * nutritions[i].quantity /100;
      this.sumniacin_mg += nutritions[i].nutrition.niacin_mg * nutritions[i].quantity /100;
      this.sumpantothenic_acid_mg += nutritions[i].nutrition.pantothenic_acid_mg * nutritions[i].quantity /100;
      this.sumriboflavin_mg += nutritions[i].nutrition.riboflavin_mg * nutritions[i].quantity /100;
      this.sumthiamin_mg += nutritions[i].nutrition.thiamin_mg * nutritions[i].quantity /100;
      this.sumvitamin_a_IU += nutritions[i].nutrition.vitamin_a_IU * nutritions[i].quantity /100;
      this.sumvitamin_a_rae_mcg += nutritions[i].nutrition.vitamin_a_rae_mcg * nutritions[i].quantity /100;
      this.sumcarotene_alpha_mcg += nutritions[i].nutrition.carotene_alpha_mcg * nutritions[i].quantity /100;
      this.sumcarotene_beta_mcg += nutritions[i].nutrition.carotene_beta_mcg * nutritions[i].quantity /100;
      this.sumcryptoxanthin_beta_mcg += nutritions[i].nutrition.cryptoxanthin_beta_mcg * nutritions[i].quantity /100;
      this.sumlutein_zeaxanthin_mcg += nutritions[i].nutrition.lutein_zeaxanthin_mcg * nutritions[i].quantity /100;
      this.sumvitamin_b12_mcg += nutritions[i].nutrition.vitamin_b12_mcg * nutritions[i].quantity /100;
      this.sumvitamin_b6_mg += nutritions[i].nutrition.vitamin_b6_mg * nutritions[i].quantity /100;
      this.sumvitamin_c_mg += nutritions[i].nutrition.vitamin_c_mg * nutritions[i].quantity /100;
      this.sumvitamin_d_IU += nutritions[i].nutrition.vitamin_d_IU * nutritions[i].quantity /100;
      this.sumvitamin_e_mg += nutritions[i].nutrition.vitamin_e_mg * nutritions[i].quantity /100;
      this.sumtocopherol_alpha_mg += nutritions[i].nutrition.tocopherol_alpha_mg * nutritions[i].quantity /100;
      this.sumvitamin_k_mcg += nutritions[i].nutrition.vitamin_k_mcg * nutritions[i].quantity /100;
      this.sumcalcium_mg += nutritions[i].nutrition.calcium_mg * nutritions[i].quantity /100;
      this.sumcopper_mg += nutritions[i].nutrition.copper_mg * nutritions[i].quantity /100;
      this.sumirom_mg += nutritions[i].nutrition.irom_mg * nutritions[i].quantity /100;
      this.summagnesium_mg += nutritions[i].nutrition.magnesium_mg * nutritions[i].quantity /100;
      this.summanganese_mg += nutritions[i].nutrition.manganese_mg * nutritions[i].quantity /100;
      this.sumphosphorous_mg += nutritions[i].nutrition.phosphorous_mg * nutritions[i].quantity /100;
      this.sumpotassium_mg += nutritions[i].nutrition.potassium_mg * nutritions[i].quantity /100;
      this.sumselenium_mcg += nutritions[i].nutrition.selenium_mcg * nutritions[i].quantity /100;
      this.sumzink_mg += nutritions[i].nutrition.zink_mg * nutritions[i].quantity /100;
      this.sumprotein_g += nutritions[i].nutrition.protein_g * nutritions[i].quantity /100;
      this.sumalanine_g += nutritions[i].nutrition.alanine_g * nutritions[i].quantity /100;
      this.sumarginine_g += nutritions[i].nutrition.arginine_g * nutritions[i].quantity /100;
      this.sumaspartic_acid_g += nutritions[i].nutrition.aspartic_acid_g * nutritions[i].quantity /100;
      this.sumcystine_g += nutritions[i].nutrition.cystine_g * nutritions[i].quantity /100;
      this.sumglutamic_acid_g += nutritions[i].nutrition.glutamic_acid_g * nutritions[i].quantity /100;
      this.sumglycine_g += nutritions[i].nutrition.glycine_g * nutritions[i].quantity /100;
      this.sumhistidine_g += nutritions[i].nutrition.histidine_g * nutritions[i].quantity /100;
      this.sumhydroxyproline_g += nutritions[i].nutrition.hydroxyproline_g * nutritions[i].quantity /100;
      this.sumisoleucine_g += nutritions[i].nutrition.isoleucine_g * nutritions[i].quantity /100;
      this.sumleucine_g += nutritions[i].nutrition.leucine_g * nutritions[i].quantity /100;
      this.sumlysine_g += nutritions[i].nutrition.lysine_g * nutritions[i].quantity /100;
      this.summethionine_g += nutritions[i].nutrition.methionine_g * nutritions[i].quantity /100;
      this.sumphenylalanine_g += nutritions[i].nutrition.phenylalanine_g * nutritions[i].quantity /100;
      this.sumproline_g += nutritions[i].nutrition.proline_g * nutritions[i].quantity /100;
      this.sumserine_g += nutritions[i].nutrition.serine_g * nutritions[i].quantity /100;
      this.sumthreonine_g += nutritions[i].nutrition.threonine_g * nutritions[i].quantity /100;
      this.sumtryptophan_g += nutritions[i].nutrition.tryptophan_g * nutritions[i].quantity /100;
      this.sumtyrosine_g += nutritions[i].nutrition.tyrosine_g * nutritions[i].quantity /100;
      this.sumvaline_g += nutritions[i].nutrition.valine_g * nutritions[i].quantity /100;
      this.sumcarbohydrate_g += nutritions[i].nutrition.carbohydrate_g * nutritions[i].quantity /100;
      this.sumfiber_g += nutritions[i].nutrition.fiber_g * nutritions[i].quantity /100;
      this.sumsugars_g += nutritions[i].nutrition.sugars_g * nutritions[i].quantity /100;
      this.sumfructose_g += nutritions[i].nutrition.fructose_g * nutritions[i].quantity /100;
      this.sumgalactose_g += nutritions[i].nutrition.galactose_g * nutritions[i].quantity /100;
      this.sumglucose_g += nutritions[i].nutrition.glucose_g * nutritions[i].quantity /100;
      this.sumlactose_g += nutritions[i].nutrition.lactose_g * nutritions[i].quantity /100;
      this.summaltose_g += nutritions[i].nutrition.maltose_g * nutritions[i].quantity /100;
      this.sumsucrose_g += nutritions[i].nutrition.sucrose_g * nutritions[i].quantity /100;
      this.sumfat_g += nutritions[i].nutrition.fat_g * nutritions[i].quantity /100;
      this.sumsaturated_fatty_acids_g += nutritions[i].nutrition.saturated_fatty_acids_g * nutritions[i].quantity /100;
      this.summonounsaturated_fatty_acids_g += nutritions[i].nutrition.monounsaturated_fatty_acids_g * nutritions[i].quantity /100;
      this.sumpolyunsaturated_fatty_acids_g += nutritions[i].nutrition.polyunsaturated_fatty_acids_g * nutritions[i].quantity /100;
      this.sumfatty_acids_total_trans_g += nutritions[i].nutrition.fatty_acids_total_trans_g * nutritions[i].quantity /100;
      this.sumalcohol_g += nutritions[i].nutrition.alcohol_g * nutritions[i].quantity /100;
      this.sumash_g += nutritions[i].nutrition.ash_g * nutritions[i].quantity /100;
      this.sumcaffeine_mg += nutritions[i].nutrition.caffeine_mg * nutritions[i].quantity /100;
      this.sumtheobromine_mg += nutritions[i].nutrition.theobromine_mg * nutritions[i].quantity /100;
      this.sumwater_g += nutritions[i].nutrition.water_g * nutritions[i].quantity /100;
	  }
  }

  setAllToZero() {
    this.sumquantity = 0;
    this.sumcalories = 0;
    this.sumtotal_fat_g = 0;
    this.sumsaturated_fat_g = 0;
    this.sumcholesterol_mg = 0;
    this.sumsodium_mg = 0;
    this.sumcholine_mg = 0;
    this.sumfolate_mcg = 0;
    this.sumfolic_acid_mcg = 0;
    this.sumniacin_mg = 0;
    this.sumpantothenic_acid_mg = 0;
    this.sumriboflavin_mg = 0;
    this.sumthiamin_mg = 0;
    this.sumvitamin_a_IU = 0;
    this.sumvitamin_a_rae_mcg = 0;
    this.sumcarotene_alpha_mcg = 0;
    this.sumcarotene_beta_mcg = 0;
    this.sumcryptoxanthin_beta_mcg = 0;
    this.sumlutein_zeaxanthin_mcg = 0;
    this.sumvitamin_b12_mcg = 0;
    this.sumvitamin_b6_mg = 0;
    this.sumvitamin_c_mg = 0;
    this.sumvitamin_d_IU = 0;
    this.sumvitamin_e_mg = 0;
    this.sumtocopherol_alpha_mg = 0;
    this.sumvitamin_k_mcg = 0;
    this.sumcalcium_mg = 0;
    this.sumcopper_mg = 0;
    this.sumirom_mg = 0;
    this.summagnesium_mg = 0;
    this.summanganese_mg = 0;
    this.sumphosphorous_mg = 0;
    this.sumpotassium_mg = 0;
    this.sumselenium_mcg = 0;
    this.sumzink_mg = 0;
    this.sumprotein_g = 0;
    this.sumalanine_g = 0;
    this.sumarginine_g = 0;
    this.sumaspartic_acid_g = 0;
    this.sumcystine_g = 0;
    this.sumglutamic_acid_g = 0;
    this.sumglycine_g = 0;
    this.sumhistidine_g = 0;
    this.sumhydroxyproline_g = 0;
    this.sumisoleucine_g = 0;
    this.sumleucine_g = 0;
    this.sumlysine_g = 0;
    this.summethionine_g = 0;
    this.sumphenylalanine_g = 0;
    this.sumproline_g = 0;
    this.sumserine_g = 0;
    this.sumthreonine_g = 0;
    this.sumtryptophan_g = 0;
    this.sumtyrosine_g = 0;
    this.sumvaline_g = 0;
    this.sumcarbohydrate_g = 0;
    this.sumfiber_g = 0;
    this.sumsugars_g = 0;
    this.sumfructose_g = 0;
    this.sumgalactose_g = 0;
    this.sumglucose_g = 0;
    this.sumlactose_g = 0;
    this.summaltose_g = 0;
    this.sumsucrose_g = 0;
    this.sumfat_g = 0;
    this.sumsaturated_fatty_acids_g = 0;
    this.summonounsaturated_fatty_acids_g = 0;
    this.sumpolyunsaturated_fatty_acids_g = 0;
    this.sumfatty_acids_total_trans_g = 0;
    this.sumalcohol_g = 0;
    this.sumash_g = 0;
    this.sumcaffeine_mg = 0;
    this.sumtheobromine_mg = 0;
    this.sumwater_g = 0;
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

  ngOnInit(): void {
	  this.onDateChange(this.dateOfConsumption.toISOString().split('T')[0]);
	  this.driService.getUserActiveDris()
      .subscribe(dris => {
		Object.assign(this.dri, dris[0]);
	  });
	  console.log(this.dri);
  }

}
