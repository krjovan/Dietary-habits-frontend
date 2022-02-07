import { Component, OnInit } from '@angular/core';
import { DriService } from '../../services/dri.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-my-dri',
  templateUrl: './my-dri.component.html',
  styleUrls: ['./my-dri.component.css']
})
export class MyDriComponent implements OnInit {

  dri: any = <any>{};
  dris: any [] = [];
  isLoaded: Boolean = false;

  constructor(private driService: DriService,
			  private toastr: ToastrService) { }

  ngOnInit(): void {
	  this.driService.getUserDris()
      .subscribe(dris => {
		    this.dris = dris;
		    this.isLoaded = true;
	    });
  }

  openAddForm() {
    this.dri = JSON.parse(JSON.stringify(this.dris[0]));
    delete this.dri['active'];
    delete this.dri['name'];
    delete this.dri['user_id'];
    delete this.dri['__v'];
    delete this.dri['_id'];
    Object.keys(this.dri).forEach((i) => this.dri[i] = null);
    document.getElementById('id01').style.display = 'block';
  }

  add() {
    if (this.isInputValid()) {
      this.isLoaded = false;
      document.getElementById('id01').style.display = 'none';
      this.driService.addDri(this.dri).subscribe(() => {
        this.toastr.success('You successfully added a DRI!', 'Success');
        this.ngOnInit();
      }, (err) => {
        this.toastr.error(err.error.message, 'Error');
      });
    }
  }

  openUpdateForm(dri) {
    this.dri = dri;
    document.getElementById('id02').style.display = 'block';
  }

  update() {
    if (this.isInputValid()) {
      this.isLoaded = false;
      document.getElementById('id02').style.display = 'none';
      this.driService.updateDri(this.dri)
      .subscribe(data => {
        this.toastr.success('You successfully updated your DRI!', 'Success');
        this.ngOnInit();
      }, (err) => {
        this.toastr.error(err.error.message, 'Error');
      });
    }
  }

  openDeleteForm(dri) {
    this.dri = dri;
    document.getElementById('id03').style.display = 'block';
  }

  delete() {
    this.driService.deleteDri(this.dri._id)
      .subscribe(data => {
        document.getElementById('id03').style.display = 'none';
        this.toastr.success('You successfully deleted this DRI!', 'Success');
        if (data.n == 1) {
          for (var i = 0; i < this.dris.length; i++) {
            if (this.dri._id == this.dris[i]._id) {
              this.dris.splice(i, 1);
            }
          }
        }
      }, (err) => {
        this.toastr.error(err.error.message, 'Error');
      });
  }

  setAsActive(dri) {
    dri.active = true;
    this.isLoaded = false;
    this.driService.setStatusToActive(dri)
      .subscribe(data => {
        this.toastr.success('"' + dri.name + '" set as currently active DRI!', 'Success');
        this.ngOnInit();
      }, (err) => {
        this.toastr.error(err.error.message, 'Error');
      });
  }

  isInputValid(): boolean {
    const ordered = Object.keys(this.dri).sort().reduce(
      (obj, key) => {
        obj[key] = this.dri[key];
        return obj;
      },
      {}
    );
    delete ordered['active'];
    delete ordered['name'];
    delete ordered['user_id'];
    delete ordered['__v'];
    delete ordered['_id'];
    for (let i = 0; i < Object.values(ordered).length; i+=2) {
      if (Object.values(ordered)[i] === null || Object.values(ordered)[i+1] === null) {
        continue;
      } else {
        if (Object.values(ordered)[i] < Object.values(ordered)[i+1]) {
          this.toastr.error('Max value for ' + Object.keys(ordered)[i] + ' must be less than min.', 'Error');
          return false;
        }
      }
    }
    return true;
  }
}
