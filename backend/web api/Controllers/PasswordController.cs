using Microsoft.AspNetCore.Mvc;
//using web_api.Data;
using web_api.Models;
using System;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace web_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PasswordController : ControllerBase
    {
        private readonly SkillWaveDbContext _context;

        public PasswordController(SkillWaveDbContext context)
        {
            _context = context;
        }

        [HttpPost("ForgotPassword")]
        public IActionResult ForgotPassword([FromBody] string email)
        {
            var student = _context.Students.FirstOrDefault(s => s.Email == email);
            if (student == null)
            {
                return NotFound("Student not found.");
            }

            // Generate Reset Token
            student.ResetToken = GenerateResetToken();
            student.ResetTokenExpires = DateTime.UtcNow.AddHours(1); // Token valid for 1 hour

            // Save changes
            _context.SaveChanges();

            // Normally, you would send the token via email to the user
            // Example: EmailService.SendPasswordResetEmail(student.Email, student.ResetToken);

            return Ok("Password reset token generated and sent.");
        }

        [HttpPost("ResetPassword")]
        public IActionResult ResetPassword(string token, string newPassword)
        {
            var student = _context.Students.FirstOrDefault(s => s.ResetToken == token && s.ResetTokenExpires > DateTime.UtcNow);
            if (student == null)
            {
                return BadRequest("Invalid or expired token.");
            }

            // Reset the password
            student.Password = HashPassword(newPassword); // Assuming you hash the password
            student.ResetToken = null; // Clear the token
            student.ResetTokenExpires = null; // Clear the token expiry

            // Save changes
            _context.SaveChanges();

            return Ok("Password has been reset successfully.");
        }

        // Helper method to generate a secure reset token
        private string GenerateResetToken()
        {
            using (var rng = new RNGCryptoServiceProvider())
            {
                byte[] tokenData = new byte[32];
                rng.GetBytes(tokenData);
                return Convert.ToBase64String(tokenData);
            }
        }

        // Helper method to hash passwords
        private string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                byte[] bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                StringBuilder builder = new StringBuilder();
                foreach (var b in bytes)
                {
                    builder.Append(b.ToString("x2"));
                }
                return builder.ToString();
            }
        }
    }
}
