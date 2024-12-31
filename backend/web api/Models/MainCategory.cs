public class MainCategory
{
    public int MainCategoryID { get; set; }
    public string Name { get; set; }
    public ICollection<SubCategory> SubCategories { get; set; }
    public ICollection<CourseCategory> CourseCategories { get; set; }
}