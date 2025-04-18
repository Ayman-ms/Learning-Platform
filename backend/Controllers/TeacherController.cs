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

        [HttpPost("register")]
        public async Task<ActionResult<Teacher>> Register([FromForm] TeacherDTO teacherDto)
        {
            try
            {
                var teacher = new Teacher
                {
                    FirstName = teacherDto.FirstName,
                    LastName = teacherDto.LastName,
                    Email = teacherDto.Email,
                    Phone = teacherDto.Phone,
                    Password = BCrypt.Net.BCrypt.HashPassword(teacherDto.Password)
                };

                if (teacherDto.Photo != null)
                {
                    // إنشاء مجلد للصور إذا لم يكن موجوداً
                    var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "teachers");
                    if (!Directory.Exists(uploadsFolder))
                    {
                        Directory.CreateDirectory(uploadsFolder);
                    }

                    // تسمية الصورة باستخدام الاسم الأول واسم العائلة
                    var fileExtension = Path.GetExtension(teacherDto.Photo.FileName);
                    var fileName = $"{teacher.FirstName}_{teacher.LastName}{fileExtension}";
                    var filePath = Path.Combine(uploadsFolder, fileName);

                    // حفظ الصورة كملف فعلي
                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await teacherDto.Photo.CopyToAsync(fileStream);
                    }

                    // حفظ مسار الصورة في خاصية ProfileImage
                    var baseUrl = $"{Request.Scheme}://{Request.Host}";
                    teacher.ProfileImage = $"{baseUrl}/teachers/{fileName}";

                }

                var teachers = await _jsonFileService.ReadAsync();
                teachers.Add(teacher);
                await _jsonFileService.WriteAsync(teachers);

                return CreatedAtAction(nameof(GetTeacher), new { id = teacher.Id }, teacher);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

       [HttpPut("{id}")]
public async Task<ActionResult<Teacher>> UpdateTeacher(string id, [FromForm] TeacherDTO teacherDto)
{
    try
    {
        var teachers = await _jsonFileService.ReadAsync();
        var teacher = teachers.FirstOrDefault(t => t.Id == id);

        if (teacher == null)
        {
            return NotFound(new { message = "Teacher not found" });
        }

        // تحديث البيانات الأساسية فقط إذا تم تقديمها
        if (!string.IsNullOrEmpty(teacherDto.FirstName))
        {
            teacher.FirstName = teacherDto.FirstName;
        }

        if (!string.IsNullOrEmpty(teacherDto.LastName))
        {
            teacher.LastName = teacherDto.LastName;
        }

        if (!string.IsNullOrEmpty(teacherDto.Email))
        {
            teacher.Email = teacherDto.Email;
        }

        if (!string.IsNullOrEmpty(teacherDto.Phone))
        {
            teacher.Phone = teacherDto.Phone;
        }

        // تحديث كلمة المرور إذا تم تقديمها
        if (!string.IsNullOrEmpty(teacherDto.Password))
        {
            teacher.Password = BCrypt.Net.BCrypt.HashPassword(teacherDto.Password);
        }

        // تحديث الصورة إذا تم رفع صورة جديدة
        if (teacherDto.Photo != null)
        {
            // حذف الصورة القديمة إذا كانت موجودة
            if (!string.IsNullOrEmpty(teacher.ProfileImage))
            {
                var oldFilePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", teacher.ProfileImage.TrimStart('/'));
                if (System.IO.File.Exists(oldFilePath))
                {
                    System.IO.File.Delete(oldFilePath);
                }
            }

            // إنشاء مجلد للصور إذا لم يكن موجوداً
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "teachers");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            // تسمية الصورة الجديدة
            var fileExtension = Path.GetExtension(teacherDto.Photo.FileName);
            var fileName = $"{teacher.FirstName}_{teacher.LastName}{fileExtension}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            // حفظ الصورة الجديدة
            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await teacherDto.Photo.CopyToAsync(fileStream);
            }

            // تحديث مسار الصورة
            var baseUrl = $"{Request.Scheme}://{Request.Host}";
            teacher.ProfileImage = $"{baseUrl}/teachers/{fileName}";
        }

        // حفظ التغييرات
        await _jsonFileService.WriteAsync(teachers);

        return Ok(teacher);
    }
    catch (Exception ex)
    {
        return BadRequest(new { message = ex.Message });
    }
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
