
using Microsoft.AspNetCore.Mvc;
using SkillwaveAPI.Services;
using SkillwaveAPI.Models;
using BCrypt.Net;
using System.IO;
using System;
using System.Text.Json;
using System.Net.Mail;
using System.Net;
namespace SkillwaveAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class PasswordController
    {

        string relativePath = @"..\students.json";

        [HttpGet(Name = "SendPasswordForget")]
        public bool SendPasswordForget(string email)
        {
            string absolutePath = Path.GetFullPath(relativePath);
            try
            {
                MailAddress from = new MailAddress("admin@skillwave.de", "Skill Wave Admin");
                List<Student> studentslist = new List<Student>();
                Student? student = null;
                if (File.Exists("students.json"))
                {
                    studentslist = JsonSerializer.Deserialize<List<Student>>(File.ReadAllText(absolutePath));
                }
#pragma warning disable CS8602 // Dereference of a possibly null reference.
                if (studentslist.Count > 0)
                {
                    student = studentslist.FirstOrDefault((x) => x.Email == email);

                }
#pragma warning restore CS8602 // Dereference of a possibly null reference.

                if (student == null)
                {
                    return false;
                }

                MailAddress to = new MailAddress(student.Email, student.FirstName + " " + student.LastName);
                MailMessage message = new MailMessage(from, to);
                message.IsBodyHtml = true;
                message.Subject = "Password forgot";
                message.Body = File.ReadAllText(@"E:\Angular\blogsystem\backend\web api\email.html").Replace("{{userID}}", student.Id.ToString());


                SmtpClient client = new SmtpClient("smtp.strato.de", 25);
                client.UseDefaultCredentials = false;
                client.Credentials = new NetworkCredential("admin@skillwave.de", "SkillWaveAdmin");
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
            string absolutePath = Path.GetFullPath(relativePath);
            if (password != passwordConf)
            {
                return false;
            }

            List<Student> studentlist = new List<Student>();
            Student? student = null;
            if (File.Exists("Students.json"))
            {
                studentlist = JsonSerializer.Deserialize<List<Student>>(File.ReadAllText(absolutePath));
            }
            if (studentlist.Count > 0)
            {
                student = studentlist.FirstOrDefault((x) => x.Email == email);

            }

            if (student == null)
            {
                return false;
            }

            student.Password = BCrypt.Net.BCrypt.HashPassword(password);
            File.WriteAllText(absolutePath, JsonSerializer.Serialize(studentlist));
            return true;
        }
    }
}