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
                if (string.IsNullOrEmpty(student.PhotoPath))
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
        public async Task<ActionResult<Student>> RegisterStudent([FromForm] StudentDTO studentDto)
        {
            try
            {
                var student = new Student
                {
                    Id = Guid.NewGuid().ToString(),
                    FirstName = studentDto.FirstName,
                    LastName = studentDto.LastName,
                    Email = studentDto.Email,
                    Phone = studentDto.Phone,
                    Password = BCrypt.Net.BCrypt.HashPassword(studentDto.Password)
                };

                if (studentDto.Photo != null)
                {
                    // إنشاء مجلد للصور إذا لم يكن موجوداً
                    var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "students");
                    if (!Directory.Exists(uploadsFolder))
                    {
                        Directory.CreateDirectory(uploadsFolder);
                    }

                    // تسمية الصورة باستخدام الاسم الأول واسم العائلة
                    var fileExtension = Path.GetExtension(studentDto.Photo.FileName);
                    var fileName = $"{student.FirstName}_{student.LastName}{fileExtension}";
                    var filePath = Path.Combine(uploadsFolder, fileName);

                    // حفظ الصورة كملف فعلي
                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await studentDto.Photo.CopyToAsync(fileStream);
                    }

                    // حفظ مسار الصورة في خاصية PhotoPath
                    var baseUrl = $"{Request.Scheme}://{Request.Host}";
                    student.PhotoPath = $"{baseUrl}/students/{fileName}";
                }

                var students = await _jsonFileService.ReadAsync();
                students.Add(student);
                await _jsonFileService.WriteAsync(students);

                return Ok(student);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStudent(string id, [FromForm] StudentDTO studentDto)
        {
            try
            {
                var students = await _jsonFileService.ReadAsync();
                var existingStudent = students.FirstOrDefault(s => s.Id == id);
                if (existingStudent == null)
                {
                    return NotFound("Student not found");
                }

                // تحديث البيانات
                existingStudent.FirstName = studentDto.FirstName;
                existingStudent.LastName = studentDto.LastName;
                existingStudent.Email = studentDto.Email;
                existingStudent.Phone = studentDto.Phone;

                // تشفير كلمة المرور الجديدة إن وُجدت
                if (!string.IsNullOrWhiteSpace(studentDto.Password))
                {
                    existingStudent.Password = BCrypt.Net.BCrypt.HashPassword(studentDto.Password);
                }

                // تحديث الصورة إن وُجدت
                if (studentDto.Photo != null)
                {
                    var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "students");

                    if (!Directory.Exists(uploadsFolder))
                    {
                        Directory.CreateDirectory(uploadsFolder);
                    }

                    // نفس اسم الصورة السابقة (first_last.extension)
                    var fileExtension = Path.GetExtension(studentDto.Photo.FileName);
                    var fileName = $"{existingStudent.FirstName}_{existingStudent.LastName}{fileExtension}";
                    var filePath = Path.Combine(uploadsFolder, fileName);

                    // حذف الصورة القديمة إن وُجدت
                    if (System.IO.File.Exists(filePath))
                    {
                        System.IO.File.Delete(filePath);
                    }

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await studentDto.Photo.CopyToAsync(stream);
                    }

                    var baseUrl = $"{Request.Scheme}://{Request.Host}";
                    existingStudent.PhotoPath = $"{baseUrl}/students/{fileName}";
                }

                await _jsonFileService.WriteAsync(students);
                return Ok(existingStudent);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
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

        [HttpPost("login")]
        public async Task<ActionResult<Student>> Login([FromBody] LoginDTO loginDto)
        {
            try
            {
                var students = await _jsonFileService.ReadAsync();
                var student = students.FirstOrDefault(s => s.Email == loginDto.Email);

                if (student == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, student.Password))
                {
                    return Unauthorized(new { message = "Invalid email or password" });
                }

                // يمكنك إضافة JWT token هنا إذا أردت
                return Ok(new
                {
                    id = student.Id,
                    email = student.Email,
                    firstName = student.FirstName,
                    lastName = student.LastName,
                    photoPath = student.PhotoPath
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        public class LoginDTO
        {
            public string Email { get; set; }
            public string Password { get; set; }
        }

    }
}
