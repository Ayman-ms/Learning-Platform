using Microsoft.AspNetCore.Mvc;
using SkillwaveAPI.Services;
using SkillwaveAPI.Models;
using BCrypt.Net;
using System.IO;

namespace SkillwaveAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly JsonFileService<Admin> _jsonFileService;

        public AdminController(JsonFileService<Admin> jsonFileService)
        {
            _jsonFileService = jsonFileService;
        }

        [HttpGet]
        public async Task<ActionResult<List<Admin>>> GetAdmins()
        {
            var admins = await _jsonFileService.ReadAsync();
            return Ok(admins);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Admin>> GetAdmin(string id)
        {
            var admins = await _jsonFileService.ReadAsync();
            var admin = admins.FirstOrDefault(a => a.Id == id);
            if (admin == null)
            {
                return NotFound();
            }
            return Ok(admin);
        }

        [HttpPost]
        public async Task<ActionResult<Admin>> CreateAdmin(Admin admin, IFormFile photo)
        {
            var admins = await _jsonFileService.ReadAsync();

            // تشفير كلمة المرور
            admin.Password = BCrypt.Net.BCrypt.HashPassword(admin.Password);

            // تحويل الصورة إلى Base64
            if (photo != null)
            {
                using (var memoryStream = new MemoryStream())
                {
                    await photo.CopyToAsync(memoryStream);
                    admin.PhotoBase64 = Convert.ToBase64String(memoryStream.ToArray());
                }
            }

            admins.Add(admin);
            await _jsonFileService.WriteAsync(admins);
            return CreatedAtAction(nameof(GetAdmin), new { id = admin.Id }, admin);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAdmin(string id, Admin updatedAdmin, IFormFile photo)
        {
            var admins = await _jsonFileService.ReadAsync();
            var adminIndex = admins.FindIndex(a => a.Id == id);
            if (adminIndex == -1)
            {
                return NotFound();
            }

            // تشفير كلمة المرور
            updatedAdmin.Password = BCrypt.Net.BCrypt.HashPassword(updatedAdmin.Password);

            // تحويل الصورة إلى Base64
            if (photo != null)
            {
                using (var memoryStream = new MemoryStream())
                {
                    await photo.CopyToAsync(memoryStream);
                    updatedAdmin.PhotoBase64 = Convert.ToBase64String(memoryStream.ToArray());
                }
            }
            else
            {
                updatedAdmin.PhotoBase64 = admins[adminIndex].PhotoBase64;
            }

            admins[adminIndex] = updatedAdmin;
            await _jsonFileService.WriteAsync(admins);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAdmin(string id)
        {
            var admins = await _jsonFileService.ReadAsync();
            var adminIndex = admins.FindIndex(a => a.Id == id);
            if (adminIndex == -1)
            {
                return NotFound();
            }
            admins.RemoveAt(adminIndex);
            await _jsonFileService.WriteAsync(admins);
            return NoContent();
        }
    }
}
