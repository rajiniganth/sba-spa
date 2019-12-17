import { Injectable } from '@angular/core';
import { User } from '../model/user';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  _url = "http://localhost:9080/sba-rest/user";

  constructor(private httpClient: HttpClient) { }

  saveUser(user: User) {

    return this.httpClient.post<User>(this._url, user);
  }

  getUsers(filterOption: string) {

    return this.httpClient.get<User[]>(this._url, {
      params: {
        option: filterOption,
      }});
  }

  deleteUser(userId: number) {
    return this.httpClient.delete(this._url  + '/' + userId);
  }

}
