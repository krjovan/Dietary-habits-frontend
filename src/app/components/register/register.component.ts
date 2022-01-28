import { Component, OnInit } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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

  constructor(private auth: AuthenticationService, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  register() {
    if (this.credentials.password === this.confirmationPassword) {
      this.credentials.name = this.firstName + ' ' + this.lastName;
      this.auth.register(this.credentials).subscribe(() => {
		this.toastr.success('You successfully made an account!', 'Welcome ' + this.auth.getUserDetails().name);
        this.router.navigateByUrl('/my-diet');
      }, (err) => {
        this.toastr.error(err.error.message, 'Error');
      });
    } else {
      this.toastr.error('Password and Confirmation password do not match!', 'Error');
    }

  }

}
