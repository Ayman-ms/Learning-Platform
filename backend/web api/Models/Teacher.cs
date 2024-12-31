public class Teacher
{
    public int ID { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public string Phone { get; set; }
    public string Avatar { get; set; }
    public int? CourseID { get; set; }
    public Course Course { get; set; }
}
