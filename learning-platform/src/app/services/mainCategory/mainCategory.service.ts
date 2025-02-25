import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MainCategory } from 'src/app/models/mainCategory';
import { SubCategory } from 'src/app/models/subCategory';

@Injectable({
  providedIn: 'root',
})
export class MainCategoryService {
  private apiUrl = 'http://localhost:5270/api/MainCategory'; // رابط الـ API الخاص بالتصنيفات

  constructor(private http: HttpClient) {}

  public getMainCategories(): Promise<MainCategory[]> {
    return this.http.get<MainCategory[]>(this.apiUrl).toPromise()
      .then(response => response || []); // إعادة صفيف فارغ بدلاً من undefined
  }

  getSubCategories(): Observable<SubCategory[]> {
    return this.http.get<SubCategory[]>(`${this.apiUrl}/sub`);
  }

  addMainCategory(category: MainCategory): Observable<MainCategory> {
    return this.http.post<MainCategory>(`${this.apiUrl}/main`, category);
  }

  addSubCategory(category: SubCategory): Observable<SubCategory> {
    return this.http.post<SubCategory>(`${this.apiUrl}/sub`, category);
  }
}
