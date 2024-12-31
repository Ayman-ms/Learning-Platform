using web_api.Models;

public class Course
{
    public int CourseID { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string Status { get; set; }
    public int? TeacherID { get; set; }
    public Teacher Teacher { get; set; }
    public TimeSpan Time { get; set; }
    public DateTime CreatedAt { get; set; }
    public string ImageBase64 { get; set; }
    public ICollection<CourseCategory> CourseCategories { get; set; }
    public ICollection<StudentCourse> StudentCourses { get; set; }
}
