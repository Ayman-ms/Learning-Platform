export interface Teacher {
    id: number;           // معرف المدرس
    firstName: string;    // الاسم الأول
    lastName: string;     // الاسم الأخير
    email: string;        // البريد الإلكتروني
    password: string;     // كلمة المرور
    phone?: string;       // رقم الهاتف (اختياري)
    avatar?: string;      // الصورة الشخصية (رابط الصورة أو بياناتها)
    createdAt?: Date;     // تاريخ الإنشاء
  }
  