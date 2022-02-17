import { Component } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Dietary habits';

  constructor(public auth: AuthenticationService) {}

  myFunction() {
    var navigation = document.getElementById("myTopnav");
    if (navigation.className === "topnav") {
      navigation.className += " responsive";
    } else {
      navigation.className = "topnav";
    }
  }

  collapse() {
    var navigation = document.getElementById("myTopnav");
    navigation.className = "topnav";
  }

  toTop() {
    document.body.scrollIntoView({behavior: 'smooth', block: 'start'});
  }
}
