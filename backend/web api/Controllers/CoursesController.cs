using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using web_api.Models;

namespace web_api.Controllers
{
    [ApiController]
    [Route("[controller]")]

    public class CoursesController
    {
        private readonly string _coursesFile = @"C:\Users\amslmani\OneDrive - Meta-Level Software AG\Desktop\Angular\Learning-Platform GUI\backend\json\Courses.json";


        [HttpGet(Name = "GetAllCourses")]
        public List<Courses> GetAllCourses()
        {
            List<Courses> courses = new List<Courses>();
            if (File.Exists("Courses.json"))
            {
                courses = JsonSerializer.Deserialize<List<Courses>>(File.ReadAllText(_coursesFile));
            }
#pragma warning disable CS8603 // Possible null reference return.
            return courses;
        }

        [HttpPost(Name = "CreateCourse")]
        public int CreateBlogPost(Courses blogPost)
        {
            List<Courses> courses = new List<Courses>();
            if (File.Exists("Courses.json"))
            {
                courses = JsonSerializer.Deserialize<List<Courses>>(File.ReadAllText(_coursesFile));
            }
            int id=1;
#pragma warning disable CS8604 // Possible null reference argument.
            if (courses.Count() > 0)
            {
                id= courses.Max((x)=>x.Id)+1;
            }
#pragma warning restore CS8604 // Possible null reference argument.
            courses.Add(new Courses { Id=id,Title=blogPost.Title,Body=blogPost.Body});
            File.WriteAllText(_coursesFile, JsonSerializer.Serialize(courses));
            return id;
        }
        [HttpDelete(Name = "DeleteCourse")]
        public bool DeleteCourse(int id, List<Courses>? courses)
        {
            List<Courses> course = new List<Courses>();
            if (File.Exists("Courses.json"))
            {
                courses = JsonSerializer.Deserialize<List<Courses>>(File.ReadAllText(_coursesFile));
            }

            course.Remove(courses.Where((x) => x.Id == id).FirstOrDefault());
            File.WriteAllText(_coursesFile, JsonSerializer.Serialize(courses));
            return true;
        }

        

        [HttpPut(Name = "UpdateCourses")]
        public bool UpdateBlogPost(Courses course)
        {
            List<Courses> courses = new List<Courses>();
            if (File.Exists("Courses.json"))
            {
                courses = JsonSerializer.Deserialize<List<Courses>>(File.ReadAllText(_coursesFile));
            }
#pragma warning disable CS8604 // Possible null reference argument.
            if (courses.Count() > 0)
            {
                var blogPostToEdit = courses.Where((x) => x.Id == course.Id).First();
                blogPostToEdit.Title = course.Title;
                blogPostToEdit.Body = course.Body;
                blogPostToEdit.Like = course.Like;
                File.WriteAllText(_coursesFile, JsonSerializer.Serialize(courses));
                return true;
            }
#pragma warning restore CS8604 // Possible null reference argument.
            return false;
        }
    }
}