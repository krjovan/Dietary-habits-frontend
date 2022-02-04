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
  isLoaded: Boolean = false;

  constructor(private driService: DriService,
			  private toastr: ToastrService) { }

  ngOnInit(): void {
	  this.driService.getUserActiveDris()
      .subscribe(dris => {
		    Object.assign(this.dri, dris[0]);
		    this.isLoaded = true;
	    });
	  console.log(this.dri);
  }

  save() {
    this.isLoaded = false;
    this.driService.updateDri(this.dri)
      .subscribe(data => {
        this.toastr.success('You successfully updated your DRI!', 'Success');
        this.ngOnInit();
      }, (err) => {
        this.toastr.error(err.error.message, 'Error');
      });
  }
}
