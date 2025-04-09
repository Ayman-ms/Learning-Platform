using Microsoft.AspNetCore.Mvc;
using SkillwaveAPI.Services;
using SkillwaveAPI.Models;
using BCrypt.Net;
using System.IO;
using System;
using System.Text.Json;
namespace SkillwaveAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StudentController : ControllerBase
    {
        private readonly JsonFileService<Student> _jsonFileService;

        public StudentController(JsonFileService<Student> jsonFileService)
        {
            _jsonFileService = jsonFileService;
        }

        [HttpGet]
        public async Task<ActionResult<List<Student>>> GetStudents()
        {
            var students = await _jsonFileService.ReadAsync();

            foreach (var student in students)
            {
                if (string.IsNullOrEmpty(student.PhotoBase64))
                {
                    Console.WriteLine($"🚨 تحذير: {student.FirstName} لا يحتوي على صورة!");
                }
                else
                {
                    Console.WriteLine($"✅ {student.FirstName} لديه صورة");
                }
            }

            return Ok(students);
        }



        [HttpGet("{id}")]
        public async Task<ActionResult<Student>> GetStudent(string id)
        {
            var students = await _jsonFileService.ReadAsync();
            var student = students.FirstOrDefault(s => s.Id == id);
            if (student == null)
            {
                return NotFound();
            }
            return Ok(student);
        }

        [HttpPost("register")]
        public async Task<ActionResult<Student>> RegisterStudent([FromBody] Student student)
        {
            if (student == null)
            {
                return BadRequest("Invalid student data.");
            }

            // تعيين Id جديد للطالب
            student.Id = Guid.NewGuid().ToString();
            student.CreatedAt = DateTime.UtcNow;

            // تشفير كلمة المرور
            student.Password = BCrypt.Net.BCrypt.HashPassword(student.Password);

            var students = await _jsonFileService.ReadAsync();
            students.Add(student);
            await _jsonFileService.WriteAsync(students);

            return CreatedAtAction(nameof(GetStudent), new { id = student.Id }, student);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStudent(string id, [FromBody] Student updatedStudent)
        {
            if (updatedStudent == null || id != updatedStudent.Id)
            {
                return BadRequest("Invalid student data.");
            }

            var students = await _jsonFileService.ReadAsync();
            var student = students.FirstOrDefault(s => s.Id == id);

            if (student == null)
            {
                return NotFound("Student not found.");
            }

            // تحديث بيانات الطالب
            student.FirstName = updatedStudent.FirstName;
            student.LastName = updatedStudent.LastName;
            student.Email = updatedStudent.Email;
            student.Phone = updatedStudent.Phone;
            student.PhotoBase64 = updatedStudent.PhotoBase64;

            await _jsonFileService.WriteAsync(students);

            return Ok(student);  // ✅ يجب إرجاع الطالب لتجنب `undefined`
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent(string id)
        {
            var students = await _jsonFileService.ReadAsync();
            var studentIndex = students.FindIndex(s => s.Id == id);
            if (studentIndex == -1)
            {
                return NotFound();
            }
            students.RemoveAt(studentIndex);
            await _jsonFileService.WriteAsync(students);
            return NoContent();
        }

    }
}
