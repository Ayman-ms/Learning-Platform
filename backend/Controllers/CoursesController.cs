using Microsoft.AspNetCore.Mvc;
using SkillwaveAPI.Services;
using SkillwaveAPI.Models;
using System.IO;
using Newtonsoft.Json;

namespace SkillwaveAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CoursesController : ControllerBase
    {
        private readonly JsonFileService<Course> _jsonFileService;

        public CoursesController(JsonFileService<Course> jsonFileService)
        {
            _jsonFileService = jsonFileService;
        }

        [HttpGet]
        public async Task<ActionResult<List<Student>>> GetCourses()
        {
            var courses = await _jsonFileService.ReadAsync();

            foreach (var course in courses)
            {
                if (string.IsNullOrEmpty(course.PhotoPath))
                {
                    Console.WriteLine($"🚨 تحذير: {course.Name} لا يحتوي على صورة!");
                }
                else
                {
                    Console.WriteLine($"✅ {course.Name} لديه صورة");
                }
            }

            return Ok(courses);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Course>> GetCourse(string id)
        {
            var courses = await _jsonFileService.ReadAsync();
            var course = courses.FirstOrDefault(c => c.Id == id);
            if (course == null)
            {
                return NotFound();
            }
            return Ok(course);
        }

        [HttpPost]
        public async Task<ActionResult<Course>> CreateCourse(
            [FromForm] string courseName,
            [FromForm] string description,
            [FromForm] string status,
            [FromForm] string teacher,
            [FromForm] string mainCategory,
            [FromForm] string subCategories, // يتم إرسال القيم هنا كـ JSON
            IFormFile? photo)
        {
            var courses = await _jsonFileService.ReadAsync();
            var courseId = Guid.NewGuid().ToString();

            // معالجة الحقل SubCategories
            List<string> subCategoriesList = new List<string>();
            if (!string.IsNullOrEmpty(subCategories))
            {
                try
                {
                    subCategoriesList = JsonConvert.DeserializeObject<List<string>>(subCategories)?
                        .Where(s => !string.IsNullOrEmpty(s)) // إزالة القيم الفارغة أو null
                        .ToList() ?? new List<string>();
                }
                catch (JsonException)
                {
                    return BadRequest(new { message = "Invalid format for subCategories. It must be a valid JSON array." });
                }
            }

            var newCourse = new Course
            {
                Id = courseId,
                Name = courseName,
                Description = description,
                Status = status,
                Teacher = teacher,
                MainCategory = mainCategory,
                SubCategories = subCategoriesList
            };

            if (photo != null)
            {
                // إنشاء مجلد للصور إذا لم يكن موجوداً
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "courses");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                // حفظ الصورة باسم يتضمن معرف الكورس
                var fileExtension = Path.GetExtension(photo.FileName);
                var fileName = $"{courseId}{fileExtension}";
                var filePath = Path.Combine(uploadsFolder, fileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await photo.CopyToAsync(fileStream);
                }

                // حفظ مسار الصورة في الكورس
                newCourse.PhotoPath = $"/courses/{fileName}";
            }

            courses.Add(newCourse);
            await _jsonFileService.WriteAsync(courses);

            return CreatedAtAction(nameof(GetCourse), new { id = newCourse.Id }, newCourse);
        }

        [HttpPut("{id}")]
public async Task<IActionResult> UpdateCourse(string id, [FromForm] UpdateCourseDto dto)
{
    try
    {
        var courses = await _jsonFileService.ReadAsync();
        var courseIndex = courses.FindIndex(c => c.Id == id);
        
        if (courseIndex == -1)
        {
            return NotFound(new { message = "Course not found" });
        }

        var existingCourse = courses[courseIndex];

        // تحديث البيانات
        existingCourse.Name = dto.Name;
        existingCourse.Description = dto.Description;
        existingCourse.Teacher = dto.Teacher;
        existingCourse.MainCategory = dto.MainCategory;
        existingCourse.Status = dto.Status;
        existingCourse.SubCategories = dto.SubCategories ?? existingCourse.SubCategories;

        // معالجة الصورة
        if (Request.Form.Files.Count > 0)
        {
            var photo = Request.Form.Files[0];
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "courses");
            Directory.CreateDirectory(uploadsFolder);

            // حذف الصورة القديمة
            if (!string.IsNullOrEmpty(existingCourse.PhotoPath))
            {
                var oldPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", existingCourse.PhotoPath.TrimStart('/'));
                if (System.IO.File.Exists(oldPath))
                {
                    System.IO.File.Delete(oldPath);
                }
            }

            // حفظ الصورة الجديدة
            var fileExtension = Path.GetExtension(photo.FileName);
            var fileName = $"{id}{fileExtension}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await photo.CopyToAsync(fileStream);
            }

            existingCourse.PhotoPath = $"/courses/{fileName}";
        }

        // تحديث الكورس في القائمة
        courses[courseIndex] = existingCourse;
        await _jsonFileService.WriteAsync(courses);

        return Ok(existingCourse);
    }
    catch (Exception ex)
    {
        return StatusCode(500, new { message = ex.Message });
    }
}

public class UpdateCourseDto
{
    public string Name { get; set; }
    public string Description { get; set; }
    public string Status { get; set; }
    public string Teacher { get; set; }
    public string MainCategory { get; set; }
    public List<string> SubCategories { get; set; }
}

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCourse(string id)
        {
            var courses = await _jsonFileService.ReadAsync();
            var courseIndex = courses.FindIndex(c => c.Id == id);
            if (courseIndex == -1)
            {
                return NotFound();
            }
            courses.RemoveAt(courseIndex);
            await _jsonFileService.WriteAsync(courses);
            return NoContent();
        }
    }
}

