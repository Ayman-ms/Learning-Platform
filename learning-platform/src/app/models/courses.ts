export interface Course {
    id: number;              // معرف الكورس
    name: string;            // اسم الكورس
    description?: string;    // وصف الكورس
    status: boolean;         // حالة الكورس (مفعل أو غير مفعل)
    teacherID: number;       // معرف المدرس المسؤول عن الكورس
    time: number;            // مدة الكورس بالساعات
    createdAt?: Date;        // تاريخ الإنشاء
  }
  