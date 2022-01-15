import { Component, OnInit } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  firstName: '';
  lastName: '';
  confirmationPassword: '';

  credentials: TokenPayload = {
    name:'',
    email: '',
    password: '',
    role: ''
  };

  constructor(private auth: AuthenticationService, private router: Router) { }

  ngOnInit(): void {
  }

  register() {
    if (this.credentials.password === this.confirmationPassword) {
      this.credentials.name = this.firstName + ' ' + this.lastName;
      this.auth.register(this.credentials).subscribe(() => {
        this.router.navigateByUrl('/profile');
      }, (err) => {
        console.error(err);
      });
    } else {
      console.log('Password and Confirmation password do not match');
    }

  }

}
