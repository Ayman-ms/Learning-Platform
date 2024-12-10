using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Linq;
using System.Text.Json;
using web_api.Models;

namespace web_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TeacherController : ControllerBase
    {
        private readonly string _teacherFile = @"C:\Users\amslmani\OneDrive - Meta-Level Software AG\Desktop\Angular\Learning-Platform GUI\backend\json\Teachers.json";
        private readonly string _imageFolderPath = "C:/Users/amslmani/OneDrive - Meta-Level Software AG/Desktop/Angular/Learning-Platform GUI/learning-platform/src/assets/photo/Avatars";

        public TeacherController()
        {
            // Ensure the image folder exists
            if (!Directory.Exists(_imageFolderPath))
            {
                Directory.CreateDirectory(_imageFolderPath);
            }
        }

        // GET: api/Teacher
        [HttpGet]
        public IActionResult GetAllTeachers()
        {
            if (!System.IO.File.Exists(_teacherFile))
                return NotFound("Teacher file not found.");

            var teachersList = JsonSerializer.Deserialize<List<Teacher>>(System.IO.File.ReadAllText(_teacherFile));
            return Ok(teachersList);
        }

        // POST: api/Teacher
        [HttpPost]
        public IActionResult CreateNewTeacher([FromForm] Teacher teacher, [FromForm] IFormFile? avatarFile)
        {
            if (teacher == null || !ModelState.IsValid)
                return BadRequest("Invalid teacher data.");

            var teachersList = new List<Teacher>();

            if (System.IO.File.Exists(_teacherFile))
            {
                teachersList = JsonSerializer.Deserialize<List<Teacher>>(System.IO.File.ReadAllText(_teacherFile));
            }

            int id = teachersList.Count > 0 ? teachersList.Max(x => x.Id) + 1 : 1;

            string avatarPath = null;
            if (avatarFile != null)
            {
                avatarPath = Path.Combine(_imageFolderPath, $"{id}_{avatarFile.FileName}");
                using (var stream = new FileStream(avatarPath, FileMode.Create))
                {
                    avatarFile.CopyTo(stream);
                }
            }
            else
            {
                avatarPath = "C:/teachers/amslmani/OneDrive - Meta-Level Software AG/Desktop/Angular/Learning-Platform GUI/learning-platform/src/assets/photo/Avatars/avatar4.png";
            }

            teacher.Id = id;
            teacher.Password = Utils.sha256_hash(teacher.Password);
            teacher.Avatar = avatarPath;

            teachersList.Add(teacher);
            System.IO.File.WriteAllText(_teacherFile, JsonSerializer.Serialize(teachersList));

            return CreatedAtAction(nameof(GetAllTeachers), new { id = teacher.Id }, teacher);
        }


        // DELETE: api/teacher/{id}
        [HttpDelete("{id}")]
        public IActionResult DeleteTeacher(int id)
        {
            if (!System.IO.File.Exists(_teacherFile))
                return NotFound("Teacher file not found.");

            var teachersList = JsonSerializer.Deserialize<List<Teacher>>(System.IO.File.ReadAllText(_teacherFile));
            var teacherToRemove = teachersList.FirstOrDefault(x => x.Id == id);

            if (teacherToRemove == null)
                return NotFound($"teacher with ID {id} not found.");

            teachersList.Remove(teacherToRemove);
            System.IO.File.WriteAllText(_teacherFile, JsonSerializer.Serialize(teachersList));

            if (!string.IsNullOrEmpty(teacherToRemove.Avatar) && System.IO.File.Exists(teacherToRemove.Avatar))
            {
                System.IO.File.Delete(teacherToRemove.Avatar);
            }

            return NoContent();
        }

        // PUT: api/teacher/{id}
        [HttpPut("{id}")]
        public IActionResult UpdateTeacher(int id, [FromForm] Teacher teacher, [FromForm] IFormFile avatarFile)
        {
            if (!System.IO.File.Exists(_teacherFile))
                return NotFound("teacher file not found.");

            var teachersList = JsonSerializer.Deserialize<List<Teacher>>(System.IO.File.ReadAllText(_teacherFile));
            var teacherToUpdate = teachersList.FirstOrDefault(x => x.Id == id);

            if (teacherToUpdate == null)
                return NotFound($"teacher with ID {id} not found.");

            teacherToUpdate.FirstName = teacher.FirstName;
            teacherToUpdate.LastName = teacher.LastName;
            teacherToUpdate.Password = Utils.sha256_hash(teacher.Password);
            teacherToUpdate.Email = teacher.Email;
            teacherToUpdate.Phone = teacher.Phone;

            if (avatarFile != null)
            {
                string avatarPath = Path.Combine(_imageFolderPath, $"{id}_{avatarFile.FileName}");
                using (var stream = new FileStream(avatarPath, FileMode.Create))
                {
                    avatarFile.CopyTo(stream);
                }

                if (!string.IsNullOrEmpty(teacherToUpdate.Avatar) && System.IO.File.Exists(teacherToUpdate.Avatar))
                {
                    System.IO.File.Delete(teacherToUpdate.Avatar);
                }

                teacherToUpdate.Avatar = avatarPath;
            }

            System.IO.File.WriteAllText(_teacherFile, JsonSerializer.Serialize(teachersList));
            return NoContent();
        }
    }
}
