import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from './user.service';
import { User } from '../model/user';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  userForm: FormGroup;

  users: User[];

  @Input()
  updateFlag: boolean;

  @Input()
  searchText: string;

  @Input()
  sortField: string;

  get firstName() {
    return this.userForm.get('firstName');
  }

  get lastName() {
    return this.userForm.get('lastName');
  }

  get employeeId() {
    return this.userForm.get('employeeId');
  }

  constructor(private fb: FormBuilder, private userService: UserService) {

    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      employeeId: ['', Validators.required],
      userId: ['']
    });
    this.updateFlag = false;

  }

  ngOnInit() {

    this.userService.getUsers('ALL')
      .subscribe(
        response => this.users = response,
        error => console.error('Error', error)
      );
  }

  filter(val: string): User[] {
    return this.users.filter(user => {
      return user.getFirstName.toLowerCase().match('^.*' + val.toLocaleLowerCase() + '.*$');
    });

    this.sortField = null;
  }

  onSubmit() {
    const { firstName, lastName, employeeId, userId } = this.userForm.value;
    var user = new User();
    if (this.updateFlag) {
      user.setUserId = userId;
    }
    user.setFirstName = firstName;
    user.setLastName = lastName;
    user.setEmployeeId = employeeId;
    this.userForm.reset();
    this.userService.saveUser(user).subscribe(
      response => {
        console.log('Success', response);
        if (this.updateFlag) {
          this.users = this.users.filter(item => item['userId'] !== userId);
        }
        this.users.push(response);
        this.updateFlag = false;
      },
      error => console.error('Error', error)
    );
  }

  update(user: User) {


    this.userForm.setValue({
      firstName: user['firstName'],
      lastName: user['lastName'],
      employeeId: user['employeeId'],
      userId: user['userId']
    });
    this.updateFlag = true;

  }

  delete(user: User) {
    this.userService.deleteUser(user['userId']).subscribe(
      response => {
        this.users = this.users.filter(item => item['userId'] !== user['userId']);
        console.log('Success deleted user:' + user['userId']);
      },
      error => console.error('Error', error)
    );
  }

  sort(fieldName: string) {
    this.sortField = fieldName;
  }

}
