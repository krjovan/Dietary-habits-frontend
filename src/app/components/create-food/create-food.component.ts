import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-food',
  templateUrl: './create-food.component.html',
  styleUrls: ['./create-food.component.css']
})
export class CreateFoodComponent implements OnInit {

  constructor() { }

  openTab(name) {
    var i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++)
      tabcontent[i].style.display = "none";
    
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++)
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    
    document.getElementById(name).style.display = "block";
    document.getElementById(name + "Btn").className += " active";
  }

  ngOnInit(): void {
    
  }
}
