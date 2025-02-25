export interface Teacher {
    id: string;           // معرف المدرس
    firstName: string;    // الاسم الأول
    lastName: string;     // الاسم الأخير
    password: string;     // كلمة المرور
    email: string;        // البريد الإلكتروني

    phone?: string;       // رقم الهاتف (اختياري)
    PhotoBase64?: string;      // الصورة الشخصية (رابط الصورة أو بياناتها)
   
  }
  