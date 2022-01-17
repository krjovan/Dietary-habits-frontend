import { Component, OnInit } from '@angular/core';
import { TokenPayload, AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';

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

  constructor( private auth: AuthenticationService, private router: Router ) {}


  login() {
    this.auth.login(this.credentials).subscribe(() => {
      this.router.navigateByUrl('/profile');
    }, (err) => {
      console.error(err);
    });
  }

  ngOnInit(): void {
  }

}
