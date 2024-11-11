import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {
  private apiUrl = 'https://localhost:44355/api/images';

  constructor(private http: HttpClient) { }

  getImages(): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrl);
  }
}
