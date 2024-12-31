public class CourseCategory
{
    public int CourseID { get; set; }
    public int MainCategoryID { get; set; }
    public int SubCategoryID { get; set; }


    public Course Course { get; set; }
    public MainCategory MainCategory { get; set; }
    public SubCategory SubCategory { get; set; }
}