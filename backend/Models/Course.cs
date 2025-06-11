public class Course
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public bool Status { get; set; }
    public string Teacher { get; set; }
    public string MainCategory { get; set; }
    public List<string> SubCategories { get; set; }
    public string PhotoPath { get; set; }
    public string StartDate { get; set; }
    public int Rating { get; set; } = 0;
    public string Duration { get; set; }
}