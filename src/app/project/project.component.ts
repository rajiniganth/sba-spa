import { User } from './../model/user';
import { ProjectService } from './project.service';
import { Project } from './../model/project';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Options } from 'ng5-slider';
import { UserService } from '../user/user.service';
import { DateValidator, toDate, getDateInNgxFormat, toDateFrString } from '../util/date-util';
import { Task } from '../model/task';
import { Status } from '../constant/status';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

  projectForm: FormGroup;

  projects: Project[];

  users: User[];

  userList: User[];

  manager: User;

  @Input()
  updateFlag: boolean;

  @Input()
  dateSelect: boolean = false;

  @Input()
  searchText: string;

  @Input()
  sortField: string;

  @Input()
  searchFlag: boolean = false;

  options: Options = {
    floor: 0,
    ceil: 30,
    step: 0
  };

  config = {
    displayKey: "firstName",
    search: true,
    height: 'auto',
    placeholder: 'Select Manager',
    customComparator: () => { }
  }

  get project() {
    return this.projectForm.get('project');
  }

  get startDate() {
    return this.projectForm.get('startDate');
  }

  get endDate() {
    return this.projectForm.get('endDate');
  }

  constructor(private fb: FormBuilder,
    private datePipe: DatePipe,
    private projectService: ProjectService,
    private userService: UserService) {

    this.createForm();
  }

  createForm() {
    this.projectForm = this.fb.group({
      project: ['', Validators.required],
      dateFlag: [],
      startDate: [{ value: null, disabled: !this.dateSelect }],
      endDate: [{ value: null, disabled: !this.dateSelect }],
      priority: [0],
      managerId: [],
      managerName: [],
      projectId: [],
      status: []
    }, { validators: DateValidator });
    this.updateFlag = false;
  }

  ngOnInit() {

    this.projectService.getProjects()
      .subscribe(
        response => this.projects = response,
        error => console.error('Error', error)
      );
    this.refreshUserList();
  }

  onSubmit() {

    const { project, dateFlag, startDate, endDate, priority, managerId, projectId, status } = this.projectForm.value;
    var prj = new Project();
    if (this.updateFlag) {
      prj.setProjectId = projectId;
      prj.setStatus = status;
    } else {
      prj.setStatus = Status.NEW;
    }
    prj.setProject = project;
    prj.setPriority = priority;
    prj.setUser = this.manager;
    if (dateFlag) {
      prj.setStartDate = toDate(startDate);
      prj.setEndDate = toDate(endDate);
    }

    this.projectService.saveProject(prj).subscribe(
      response => {
        console.log('Success', response);
        if (this.updateFlag) {
          this.projects = this.projects.filter(
            item => item['projectId'] !== projectId);
        }
        this.projects.push(response);
        this.refreshUserList();
        this.updateFlag = false;
        this.createForm();
      },
      error => console.error('Error', error)
    );
  }

  onDateSelect(event) {

    if (event.target.checked) {
      this.dateSelect = true;
      this.projectForm.get('endDate').enable();
      this.projectForm.get('startDate').enable();
    } else {
      this.dateSelect = false;
      this.projectForm.get('endDate').disable();
      this.projectForm.get('startDate').disable();
    }
  }

  updateEndDate(event: any) {

    if (!this.updateFlag && event) {
      var date = new Date(event['year'], event['month'] - 1, event['day']);
      date.setDate(date.getDate() + 1);
      this.projectForm.get('endDate').setValue({
        year: parseInt(this.datePipe.transform(date, 'yyyy'), 10),
        month: parseInt(this.datePipe.transform(date, 'MM'), 10),
        day: parseInt(this.datePipe.transform(date, 'dd'), 10)
      });
    }
  }

  suspend(project: Project) {

    project.status = Status.SUSPENDED;
    this.projectService.saveProject(project).subscribe(
      response => console.log('Success', response),
      error => console.error('Error', error)
    );
  }

  update(project: Project) {

    var startDate = toDateFrString(project.startDate);
    var endDate = toDateFrString(project.endDate);
    var dateFlag = false;
    if (startDate && endDate) {
      dateFlag = true;
      this.dateSelect = true;
    }
    this.updateFlag = true;
    this.manager = project.user;
    this.projectForm.patchValue({
      project: project.project,
      dateFlag: dateFlag,
      priority: project.priority,
      projectId: project.projectId,
      status: project.status,
      managerName: project.user.firstName,
      managerId: project.user.userId
    });
    if (this.dateSelect) {
      this.startDate.setValue({
        year: parseInt(this.datePipe.transform(startDate, 'yyyy'), 10),
        month: parseInt(this.datePipe.transform(startDate, 'MM'), 10),
        day: parseInt(this.datePipe.transform(startDate, 'dd'), 10)
      });
      this.startDate.enable();
      this.endDate.setValue({
        year: parseInt(this.datePipe.transform(endDate, 'yyyy'), 10),
        month: parseInt(this.datePipe.transform(endDate, 'MM'), 10),
        day: parseInt(this.datePipe.transform(endDate, 'dd'), 10)
      });
      this.endDate.enable();
    }

  }

  getCompletedTasks(tasks: Task[]): number {

    return (tasks && tasks.length > 0) ? tasks.filter(task => task.getStatus === 'COMPLETED').length : 0;
  }

  filter(val: string): Project[] {
    return this.projects.filter(project => {
      return project.getProject.toLowerCase().match('^.*' + val.toLocaleLowerCase() + '.*$');
    });

    this.sortField = null;
  }

  sort(fieldName: string) {
    this.sortField = fieldName;
  }

  refreshUserList() {

    this.userService.getUsers('PROJECT')
      .subscribe(
        response => this.userList = response,
        error => console.error('Error', error)
      );
  }
  userSearch(field: any) {

    this.searchFlag = true;
    this.users = this.userList.filter((item) => {
      return item['firstName'].toLowerCase().includes(field.value.toLowerCase());
    });
  }

  showSearch() {
    return this.searchFlag;
  }

  selectUser(event) {
    let userId = event.target.value;
    this.manager = this.users.find(x => x.userId === parseInt(userId), 10);
    this.searchFlag = false;
    this.projectForm.get('managerName').setValue(this.manager.firstName);
  }

}
