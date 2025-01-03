using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkillWaveAPI.Models;
using System.IO;

namespace SkillWaveAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CoursesController : ControllerBase
    {
        private readonly SkillWaveDbContext _context;

        public CoursesController(SkillWaveDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAllCourses()
        {
            var courses = _context.Courses
                                  .Include(c => c.Teacher)
                                  .ToList();
            return Ok(courses);
        }

        // GET: api/Teacher/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTeacherById(int id)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null)
                return NotFound($"Admin with ID {id} not found.");

            return Ok(course);
        }

        [HttpPost]
        public IActionResult CreateCourse([FromForm] Course course, IFormFile avatar)
        {
            if (avatar != null)
            {
                course.Avatar = ConvertImageToBase64(avatar);
            }
            if (course.TeacherID.HasValue)
            {
                course.Teacher = _context.Teachers.Find(course.TeacherID.Value);
            }
            _context.Courses.Add(course);
            _context.SaveChanges();
            return Ok(course);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateCourse(int id, [FromForm] Course updatedCourse, IFormFile avatar)
        {
            var course = _context.Courses.Include(c => c.Teacher).FirstOrDefault(c => c.CourseID == id);
            if (course == null)
                return NotFound();

            course.Name = updatedCourse.Name;
            course.Description = updatedCourse.Description;
            course.TeacherID = updatedCourse.TeacherID;
            if (updatedCourse.TeacherID.HasValue)
            {
                course.Teacher = _context.Teachers.Find(updatedCourse.TeacherID.Value);
            }
            if (avatar != null)
            {
                course.Avatar = ConvertImageToBase64(avatar);
            }

            _context.SaveChanges();
            return Ok(course);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteCourse(int id)
        {
            var course = _context.Courses.FirstOrDefault(c => c.CourseID == id);
            if (course == null)
                return NotFound();

            _context.Courses.Remove(course);
            _context.SaveChanges();
            return Ok();
        }

        private string ConvertImageToBase64(IFormFile image)
        {
            using (var ms = new MemoryStream())
            {
                image.CopyTo(ms);
                var fileBytes = ms.ToArray();
                return Convert.ToBase64String(fileBytes);
            }
        }
    }
}
