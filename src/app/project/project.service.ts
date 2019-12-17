import { Project } from './../model/project';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  _url = "http://localhost:9080/sba-rest/project";

  constructor(private httpClient: HttpClient) {}

  saveProject(project: Project) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.httpClient.post<Project>(this._url, project, { headers: headers });
  }

  getProjects() {

    return this.httpClient.get<Project[]>(this._url);
  }

  deleteProject(projectId: number) {
    return this.httpClient.delete(this._url  + '/' + projectId);
  }

}
