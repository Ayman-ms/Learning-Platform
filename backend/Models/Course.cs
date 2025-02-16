namespace SkillwaveAPI.Models
{
    public class Course
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
        public string Teacher { get; set; }
        public string Time { get; set; }
        public string PhotoBase64 { get; set; } // خاصية الصورة بصيغة Base64
    }
}
