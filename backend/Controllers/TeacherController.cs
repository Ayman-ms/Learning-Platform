using Microsoft.AspNetCore.Mvc;
using SkillwaveAPI.Services;
using SkillwaveAPI.Models;
using BCrypt.Net;
using System.IO;

namespace SkillwaveAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TeacherController : ControllerBase
    {
        private readonly JsonFileService<Teacher> _jsonFileService;

        public TeacherController(JsonFileService<Teacher> jsonFileService)
        {
            _jsonFileService = jsonFileService;
        }

        [HttpGet]
        public async Task<ActionResult<List<Teacher>>> GetTeachers()
        {
            var teachers = await _jsonFileService.ReadAsync();
            return Ok(teachers);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Teacher>> GetTeacher(string id)
        {
            var teachers = await _jsonFileService.ReadAsync();
            var teacher = teachers.FirstOrDefault(t => t.Id == id);
            if (teacher == null)
            {
                return NotFound();
            }
            return Ok(teacher);
        }

        [HttpPost]
        public async Task<ActionResult<Teacher>> CreateTeacher(Teacher teacher, IFormFile photo)
        {
            var teachers = await _jsonFileService.ReadAsync();

            // تشفير كلمة المرور
            teacher.Password = BCrypt.Net.BCrypt.HashPassword(teacher.Password);

            // تحويل الصورة إلى Base64
            if (photo != null)
            {
                using (var memoryStream = new MemoryStream())
                {
                    await photo.CopyToAsync(memoryStream);
                    teacher.PhotoBase64 = Convert.ToBase64String(memoryStream.ToArray());
                }
            }

            teachers.Add(teacher);
            await _jsonFileService.WriteAsync(teachers);
            return CreatedAtAction(nameof(GetTeacher), new { id = teacher.Id }, teacher);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTeacher(string id, Teacher updatedTeacher, IFormFile photo)
        {
            var teachers = await _jsonFileService.ReadAsync();
            var teacherIndex = teachers.FindIndex(t => t.Id == id);
            if (teacherIndex == -1)
            {
                return NotFound();
            }

            // تشفير كلمة المرور
            updatedTeacher.Password = BCrypt.Net.BCrypt.HashPassword(updatedTeacher.Password);

            // تحويل الصورة إلى Base64
            if (photo != null)
            {
                using (var memoryStream = new MemoryStream())
                {
                    await photo.CopyToAsync(memoryStream);
                    updatedTeacher.PhotoBase64 = Convert.ToBase64String(memoryStream.ToArray());
                }
            }
            else
            {
                updatedTeacher.PhotoBase64 = teachers[teacherIndex].PhotoBase64;
            }

            teachers[teacherIndex] = updatedTeacher;
            await _jsonFileService.WriteAsync(teachers);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTeacher(string id)
        {
            var teachers = await _jsonFileService.ReadAsync();
            var teacherIndex = teachers.FindIndex(t => t.Id == id);
            if (teacherIndex == -1)
            {
                return NotFound();
            }
            teachers.RemoveAt(teacherIndex);
            await _jsonFileService.WriteAsync(teachers);
            return NoContent();
        }
    }
}
