namespace SkillwaveAPI.Models
{
public class Course
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string Status { get; set; }
    public string Teacher { get; set; }
    public string MainCategory { get; set; }
    public List<string> SubCategories { get; set; }
    public string PhotoPath { get; set; }
}
}
