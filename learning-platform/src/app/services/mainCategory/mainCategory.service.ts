import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MainCategory } from 'src/app/models/mainCategory';

@Injectable({
  providedIn: 'root',
})
export class MainCategoryService {
  private apiUrl = 'http://localhost:5270/api/MainCategory';

  constructor(private http: HttpClient) {}

  public getMainCategories(): Promise<MainCategory[]> {
    return this.http.get<MainCategory[]>(this.apiUrl).toPromise()
      .then(response => response ?? []) 
      .catch(() => []);
        }

  updateCategory(id: string, description: string): Promise<MainCategory> {
    const body = { id, description };
    return this.http.put<MainCategory>(`${this.apiUrl}/${id}`, body)
      .toPromise()
      .then(response => response ?? { id, description }) 
      .catch(error => {
        throw error;
      });
  }
  

  deleteCategory(id: string): Promise<boolean> {
    return this.http.delete(`${this.apiUrl}/${id}`).toPromise().then(() => true).catch(() => false);
  }

  addMainCategory(category: MainCategory): Promise<MainCategory> {
    return this.http.post<MainCategory>(`${this.apiUrl}`, category)
      .toPromise()
      .then(response => response ?? category) 
      .catch(error => {
        throw error;
      });
  } 
  
}