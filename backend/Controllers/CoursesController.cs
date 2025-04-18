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
        public async Task<IActionResult> UpdateCourse(string id, Course updatedCourse, IFormFile photo)
        {
            var courses = await _jsonFileService.ReadAsync();
            var courseIndex = courses.FindIndex(c => c.Id == id);
            if (courseIndex == -1)
            {
                return NotFound();
            }

            if (photo != null)
            {
                // حذف الصورة القديمة إذا وجدت
                if (!string.IsNullOrEmpty(courses[courseIndex].PhotoPath))
                {
                    var oldPhotoPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot",
                        courses[courseIndex].PhotoPath.TrimStart('/'));
                    if (System.IO.File.Exists(oldPhotoPath))
                    {
                        System.IO.File.Delete(oldPhotoPath);
                    }
                }

                // حفظ الصورة الجديدة
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "courses");
                var fileExtension = Path.GetExtension(photo.FileName);
                var fileName = $"{id}{fileExtension}";
                var filePath = Path.Combine(uploadsFolder, fileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await photo.CopyToAsync(fileStream);
                }

                updatedCourse.PhotoPath = $"/courses/{fileName}";
            }
            else
            {
                updatedCourse.PhotoPath = courses[courseIndex].PhotoPath;
            }

            courses[courseIndex] = updatedCourse;
            await _jsonFileService.WriteAsync(courses);
            return NoContent();
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

