import { ParentTask } from './parent-task';
import { User } from './user';
import { Project } from './project';

export class Task {

  taskId: number;
  task: string;
  startDate: Date;
  endDate: Date;
  priority: number;
  user: User;
  status: string;
  project: Project;
  parentTask: ParentTask;
  parentFlag: boolean;


  constructor() { }

  set setTask(task: string) {
    this.task = task;
  }

  set setTaskId(taskId: number) {
    this.taskId = taskId;
  }

  set setPriority(priority: number) {
    this.priority = priority;
  }

  set setStartDate(startDate: Date) {
    this.startDate = startDate;
  }

  set setEndDate(endDate: Date) {
    this.endDate = endDate;
  }

  set setStatus(status: string) {
    this.status = status;
  }

  set setUser(user: User) {
    this.user = user;
  }

  set setProject(project: Project) {
    this.project = project;
  }

  set setParentTask(parentTask: ParentTask) {
    this.parentTask = parentTask;
  }

  get getTask(): string {
    return this.task;
  }

  get getProject(): Project {
    return this.project;
  }

  get getTaskId(): number {
    return this.taskId;
  }

  get getPriority(): number {
    return this.priority;
  }

  get getStartDate(): Date {
    return this.startDate;
  }

  get getEndDate(): Date {
    return this.endDate;
  }

  get getUser(): User {
    return this.user;
  }

  get getParentTask(): ParentTask {
    return this.parentTask;
  }

  get getStatus(): string {
    return this.status;
  }

}
