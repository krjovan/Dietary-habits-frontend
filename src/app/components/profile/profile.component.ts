import { Component, OnInit } from '@angular/core';
import { UserDetails, AuthenticationService } from '../../services/authentication.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  details: any;
  currentPassword = '';
  newPassword = '';
  confirmationPassword = '';

  constructor(private auth: AuthenticationService) {}

  ngOnInit() {
    this.getUserDetails();
  }

  getUserDetails() {
    this.auth.profile().subscribe(user => {
      this.details = user;
    }, (err) => {
      console.error(err);
    });
  }

  save() {
    if(this.newPassword !== this.confirmationPassword) {
      console.log("New password and Confirmation password do not match");
      return;
    }
    var req = {
      currentPassword: this.currentPassword,
      salt: this.details.salt
    };
    this.auth.getHash(req).subscribe({
      next: data => {
        if (this.details.hash === data.hash) {
          this.details.newPassword = this.newPassword;
          this.auth.updateUser(this.details).subscribe({
            next: data => {
              if(this.newPassword !== ''){
                this.details.password = this.newPassword;
              } else {
                this.details.password = this.currentPassword;
              }
              this.auth.login(this.details).subscribe(() => {
                console.log('Changes saved!');
              }, (err) => {
                console.error(err);
              });
              this.getUserDetails();
              this.currentPassword = '';
              this.newPassword = '';
              this.confirmationPassword = '';
            },
            error: error => {
              console.log(error);
            }
          });
        } else {
          console.log('Current password is not correct!');
        }
      },
      error: error => {
        console.log(error);
      }
    });
  }

}
