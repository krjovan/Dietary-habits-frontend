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
  isRecaptchaValid = false;

  credentials: TokenPayload = {
    name:'',
    email: '',
    password: '',
    role: ''
  };

  constructor(private auth: AuthenticationService, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  resolved(recaptchaResponse) {
    var req = {};
    req['response'] = recaptchaResponse;
    this.auth.verifyRecaptcha(req)
      .subscribe(res => {
        if (JSON.parse(res).success) {
          this.isRecaptchaValid = true;
        } else {
          this.isRecaptchaValid = false;
        }
      }, (err) => {
        this.toastr.error(err.error.message, 'Error');
        console.log(err.error.message);
      });

  }

  register() {
    if (!this.isRecaptchaValid) {
      this.toastr.error('Must complete reCAPTCHA!', 'Error');
      return;
    }
    if (this.credentials.password === this.confirmationPassword) {
      this.credentials.name = this.firstName + ' ' + this.lastName;
      this.auth.register(this.credentials).subscribe(res => {
        document.getElementById("register-form").style.display = 'none';
        document.getElementById("resend-verification").style.display = 'block';
        document.getElementById("resend-verification").innerHTML = res.message;
      }, (err) => {
        this.toastr.error(err.error.message, 'Error');
      });
    } else {
      this.toastr.error('Password and Confirmation password do not match!', 'Error');
    }

  }

}
