import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/@core/services/common.service';
import { EmployeeService } from 'src/app/@core/services/employee.service';
import { UserService } from 'src/app/@core/services/user.service';
import { Response } from 'src/app/shared/modals/response';

@Component({
    selector: 'app-personal-details',
    imports: [CommonModule],
    templateUrl: './personal-details.component.html',
    styleUrl: './personal-details.component.css'
})
export class PersonalDetailsComponent implements OnInit {

  constructor(
    private _userService: UserService,
    private _employeeService: EmployeeService,
    private _commonService: CommonService
  ) { }

  ngOnInit(): void {
    this.loadUserDetails();
  }

  userDetails: any = null;
  userEmployeeDetails: any = null;

  loadUserDetails() {
    this._userService.getUserDetailsByUserId().subscribe(
      (res: Response) => {
        console.log(res);
        if (res.Status.toLowerCase().includes('success') && res.noofREcords) {
          this.userDetails = res.dataSet.Table[0];
          this.loadUserEmployeeDetailsByUserId(this.userDetails.UserId);
        }
      }, (err: Error) => {
        console.error(err);
      }
    )
  }

  loadUserEmployeeDetailsByUserId(userId: number) {
    if (userId) {
      this._employeeService.getEmployeeDetailsByUserId(userId).subscribe(
        (res: Response) => {
          console.log(res);
          if (res.Status.toLowerCase().includes('success') && res.noofREcords) {
            this.userEmployeeDetails = null;
            this.userEmployeeDetails = res.dataSet.Table[0];
            if (this.userEmployeeDetails.JsonObject) {
              this.userEmployeeDetails.JsonObject = JSON.parse(this.userEmployeeDetails.JsonObject);
              if(this.userEmployeeDetails.JsonObject['Gender'] && this.userEmployeeDetails.JsonObject['Gender'] != undefined){
                this.loadDefaultProfilePhotoByGender(this.userEmployeeDetails.JsonObject['Gender'])
              } else {
                this.loadDefaultProfilePhotoByGender('');
              }
            }
          }
        }, (err: Error) => {
          console.error(err);
        }
      )
    }
  }

  loadUserAge(_dob: string) {
    return this._commonService.calculateAgeByUserDOB(_dob);
  }

  defaultProfilePhotoPathUrl: string = '';
  loadDefaultProfilePhotoByGender(_gender: string) {
    switch (_gender.toLowerCase()) {
      case 'male':
        this.defaultProfilePhotoPathUrl = 'assets/images/avatar-male.gif'
        break;
      case 'female':
        this.defaultProfilePhotoPathUrl = 'assets/images/avatar-female.gif'
        break;
      default:
        this.defaultProfilePhotoPathUrl = 'assets/images/profile-photo.png'
        break;
    }
  }

}
