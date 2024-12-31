using web_api.Models;

public class Category
{
    public int CategoryID { get; set; }
    public string Name { get; set; }
    public ICollection<CourseCategory> CourseCategories { get; set; } // العلاقة مع الكورسات
    public int? ParentCategoryId { get; set; } // مفتاح الأب
    public Category ParentCategory { get; set; } // كيان الأب
    public ICollection<Category> SubCategories { get; set; } // الكيانات الفرعية

}
