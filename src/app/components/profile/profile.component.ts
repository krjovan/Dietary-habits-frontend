import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { ToastrService } from 'ngx-toastr';

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
  isLoaded: Boolean = false;

  constructor(private auth: AuthenticationService, private toastr: ToastrService) {}

  ngOnInit() {
    this.getUserDetails();
  }

  getUserDetails() {
    this.isLoaded = false;
    this.auth.profile().subscribe(user => {
      this.details = user;
      this.isLoaded = true;
    }, (err) => {
      console.error(err);
    });
  }

  save() {
    if(this.newPassword !== this.confirmationPassword) {
      this.toastr.error('New password and Confirmation password do not match!', 'Error');
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
                this.toastr.success('Changes saved successfully!', 'Success');
              }, (err) => {
                this.toastr.error('Could not update your profile!', 'Error');
              });
              this.getUserDetails();
              this.currentPassword = '';
              this.newPassword = '';
              this.confirmationPassword = '';
            },
            error: error => {
              this.toastr.error('Could not update your profile!', 'Error');
            }
          });
        } else {
          this.toastr.error('Current password is not correct!', 'Error');
        }
      },
      error: error => {
        console.log(error);
      }
    });
  }

}
