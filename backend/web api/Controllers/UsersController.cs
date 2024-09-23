using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using web_api.Models;

namespace web_api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController
    {
        public string userFile = @"C:\Users\amslmani\OneDrive - Meta-Level Software AG\Desktop\Angular\Learning-Platform GUI\backend\json\Users.json";

        [HttpGet(Name = "GetAllUsers")]
        public List<User> GetAllUsers()
        {
            List<User> usersList = new List<User>();
            if (File.Exists("Users.json"))
            {
                usersList = JsonSerializer.Deserialize<List<User>>(File.ReadAllText(userFile));
            }
            return usersList;
        }

        ///creat new user
        [HttpPost(Name = "CreateNewUser")]
        public int CreateNewUser(User user)
        {
            List<User> usersList = new List<User>();
            if (File.Exists("Users.json"))
            {
                usersList = JsonSerializer.Deserialize<List<User>>(File.ReadAllText(userFile));
            }
            int id = 1;
            string roll = "user";
            if (usersList.Count() > 0)
            {
                id = usersList.Max((x) => x.Id) + 1;
            }
            usersList.Add(new User { Id = id, FirstName = user.FirstName, LastName = user.LastName, Password = Utils.sha256_hash(user.Password), Email = user.Email ,Phone= user.Phone });
            File.WriteAllText(userFile, JsonSerializer.Serialize(usersList));
            return id;
        }
        ///delete user
        [HttpDelete(Name = "DeleteUser")]
        public bool DeleteUser(int id)
        {
            List<User> usersList = new List<User>();
            if (File.Exists("Users.json"))
            {
                usersList = JsonSerializer.Deserialize<List<User>>(File.ReadAllText(userFile));
            }
            usersList.Remove(usersList.Where((x) => x.Id == id).FirstOrDefault());
            File.WriteAllText(userFile, JsonSerializer.Serialize(usersList));
            return true;
        }

        /// update user
        [HttpPut(Name = "UpdateUser")]
        public bool UpdatUser(User user)
        {
            List<User> userslist = new List<User>();
            if (File.Exists("Users.json"))
            {
                userslist = JsonSerializer.Deserialize<List<User>>(File.ReadAllText(userFile));
            }
            if (userslist.Count() > 0)
            {
                var userToUpdate = userslist.Where((x) => x.Id == user.Id).First();
                userToUpdate.FirstName = user.FirstName;
                userToUpdate.LastName = user.LastName;
                userToUpdate.Password = Utils.sha256_hash(user.Password);
                userToUpdate.Email = user.Email;
                userToUpdate.Phone = user.Phone;
                File.WriteAllText(userFile, JsonSerializer.Serialize(userslist));
                return true;
            }
            return false;
        }


    }
}