import { Component, OnInit } from '@angular/core';
import { DriService } from '../../services/dri.service';
import { ToastrService } from 'ngx-toastr';
import { Dri } from '../../models/dri';

@Component({
  selector: 'app-my-dri',
  templateUrl: './my-dri.component.html',
  styleUrls: ['./my-dri.component.css']
})
export class MyDriComponent implements OnInit {

  dri: Dri = <Dri>{};
  dris: Dri [] = [];
  isLoaded: Boolean = false;

  constructor( private driService: DriService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.isLoaded = false;
	  this.driService.getUserDris()
      .subscribe(dris => {
		    this.dris = dris;
		    this.isLoaded = true;
	    });
  }

  openAddForm() {
    this.dri = new Dri();
    document.getElementById('id01').style.display = 'block';
  }

  add() {
    this.driService.addDri(this.dri).subscribe(() => {
      document.getElementById('id01').style.display = 'none';
      this.toastr.success('You successfully added a DRI!', 'Success');
      this.ngOnInit();
    }, (err) => {
      this.toastr.error(err.error.message, 'Error');
    });
  }

  openUpdateForm(dri) {
    this.dri = dri;
    document.getElementById('id02').style.display = 'block';
  }

  update() {
    this.driService.updateDri(this.dri)
    .subscribe(data => {
      document.getElementById('id02').style.display = 'none';
      this.toastr.success('You successfully updated your DRI!', 'Success');
      this.ngOnInit();
    }, (err) => {
      this.toastr.error(err.error.message, 'Error');
      this.ngOnInit();
    });
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
}
