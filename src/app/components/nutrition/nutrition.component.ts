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

  selectedNutrition: Nutrition = new Nutrition();
  nutritions: Nutrition [] = [];
  nutrition: Nutrition = new Nutrition();
  search = '';
  currentPage = 0;
  currnetLimit = 8;
  numberOfPages = 0;

  constructor(private nutritionService: NutritionService, private toastr: ToastrService) { }

  getNutritions() {
    this.nutrition = new Nutrition();
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
      //this.clearDialog();
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

  selectNutrition(option, nutrition: Nutrition) {
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
    this.nutrition = new Nutrition();
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
