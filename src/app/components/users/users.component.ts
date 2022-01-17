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

  selectedUser: User;
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
  
  /*
  editUser(form){
    let newUser:User = {
      _id:this.selectedUser._id,
      name:form.value.name,
      email:form.value.email,
      role:form.value.role,
      hash:this.selectedUser.hash,
      salt:this.selectedUser.salt
    }
    this.dataService.updateUser(newUser)
      .subscribe( result => {
        this.getUsers();
      });
      this.toggleForm = !this.toggleForm;
  }
  deleteUser(id){
    this.dataService.deleteUser(id)
      .subscribe( data=>{
        console.log(data);
        if(data.n == 1){
          for(var i=0;i<this.userList.length;i++){
            if(id == this.userList[i]._id){
              this.userList.splice(i,1);
            }
          }
        }
      })
  }
  showEditForm(user){
    this.selectedUser=user;
    this.toggleForm = !this.toggleForm;
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }*/
  
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
