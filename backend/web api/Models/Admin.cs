// namespace web_api.Models


namespace SkillWaveAPI.Models
{
    public class Admin
    {
        public int AdminID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Phone { get; set; }
        public DateTime? CreatedAt { get; set; }

    }
}
