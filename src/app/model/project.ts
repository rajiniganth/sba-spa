import { User } from './user';
import { Task } from './task';

export class Project {

  projectId: number;
  project: string;
  startDate: Date;
  endDate: Date;
  priority: number;
  user: User;
  tasks: Task[];
  status: string;


  constructor() { }

  set setProject(project: string) {
    this.project = project;
  }

  set setProjectId(projectId: number) {
    this.projectId = projectId;
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

  set setUser(user: User) {
    this.user = user;
  }

  set setTasks(tasks: Task[]) {
    this.tasks = tasks;
  }

  set setStatus(status: string) {
    this.status = status;
  }

  addTask(task: Task) {
    if (this.tasks == null) {
      this.tasks = new Array<Task>();
    }
    this.tasks.push(task);

  }

  get getProject(): string {
    return this.project;
  }

  get getProjectId(): number {
    return this.projectId;
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

  get getTasks(): Task[] {
    return this.tasks;
  }

  get getStatus(): string {
    return this.status;
  }

}
