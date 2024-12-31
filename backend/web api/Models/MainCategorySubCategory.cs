using SkillWaveAPI.Models;

namespace web_api.Models
{
    public class MainCategorySubCategory
    {
        public int MainCategoryID { get; set; }
        public MainCategory MainCategory { get; set; }

        public int SubCategoryID { get; set; }
        public SubCategory SubCategory { get; set; }
    }
}
