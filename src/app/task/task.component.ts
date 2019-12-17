import { TaskService } from './task.service';
import { Component, Input, OnInit } from '@angular/core';
import { User } from './../model/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Project } from './../model/project';
import { DatePipe } from '@angular/common';
import { Options } from 'ng5-slider';
import { UserService } from '../user/user.service';
import { ProjectService } from '../project/project.service';
import { DateValidator, toDate, toDateFrString } from '../util/date-util';
import { Task } from '../model/task';
import { ParentTask } from '../model/parent-task';
import { Status } from '../constant/status';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  taskForm: FormGroup;

  task: Task;

  projects: Project[];

  projectList: Project[];

  project: Project;

  user: User;

  users: User[];

  userList: User[];

  parentTasks: ParentTask[];

  parentTskList: ParentTask[];

  parentTask: ParentTask;

  @Input()
  updateFlag: boolean;

  @Input()
  searchText: string;

  @Input()
  prjSearchFlag: boolean = false;

  @Input()
  parentSearchFlag: boolean = false;

  @Input()
  userSearchFlag: boolean = false;

  @Input()
  parentSelect: boolean = false;

  get taskName() {
    return this.taskForm.get('task');
  }

  get startDate() {
    return this.taskForm.get('startDate');
  }

  get endDate() {
    return this.taskForm.get('endDate');
  }

  options: Options = {
    floor: 0,
    ceil: 30,
    step: 0
  };

  constructor(private fb: FormBuilder,
    private datePipe: DatePipe,
    private projectService: ProjectService,
    private userService: UserService,
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router) {

    this.createForm();
  }

  createForm() {

    this.taskForm = this.fb.group({

      project: [],
      task: ['', Validators.required],
      parentFlag: [],
      startDate: [{ value: null, disabled: this.parentSelect }],
      endDate: [{ value: null, disabled: this.parentSelect }],
      priority: [0],
      projectName: [],
      projectId: [],
      parentTask: [{ value: null, disabled: this.parentSelect }],
      parentId: [],
      userName: [],
      userId: [],
      status: [],
      dateFlag: [{ value: true }]
    }, { validators: DateValidator });
  }

  update(task: Task) {

    var startDate = toDateFrString(task.startDate);
    var endDate = toDateFrString(task.endDate);
    var dateFlag = false;
    if (startDate && endDate) {
      dateFlag = true;
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
    this.taskForm.patchValue({
      task: task.task,
      priority: task.priority,
      projectName: task.project.project,
      projectId: task.project.projectId,
      status: task.status,
      userName: task.user.firstName,
      userId: task.user.userId,
      dateFlag: dateFlag,
      parentFlag: (task.parentTask != null ? false : true)
    });
    this.task = task;
    this.user = task.user;
    this.project = task.project;
    this.parentTask = task.parentTask;
    if (this.parentTask != null) {
      this.parentSelect = true;
      this.taskForm.get('projectName').disable();
      this.taskForm.get('userName').disable();
      this.taskForm.get('parentFlag').disable();
      this.taskForm.get('parentTask').setValue(this.parentTask.parentTask);
      this.taskForm.get('parentTask').disable();
      this.taskForm.get('parentId').setValue(this.parentTask.parentId);
    }

  }

  onSubmit() {

    const { task, dateFlag, startDate, endDate, priority, userId, projectId, parentId, parentFlag } = this.taskForm.value;

    var tsk: Task = new Task();
    if (!this.updateFlag) {
      tsk = new Task();
      tsk.task = task;
      tsk.setProject = this.project;
      tsk.setUser = this.user;
      tsk.parentFlag = parentFlag;
    } else {
      tsk = this.task;
    }

    if (!parentFlag) {
      tsk.priority = priority;
      tsk.startDate = toDate(startDate);
      tsk.endDate = toDate(endDate);
      if (!this.updateFlag) {
        tsk.setStatus = Status.NEW;
        tsk.setParentTask = this.parentTask;
      }
    }

    this.taskService.saveTask(tsk).subscribe(
      response => {
        console.log('Success:', response);
        if (this.updateFlag) {
          this.navigateToView();
        } else {
          this.user = null;
          this.project = null;
          this.parentTask = null;
          this.parentSelect = false;
          this.createForm();
        }
      },
      error => console.error('Error:', error)
    );
    this.enableDefaults();

  }

  navigateToView() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        projectId: this.project.projectId
      }
    };
    this.router.navigate(['view-task'], navigationExtras);
  }

  ngOnInit() {
    let taskId: number;
    let task: Task;
    this.route.queryParams.subscribe(params => {
      taskId = params["taskId"];
    });
    if (taskId) {
      this.updateFlag = true;

      this.taskService.getTaskByTaskId(taskId).subscribe(
        response => {
          task = response;
          if (task != null) {
            this.update(task);
          }
        },
        error => console.error('Error:', error)
      );
    }
    this.projectService.getProjects()
      .subscribe(
        response => this.projectList = response,
        error => console.error('Error:', error)
      );
    this.refreshUserList();
  }

  refreshUserList() {

    this.userService.getUsers('TASK')
      .subscribe(
        response => this.userList = response,
        error => console.error('Error', error)
      );
  }

  updateEndDate(event: any) {

    var date = new Date(event['year'], event['month'] - 1, event['day']);
    date.setDate(date.getDate() + 1);
    this.taskForm.get('endDate').setValue({
      year: parseInt(this.datePipe.transform(date, 'yyyy'), 10),
      month: parseInt(this.datePipe.transform(date, 'MM'), 10),
      day: parseInt(this.datePipe.transform(date, 'dd'), 10)
    });
  }

  projectSearch(field: any) {

    this.prjSearchFlag = true;
    this.projects = this.projectList.filter((item) => {
      return item['project'].toLowerCase().includes(field.value.toLowerCase());
    });
  }

  parentSearch(field: any) {

    this.parentSearchFlag = true;
    this.parentTasks = this.parentTskList.filter((item) => {
      return item['parentTask'].toLowerCase().includes(field.value.toLowerCase());
    });
  }

  userSearch(field: any) {
    this.userSearchFlag = true;
    this.users = this.userList.filter((item) => {
      return item['firstName'].toLowerCase().includes(field.value.toLowerCase());
    });
  }

  showPrjSearch() {
    return this.prjSearchFlag;
  }

  showParentsSearch() {
    return this.parentSearchFlag;
  }

  showUserSearch() {
    return this.userSearchFlag;
  }

  selectUser(event) {
    let userId = event.target.value;
    this.user = this.users.find(x => x.userId === parseInt(userId), 10);
    this.userSearchFlag = false;
    this.taskForm.get('userName').setValue(this.user.firstName);
    this.taskForm.get('userName').disable();
  }

  selectProject(event) {
    let projectId = event.target.value;
    this.project = this.projects.find(x => x.projectId === parseInt(projectId), 10);
    this.prjSearchFlag = false;
    this.taskForm.get('projectName').setValue(this.project.project);
    this.taskForm.get('projectName').disable();
    this.taskForm.get('projectId').setValue(projectId);
    this.taskService.getParentTaskForProject(projectId)
      .subscribe(
        response => this.parentTskList = response,
        error => console.error('Error:', error)
      );
  }

  selectParent(event) {
    let parentId = event.target.value;
    this.parentTask = this.parentTasks.find(x => x.parentId === parseInt(parentId), 10);
    this.parentSearchFlag = false;
    this.taskForm.get('parentTask').setValue(this.parentTask.parentTask);
    this.taskForm.get('parentTask').disable();
    this.taskForm.get('parentId').setValue(this.parentTask.parentId);
  }

  onParentSelect(event) {

    if (!event.target.checked) {
      this.parentSelect = false;
      this.taskForm.get('dateFlag').setValue(true);
      this.taskForm.get('parentTask').enable();
      this.taskForm.get('endDate').enable();
      this.taskForm.get('startDate').enable();
    } else {
      this.parentSelect = true;
      this.taskForm.get('dateFlag').setValue(false);
      this.taskForm.get('parentTask').disable();
      this.taskForm.get('endDate').disable();
      this.taskForm.get('startDate').disable();
    }
  }

  enableDefaults() {
    this.taskForm.get('userName').enable();
    this.taskForm.get('projectName').enable();
    this.taskForm.get('parentTask').enable();
  }

}
