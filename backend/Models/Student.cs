namespace SkillwaveAPI.Models
{
    public class Student
    {
        public string? Id { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Password { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? PhotoPath { get; set; } // قد يكون اختيارياً
        public string Roll { get; set; }

    }
}
