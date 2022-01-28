import { Component, OnInit } from '@angular/core';
import { TokenPayload, AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  credentials: TokenPayload = {
    email: '',
    password: '',
    role: ''
  };

  constructor( private auth: AuthenticationService, private router: Router, private toastr: ToastrService ) {}


  login() {
    this.auth.login(this.credentials).subscribe(() => {
      this.router.navigateByUrl('/my-diet');
	  this.toastr.success('You successfully signed-in!', 'Welcome ' + this.auth.getUserDetails().name);
    }, (err) => {
      this.toastr.error('Check email and password fields!', 'Error');
    });
  }

  ngOnInit(): void {
  }

}
