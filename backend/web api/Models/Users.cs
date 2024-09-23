namespace web_api.Models
{
    public class User
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public string Password { get; set; }
        public string Email { get; set; }
        public int Phone { get; set; }
    }
}