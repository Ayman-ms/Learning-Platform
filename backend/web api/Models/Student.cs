public class Student
{
    public int StudentID { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public string Phone { get; set; }
    public string Avatar { get; set; }
    public DateTime CreatedAt { get; set; }
    public ICollection<StudentCourses> StudentCourses { get; set; }
    // خصائص جديدة لإعادة تعيين كلمة المرور
    public string ResetToken { get; set; }
    public DateTime? ResetTokenExpires { get; set; }
}
