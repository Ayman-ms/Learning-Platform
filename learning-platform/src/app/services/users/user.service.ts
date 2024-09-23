import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/models/users';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor( private http:HttpClient) { }

  public createUser (user:User){
    return this.http.post<User>('https://localhost:44355/User', user).toPromise();
  }
  public updateUser (user:User){
    return this.http.put<User>('https://localhost:44355/User',user).toPromise();
  }
  public deleteUser (id:number){
    return this.http.delete<number>('https://localhost:44355/User',{params : {id:id}} ).toPromise();
  }
  public getUsers (user:User){
    return this.http.get<Array<User>>('https://localhost:44355/User').toPromise();
  }

}
