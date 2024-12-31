import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MainCategory } from 'src/app/models/mainCategory';
import { SubCategory } from 'src/app/models/subCategory';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private apiUrl = 'https://api.skillwave.com/categories'; // رابط الـ API الخاص بالتصنيفات

  constructor(private http: HttpClient) {}

  // جلب التصنيفات الرئيسية
  getMainCategories(): Observable<MainCategory[]> {
    return this.http.get<MainCategory[]>(`${this.apiUrl}/main`);
  }

  // جلب التصنيفات الفرعية
  getSubCategories(): Observable<SubCategory[]> {
    return this.http.get<SubCategory[]>(`${this.apiUrl}/sub`);
  }

  // إضافة تصنيف رئيسي
  addMainCategory(category: MainCategory): Observable<MainCategory> {
    return this.http.post<MainCategory>(`${this.apiUrl}/main`, category);
  }

  // إضافة تصنيف فرعي
  addSubCategory(category: SubCategory): Observable<SubCategory> {
    return this.http.post<SubCategory>(`${this.apiUrl}/sub`, category);
  }
}
