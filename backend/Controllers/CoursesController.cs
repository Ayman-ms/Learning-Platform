using Microsoft.AspNetCore.Mvc;
using SkillwaveAPI.Services;
using SkillwaveAPI.Models;
using System.IO;

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
        public async Task<ActionResult<List<Course>>> GetCourses()
        {
            var courses = await _jsonFileService.ReadAsync();
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
        public async Task<ActionResult<Course>> CreateCourse(Course course, IFormFile photo)
        {
            var courses = await _jsonFileService.ReadAsync();

            // تحويل الصورة إلى Base64
            if (photo != null)
            {
                using (var memoryStream = new MemoryStream())
                {
                    await photo.CopyToAsync(memoryStream);
                    course.PhotoBase64 = Convert.ToBase64String(memoryStream.ToArray());
                }
            }

            courses.Add(course);
            await _jsonFileService.WriteAsync(courses);
            return CreatedAtAction(nameof(GetCourse), new { id = course.Id }, course);
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

            // تحويل الصورة إلى Base64
            if (photo != null)
            {
                using (var memoryStream = new MemoryStream())
                {
                    await photo.CopyToAsync(memoryStream);
                    updatedCourse.PhotoBase64 = Convert.ToBase64String(memoryStream.ToArray());
                }
            }
            else
            {
                updatedCourse.PhotoBase64 = courses[courseIndex].PhotoBase64;
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
