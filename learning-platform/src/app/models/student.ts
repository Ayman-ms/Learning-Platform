export interface Student {
  id: string;           // معرف الطالب
  firstName: string;    // الاسم الأول
  lastName: string;     // الاسم الأخير
  email: string;        // البريد الإلكتروني
  password: string;     // كلمة المرور
  phone?: string;       // رقم الهاتف (اختياري)
  level?: string;       // مستوى الطالب (اختياري)
  PhotoBase64?: string;
  createdAt?: Date;     // تاريخ الإنشاء
}
