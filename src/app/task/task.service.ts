import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Task } from '../model/task';
import { ParentTask } from '../model/parent-task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  _url = "http://localhost:9080/sba-rest/task";
  _pUrl = "http://localhost:9080/sba-rest/parent-task";

  constructor(private httpClient: HttpClient) {}

  getParentTaskForProject(projectId: number) {

    return this.httpClient.get<ParentTask[]>(this._pUrl + '/' + projectId);
  }

  saveTask(task: Task) {

    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.httpClient.post<Task>(this._url, task, {headers: headers});
  }

  getTaskByTaskId(taskId: number) {

    return this.httpClient.get<Task>(this._url + '/' + taskId);
  }
}
