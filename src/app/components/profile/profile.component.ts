import { Component, OnInit } from '@angular/core';
import { UserDetails, AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  details: UserDetails;
  currentPassword: '';
  newPassword: '';
  confirmationPassword:'';

  constructor(private auth: AuthenticationService) {}

  ngOnInit() {
    this.auth.profile().subscribe(user => {
      this.details = user;
    }, (err) => {
      console.error(err);
    });
  }

  save() {
    console.log(this.details);
  }

}
