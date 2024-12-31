export interface Student {
    id: number;           // معرف الطالب
    firstName: string;    // الاسم الأول
    lastName: string;     // الاسم الأخير
    email: string;        // البريد الإلكتروني
    password: string;     // كلمة المرور
    phone?: string;       // رقم الهاتف (اختياري)
    level?: string;       // مستوى الطالب (اختياري)
    avatar?: string;      // الصورة الشخصية
    createdAt?: Date;     // تاريخ الإنشاء
  }
  