import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { TokenPayload, AuthenticationService } from '../../services/authentication.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  selectedUser: User = {
    email:'',
    name:'',
    hash:'',
    role:'',
    salt:''
  }
  users : User[] = [];
  firstName: '';
  lastName: '';
  confirmationPassword: '';

  credentials: TokenPayload = {
    name:'',
    email: '',
    password: '',
    role: ''
  };

  constructor(private userService: UserService, private toastr: ToastrService) { }

  getUsers(){
    this.userService.getUsers()
      .subscribe( users => {
        this.users = users;
      });
  }
  
  addUser(){
		if (this.credentials.password === this.confirmationPassword) {
		  this.credentials.name = this.firstName + ' ' + this.lastName;
		  this.userService.addUser(this.credentials).subscribe(() => {
			this.toastr.success('You successfully added a user!', 'Success');
			document.getElementById('id01').style.display='none'
			this.clearDialog();
			this.getUsers();
		  }, (err) => {
			this.toastr.error(err.error.message, 'Error');
		  });
		} else {
		  this.toastr.error('Password and Confirmation password do not match!', 'Error');
		}
  }
  
  updateUser(){
    console.log(this.selectedUser);
    this.userService.updateUser(this.selectedUser)
      .subscribe( data=>{
        console.log(data);
        document.getElementById('id02').style.display='none';
        this.toastr.success('You successfully updated this user!', 'Success');
        this.getUsers();
		}, (err) => {
        this.toastr.error(err.error.message, 'Error');
      });
  }
  
  
  deleteUser(){
    this.userService.deleteUser(this.selectedUser._id)
      .subscribe( data=>{
        console.log(data);
		document.getElementById('id03').style.display='none';
        this.toastr.success('You successfully deleted this user!', 'Success');
        if(data.n == 1){
          for(var i=0;i<this.users.length;i++){
            if(this.selectedUser._id == this.users[i]._id){
              this.users.splice(i,1);
			}
			}
		}, (err) => {
			this.toastr.error(err.error.message, 'Error');
		});
  }
  
  selectUser(option, user) {
    if(user != null && option != null) {
      this.selectedUser = user;
      if (option === 2) {
        document.getElementById('id02').style.display='block'
      } else if (option === 3) {
        document.getElementById('id03').style.display='block';
      } else {
        console.log("Something unexpected hapend!");
      }
    }
  }
  
  clearDialog() {
    this.firstName = '';
    this.lastName = '';
    this.confirmationPassword = '';
    this.credentials.email = '';
    this.credentials.name = '';
    this.credentials.password = '';
    this.credentials.role = '';
  }

  ngOnInit() {
    this.getUsers();
  }

}
