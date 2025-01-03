using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkillWaveAPI.Models;
using System.Security.Cryptography;
using System.Text;

namespace SkillWaveAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminsController : ControllerBase
    {
        private readonly SkillWaveDbContext _context;

        public AdminsController(SkillWaveDbContext context)
        {
            _context = context;
        }

        // GET: api/Admins
        [HttpGet]
        public async Task<IActionResult> GetAllAdmins()
        {
            var admins = await _context.Admins.ToListAsync();
            return Ok(admins);
        }

        // GET: api/Admins/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAdminById(int id)
        {
            var admin = await _context.Admins.FindAsync(id);
            if (admin == null)
                return NotFound($"Admin with ID {id} not found.");

            return Ok(admin);
        }

        // POST: api/Admins
        [HttpPost]
        public async Task<IActionResult> CreateAdmin([FromBody] Admin admin)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid data.");

            // Hash the password
            admin.Password = HashPassword(admin.Password);

            // Set CreatedAt if not provided
            admin.CreatedAt ??= DateTime.UtcNow;

            _context.Admins.Add(admin);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAdminById), new { id = admin.AdminID }, admin);
        }

        // PUT: api/Admins/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAdmin(int id, [FromBody] Admin updatedAdmin)
        {
            var admin = await _context.Admins.FindAsync(id);
            if (admin == null)
                return NotFound($"Admin with ID {id} not found.");

            // Update fields
            admin.FirstName = updatedAdmin.FirstName;
            admin.LastName = updatedAdmin.LastName;
            admin.Email = updatedAdmin.Email;
            admin.Phone = updatedAdmin.Phone;

            // Update password if provided
            if (!string.IsNullOrEmpty(updatedAdmin.Password))
            {
                admin.Password = HashPassword(updatedAdmin.Password);
            }

            _context.Admins.Update(admin);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Admins/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAdmin(int id)
        {
            var admin = await _context.Admins.FindAsync(id);
            if (admin == null)
                return NotFound($"Admin with ID {id} not found.");

            _context.Admins.Remove(admin);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Function to hash passwords
        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();
        }
    }
}
