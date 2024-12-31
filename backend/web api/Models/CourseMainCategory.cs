using SkillWaveAPI.Models;

namespace web_api.Models
{
    public class CourseMainCategory
    {
        public int CourseID { get; set; }
        public Course Course { get; set; }

        public int MainCategoryID { get; set; }
        public MainCategory MainCategory { get; set; }
    }
}
