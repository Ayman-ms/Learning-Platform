using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
//using web_api.Data;
using web_api.Models;
using System.Security.Cryptography;
using System.Text;

namespace SkillWaveAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StudentsController : ControllerBase
    {
        private readonly SkillWaveDbContext _context;
        private readonly IWebHostEnvironment _env;

        public StudentsController(SkillWaveDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // GET: api/Students
        [HttpGet]
        public async Task<IActionResult> GetAllStudents()
        {
            var students = await _context.Students.ToListAsync();
            return Ok(students);
        }

        // GET: api/Students/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetStudentById(int id)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null)
                return NotFound($"Student with ID {id} not found.");

            return Ok(student);
        }

        // POST: api/Students
        [HttpPost]
        public async Task<IActionResult> CreateStudent([FromForm] Student student, [FromForm] IFormFile? avatarFile)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid data.");

            // تشفير كلمة المرور
            student.Password = HashPassword(student.Password);

            // معالجة الصورة
            if (avatarFile != null)
            {
                var avatarPath = await SaveAvatarFile(avatarFile);
                student.Avatar = avatarPath;
            }

            _context.Students.Add(student);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetStudentById), new { id = student.StudentID }, student);
        }

        // PUT: api/Students/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStudent(int id, [FromForm] Student updatedStudent, [FromForm] IFormFile? avatarFile)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null)
                return NotFound($"Student with ID {id} not found.");

            // تحديث البيانات
            student.FirstName = updatedStudent.FirstName;
            student.LastName = updatedStudent.LastName;
            student.Email = updatedStudent.Email;
            student.Phone = updatedStudent.Phone;

            // تحديث كلمة المرور إذا تم إرسال كلمة مرور جديدة
            if (!string.IsNullOrEmpty(updatedStudent.Password))
            {
                student.Password = HashPassword(updatedStudent.Password);
            }

            // معالجة الصورة
            if (avatarFile != null)
            {
                var avatarPath = await SaveAvatarFile(avatarFile);
                if (!string.IsNullOrEmpty(student.Avatar) && System.IO.File.Exists(student.Avatar))
                {
                    System.IO.File.Delete(student.Avatar);
                }
                student.Avatar = avatarPath;
            }

            _context.Students.Update(student);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Students/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent(int id)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null)
                return NotFound($"Student with ID {id} not found.");

            // حذف الصورة من الخادم
            if (!string.IsNullOrEmpty(student.Avatar) && System.IO.File.Exists(student.Avatar))
            {
                System.IO.File.Delete(student.Avatar);
            }

            _context.Students.Remove(student);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // وظيفة لتشفير كلمة المرور
        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();
        }

        // وظيفة لحفظ الصور
        private async Task<string> SaveAvatarFile(IFormFile file)
        {
            var uploadsFolder = Path.Combine(_env.WebRootPath, "avatars");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var fileName = $"{Guid.NewGuid()}_{file.FileName}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return filePath;
        }
    }
}
