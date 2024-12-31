export interface Admin {
    id: number;           // معرف المدير
    firstName: string;    // الاسم الأول
    lastName: string;     // الاسم الأخير
    email: string;        // البريد الإلكتروني
    password: string;     // كلمة المرور
    phone?: string;       // رقم الهاتف (اختياري)
    createdAt?: Date;     // تاريخ الإنشاء
  }
  