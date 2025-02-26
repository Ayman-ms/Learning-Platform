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
      .then(response => response ?? []) // ✅ إذا كانت الاستجابة `undefined`، أعد مصفوفة فارغة
      .catch(() => []); // ✅ في حالة حدوث خطأ، أعد مصفوفة فارغة
  }
  

  updateCategory(id: string, description: string): Promise<SubCategory> {
    const body = { id, description }; // ✅ تأكد أن البيانات مكتملة
    return this.http.put<SubCategory>(`${this.apiUrl}/${id}`, body)
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

  addSubCategory(category: SubCategory): Promise<SubCategory> {
    return this.http.post<SubCategory>(`${this.apiUrl}`, category)
      .toPromise()
      .then(response => response ?? category) // ✅ إعادة البيانات المرسلة إذا لم يكن هناك رد
      .catch(error => {
        console.error("❌ Error adding category:", error);
        throw error;
      });
  }
  
  
}
