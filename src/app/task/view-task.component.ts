import { TaskService } from './task.service';
import { Component, Input, OnInit } from '@angular/core';
import { User } from './../model/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Project } from './../model/project';
import { ProjectService } from '../project/project.service';
import { Task } from '../model/task';
import { Status } from '../constant/status';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-view-task',
  templateUrl: './view-task.component.html',
  styleUrls: ['./view-task.component.css']
})
export class ViewTaskComponent implements OnInit {

  viewTaskForm: FormGroup;

  projects: Project[];

  projectList: Project[];

  project: Project;

  tasks: Task[];

  @Input()
  sortField: string;

  @Input()
  prjSearchFlag: boolean = false;

  constructor(private fb: FormBuilder,
    private projectService: ProjectService,
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router) {

    this.viewTaskForm = this.fb.group({
      projectName: [],
      projectId: []
    });
  }

  ngOnInit() {
    let projectId: any;
    this.route.queryParams.subscribe(params => {
      projectId = params["projectId"];
    });
    this.projectService.getProjects()
      .subscribe(
        response => {
          this.projectList = response;
          if (projectId) {
            this.projects = this.projectList;
            this.setFormValues(projectId);
          }
        },
        error => console.error('Error:', error)
      );


  }

  showPrjSearch() {
    return this.prjSearchFlag;
  }

  selectProject(event) {
    let projectId = event.target.value;
    this.setFormValues(projectId);
  }

  setFormValues(projectId: any) {
    this.project = this.projects.find(x => x.projectId === parseInt(projectId, 10));
    this.prjSearchFlag = false;
    this.viewTaskForm.get('projectName').setValue(this.project.project);
    this.viewTaskForm.get('projectId').setValue(projectId);
    this.tasks = this.project.tasks;
  }

  sort(fieldName: string) {
    this.sortField = fieldName;
  }

  projectSearch(field: any) {

    this.prjSearchFlag = true;
    this.projects = this.projectList.filter((item) => {
      return item['project'].toLowerCase().includes(field.value.toLowerCase());
    });
  }

  update(task: Task) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        taskId: task.taskId
      }
    };
    this.router.navigate(['task'], navigationExtras);
  }

  complete(task: Task) {
    task.status = Status.COMPLETED;
    var prj = this.project;
    prj.tasks = null;
    task.project = prj;
    this.taskService.saveTask(task).subscribe(
      response => {
        console.log('Success:', response);
      },
      error => console.error('Error:', error)
    );
  }
}
