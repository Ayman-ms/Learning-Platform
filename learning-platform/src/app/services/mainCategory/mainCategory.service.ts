import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MainCategory } from 'src/app/models/mainCategory';

@Injectable({
  providedIn: 'root',
})
export class MainCategoryService {
  private apiUrl = 'http://localhost:5270/api/MainCategory';

  constructor(private http: HttpClient) {}

  // getMainCategories(): Promise<MainCategory[]> {
  //   return this.http.get<MainCategory[]>(this.apiUrl).toPromise();
  // }
  public getMainCategories(): Promise<MainCategory[]> {
    return this.http.get<MainCategory[]>(this.apiUrl).toPromise()
      .then(response => response ?? []) // ✅ إذا كانت الاستجابة `undefined`، أعد مصفوفة فارغة
      .catch(() => []); // ✅ في حالة حدوث خطأ، أعد مصفوفة فارغة
  }
  

  updateCategory(id: string, description: string): Promise<MainCategory> {
    const body = { id, description }; // ✅ تأكد أن البيانات مكتملة
    return this.http.put<MainCategory>(`${this.apiUrl}/${id}`, body)
      .toPromise()
      .then(response => response ?? { id, description }) // ✅ إعادة البيانات المرسلة في حال كان الرد undefined
      .catch(error => {
        console.error("❌ Error updating category:", error);
        throw error; // ✅ تأكد أن الخطأ لا يمر بصمت
      });
  }
  

  deleteCategory(id: string): Promise<boolean> {
    return this.http.delete(`${this.apiUrl}/${id}`).toPromise().then(() => true).catch(() => false);
  }

  addMainCategory(category: MainCategory): Promise<MainCategory> {
    return this.http.post<MainCategory>(`${this.apiUrl}`, category)
      .toPromise()
      .then(response => response ?? category) // ✅ إعادة البيانات المرسلة إذا لم يكن هناك رد
      .catch(error => {
        console.error("❌ Error adding category:", error);
        throw error;
      });
  }
  
  
}
