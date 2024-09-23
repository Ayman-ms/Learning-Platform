
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Net.Mail;
using System.Text.Json;
using web_api.Models;

namespace web_api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PasswordController
    {
        [HttpGet(Name = "SendPasswordForget")]
        public bool SendPasswordForget(string email)
        {

            try
            {
                MailAddress from = new MailAddress("Ayman@thomaskaemmerling.de", "Blogpost Admin");
                List<User> userslist = new List<User>();
                User? user = null;
                if (File.Exists("Users.json"))
                {
                    userslist = JsonSerializer.Deserialize<List<User>>(File.ReadAllText(@"E:\Angular\blogsystem\backend\web api\Users.json"));
                }
#pragma warning disable CS8602 // Dereference of a possibly null reference.
                if (userslist.Count > 0)
                {
                    user = userslist.FirstOrDefault((x) => x.Email == email);

                }
#pragma warning restore CS8602 // Dereference of a possibly null reference.

                if (user == null)
                {
                    return false;
                }

                MailAddress to = new MailAddress(user.Email, user.FirstName);
                MailMessage message = new MailMessage(from, to);
                message.IsBodyHtml = true;
                message.Subject = "Password forgot";
                message.Body = File.ReadAllText(@"E:\Angular\blogsystem\backend\web api\email.html").Replace("{{userID}}", user.Id.ToString());
              

                SmtpClient client = new SmtpClient("smtp.strato.de", 25);
                client.UseDefaultCredentials = false;
                client.Credentials = new NetworkCredential("Ayman@thomaskaemmerling.de", "Metalevel@Ayman");
                client.EnableSsl = true;


                client.Send(message);

                return true;
            }
            catch (Exception ex)
            {
                throw ex;
                return false;
            }

        }
        [HttpPost(Name = "ResetPassword")]

        public bool ResetPassword(string email, string password, string passwordConf)
        {
            if (password!=passwordConf)
            {
                return false;
            }
                        
            List<User> userslist = new List<User>();
            User? user = null;
            if (File.Exists("Users.json"))
            {
                userslist = JsonSerializer.Deserialize<List<User>>(File.ReadAllText(@"E:\Angular\blogsystem\backend\web api\Users.json"));
            }
            if (userslist.Count > 0)
            {
                user = userslist.FirstOrDefault((x) => x.Email == email);

            }

            if (user == null)
            {
                return false;
            }

            user.Password=Utils.sha256_hash(password);


            File.WriteAllText(@"E:\Angular\blogsystem\backend\web api\Users.json", JsonSerializer.Serialize(userslist));



            return true;
        }
    }
}