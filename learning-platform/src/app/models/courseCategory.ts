export interface CourseCategory {
    courseID: number;        // معرف الكورس
    mainCategoryID?: number; // التصنيف الرئيسي (اختياري)
    subCategoryID?: number;  // التصنيف الفرعي (اختياري)
  }
  