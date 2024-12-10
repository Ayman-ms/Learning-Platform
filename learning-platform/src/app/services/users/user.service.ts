import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/models/users';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  api = "https://localhost:44355/api/User"

  constructor(private http: HttpClient) { }

  public createUser(user: FormData): Observable<any> {
    return this.http.post(this.api, user);
  }
  public updateUser(user: User) {
    return this.http.put<User>(this.api, user).toPromise();
  }
  public deleteUser(id: number) {
    return this.http.delete<number>(this.api, { params: { id: id } }).toPromise();
  }
  public getUser(user: User) {
    return this.http.get<Array<User>>(this.api).toPromise();
  }
  // all user
  public getUsers() {
    return this.http.get<User[]>(this.api).toPromise();
  }
}
