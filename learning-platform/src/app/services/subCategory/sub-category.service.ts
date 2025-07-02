import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SubCategory } from 'src/app/models/subCategory';

@Injectable({
  providedIn: 'root'
})
export class SubCategoryService {
private apiUrl = 'http://localhost:5270/api/SubCategory';

  constructor(private http: HttpClient) {}
  
  public getSubCategories(): Promise<SubCategory[]> {
    return this.http.get<SubCategory[]>(this.apiUrl).toPromise()
      .then(response => response ?? []) 
      .catch(() => []); 
  }
  

  updateCategory(id: string, description: string): Promise<SubCategory> {
    const body = { id, description };
    return this.http.put<SubCategory>(`${this.apiUrl}/${id}`, body)
      .toPromise()
      .then(response => response ?? { id, description }) 
      .catch(error => {
        throw error;
      });
  }
  

  deleteCategory(id: string): Promise<boolean> {
    return this.http.delete(`${this.apiUrl}/${id}`).toPromise().then(() => true).catch(() => false);
  }

  addSubCategory(category: SubCategory): Promise<SubCategory> {
    return this.http.post<SubCategory>(`${this.apiUrl}`, category)
      .toPromise()
      .then(response => response ?? category)
      .catch(error => {
        throw error;
      });
  }
  
}