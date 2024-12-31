public class SubCategory
{
    public int SubCategoryID { get; set; }
    public string Name { get; set; }
    public int MainCategoryID { get; set; }
    public MainCategory MainCategory { get; set; }
    public ICollection<CourseCategory> CourseCategories { get; set; }
}