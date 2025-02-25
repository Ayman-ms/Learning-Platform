// export interface Student {
//   id: string;           // معرف الطالب
//   firstName: string;    // الاسم الأول
//   lastName: string;     // الاسم الأخير
//   email: string;        // البريد الإلكتروني
//   password: string;     // كلمة المرور
//   phone?: string;       // رقم الهاتف (اختياري
//   PhotoBase64?: string;
//   createdAt?: Date;     // تاريخ الإنشاء
// }
export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  createdAt: string;
  profileImage?: string; // يمكن أن يكون اختياريًا
}
