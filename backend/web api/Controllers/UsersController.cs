using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Linq;
using System.Text.Json;
using web_api.Models;

namespace web_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly string _userFile = @"C:\Users\amslmani\OneDrive - Meta-Level Software AG\Desktop\Angular\Learning-Platform GUI\backend\json\Users.json";
        private readonly string _imageFolderPath = "C:/Users/amslmani/OneDrive - Meta-Level Software AG/Desktop/Angular/Learning-Platform GUI/learning-platform/src/assets/photo/Avatars";

        public UserController()
        {
            // Ensure the image folder exists
            if (!Directory.Exists(_imageFolderPath))
            {
                Directory.CreateDirectory(_imageFolderPath);
            }
        }

        // GET: api/User
        [HttpGet]
        public IActionResult GetAllUsers()
        {
            if (!System.IO.File.Exists(_userFile))
                return NotFound("User file not found.");

            var usersList = JsonSerializer.Deserialize<List<User>>(System.IO.File.ReadAllText(_userFile));
            return Ok(usersList);
        }

        // POST: api/User
        [HttpPost]
        public IActionResult CreateNewUser([FromForm] User user, [FromForm] IFormFile? avatarFile)
        {
            if (user == null || !ModelState.IsValid)
                return BadRequest("Invalid user data.");

            var usersList = new List<User>();

            if (System.IO.File.Exists(_userFile))
            {
                usersList = JsonSerializer.Deserialize<List<User>>(System.IO.File.ReadAllText(_userFile));
            }

            int id = usersList.Count > 0 ? usersList.Max(x => x.Id) + 1 : 1;

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
                avatarPath = "C:/Users/amslmani/OneDrive - Meta-Level Software AG/Desktop/Angular/Learning-Platform GUI/learning-platform/src/assets/photo/Avatars/avatar4.png";
            }

            user.Id = id;
            user.Password = Utils.sha256_hash(user.Password);
            user.Avatar = avatarPath;

            usersList.Add(user);
            System.IO.File.WriteAllText(_userFile, JsonSerializer.Serialize(usersList));

            return CreatedAtAction(nameof(GetAllUsers), new { id = user.Id }, user);
        }


        // DELETE: api/User/{id}
        [HttpDelete("{id}")]
        public IActionResult DeleteUser(int id)
        {
            if (!System.IO.File.Exists(_userFile))
                return NotFound("User file not found.");

            var usersList = JsonSerializer.Deserialize<List<User>>(System.IO.File.ReadAllText(_userFile));
            var userToRemove = usersList.FirstOrDefault(x => x.Id == id);

            if (userToRemove == null)
                return NotFound($"User with ID {id} not found.");

            usersList.Remove(userToRemove);
            System.IO.File.WriteAllText(_userFile, JsonSerializer.Serialize(usersList));

            if (!string.IsNullOrEmpty(userToRemove.Avatar) && System.IO.File.Exists(userToRemove.Avatar))
            {
                System.IO.File.Delete(userToRemove.Avatar);
            }

            return NoContent();
        }

        // PUT: api/User/{id}
        [HttpPut("{id}")]
        public IActionResult UpdateUser(int id, [FromForm] User user, [FromForm] IFormFile avatarFile)
        {
            if (!System.IO.File.Exists(_userFile))
                return NotFound("User file not found.");

            var usersList = JsonSerializer.Deserialize<List<User>>(System.IO.File.ReadAllText(_userFile));
            var userToUpdate = usersList.FirstOrDefault(x => x.Id == id);

            if (userToUpdate == null)
                return NotFound($"User with ID {id} not found.");

            userToUpdate.FirstName = user.FirstName;
            userToUpdate.LastName = user.LastName;
            userToUpdate.Password = Utils.sha256_hash(user.Password);
            userToUpdate.Email = user.Email;
            userToUpdate.Phone = user.Phone;
            userToUpdate.Level = user.Level;

            if (avatarFile != null)
            {
                string avatarPath = Path.Combine(_imageFolderPath, $"{id}_{avatarFile.FileName}");
                using (var stream = new FileStream(avatarPath, FileMode.Create))
                {
                    avatarFile.CopyTo(stream);
                }

                if (!string.IsNullOrEmpty(userToUpdate.Avatar) && System.IO.File.Exists(userToUpdate.Avatar))
                {
                    System.IO.File.Delete(userToUpdate.Avatar);
                }

                userToUpdate.Avatar = avatarPath;
            }

            System.IO.File.WriteAllText(_userFile, JsonSerializer.Serialize(usersList));
            return NoContent();
        }
    }
}
