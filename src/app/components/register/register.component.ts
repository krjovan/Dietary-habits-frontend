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
  resendVerifEmailCount = 0;

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
      document.getElementById("register-btn").innerHTML = "<i class='fa fa-circle-o-notch fa-spin' style='margin-right: 8px;'></i>Registering";
      this.auth.register(this.credentials).subscribe(res => {
        document.getElementById("register-form").style.display = 'none';
        document.getElementById("resend-verification").style.display = 'block';
      }, (err) => {
        this.toastr.error(err.error.message, 'Error');
      });
    } else {
      this.toastr.error('Password and Confirmation password do not match!', 'Error');
    }

  }

  resend() {
    if (this.resendVerifEmailCount < 5) {
      var req = {
        email: this.credentials.email
      }
      this.auth.resendVerificationEmail(req).subscribe(res => {
        this.resendVerifEmailCount++;
        this.toastr.success('Resent verification email to: ' + this.credentials.email, 'Success');
      }, (err) => {
        this.toastr.error(err.error.message, 'Error');
      });
    } else {
      this.toastr.error('Already sent 5 (five) verification emails. Cannot send more.', 'Error');
    }
  }
}
