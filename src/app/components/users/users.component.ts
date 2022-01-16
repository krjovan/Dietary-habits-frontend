import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  selectedUser:User;
  users : User[] = [];

  constructor(private userService: UserService) { }

  getUsers(){
    this.userService.getUsers()
      .subscribe( users => {
        this.users = users;
      })
  }
/*
  addUser(){
  }
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

  ngOnInit() {
    this.getUsers();
  }

}
