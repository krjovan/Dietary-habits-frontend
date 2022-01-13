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
    const x = document.getElementById('myTopnav');
    const navSignIn = document.getElementById('navSignIn');
    const userDropdown = document.getElementById('userDropdown');

    if (x.className === 'topnav') {
        x.className += ' responsive';
        if (navSignIn !== null) {
          navSignIn.className = '';
        }
        if (userDropdown !== null) {
          userDropdown.className = 'dropdown';
        }
    } else {
        x.className = 'topnav';
        if (navSignIn !== null) {
          navSignIn.className = 'w3-right';
        }
        if (userDropdown !== null) {
          userDropdown.className = 'dropdown w3-right';
        }
    }
  }

  toTop() {
    document.body.scrollIntoView({behavior: 'smooth', block: 'start'});
  }
}
