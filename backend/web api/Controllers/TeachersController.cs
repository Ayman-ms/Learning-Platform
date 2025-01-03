using Microsoft.AspNetCore.Mvc;
//using web_api.Data;
using web_api.Models;

namespace web_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TeachersController : ControllerBase
    {
        private readonly SkillWaveDbContext _context;

        public TeachersController(SkillWaveDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAllTeachers()
        {
            var teachers = _context.Teachers.ToList();
            return Ok(teachers);
        }

        // GET: api/Teacher/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTeacherById(int id)
        {
            var teacher = await _context.Teachers.FindAsync(id);
            if (teacher == null)
                return NotFound($"Admin with ID {id} not found.");

            return Ok(teacher);
        }

        [HttpPost]
        public IActionResult CreateTeacher([FromBody] Teacher teacher)
        {
            _context.Teachers.Add(teacher);
            _context.SaveChanges();
            return Ok(teacher);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateTeacher(int id, [FromBody] Teacher updatedTeacher)
        {
            var teacher = _context.Teachers.FirstOrDefault(t => t.ID == id);
            if (teacher == null)
                return NotFound();

            teacher.FirstName = updatedTeacher.FirstName;
            teacher.LastName = updatedTeacher.LastName;
            teacher.Email = updatedTeacher.Email;
            teacher.Phone = updatedTeacher.Phone;
            teacher.Avatar = updatedTeacher.Avatar;

            _context.SaveChanges();
            return Ok(teacher);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteTeacher(int id)
        {
            var teacher = _context.Teachers.FirstOrDefault(t => t.ID == id);
            if (teacher == null)
                return NotFound();

            _context.Teachers.Remove(teacher);
            _context.SaveChanges();
            return Ok();
        }
    }
}
