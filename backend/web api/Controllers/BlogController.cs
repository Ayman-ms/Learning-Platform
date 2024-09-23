using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using web_api.Models;

namespace web_api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class BlogController
    {
        [HttpGet(Name = "GetAllBlogPost")]
        public List<BlogPost> GetAllBlogPost()
        {
            List<BlogPost> blogPosts = new List<BlogPost>();
            if (File.Exists("BlogPosts.json"))
            {
                blogPosts = JsonSerializer.Deserialize<List<BlogPost>>(File.ReadAllText(@"E:\Angular\blogsystem\blogpost\backend\web api\BlogPosts.json"));
            }
#pragma warning disable CS8603 // Possible null reference return.
            return blogPosts;
        }

        [HttpPost(Name = "CreateBlogPost")]
        public int CreateBlogPost(BlogPost blogPost)
        {
            List<BlogPost> blogPosts=new List<BlogPost>();
            if (File.Exists("BlogPosts.json"))
            {
                blogPosts=JsonSerializer.Deserialize<List<BlogPost>>(File.ReadAllText(@"E:\Angular\blogsystem\backend\web api\BlogPosts.json"));
            }
            int id=1;
#pragma warning disable CS8604 // Possible null reference argument.
            if (blogPosts.Count() > 0)
            {
                id=blogPosts.Max((x)=>x.Id)+1;
            }
#pragma warning restore CS8604 // Possible null reference argument.
            blogPosts.Add(new BlogPost { Id=id,Title=blogPost.Title,Body=blogPost.Body});
            File.WriteAllText(@"E:\Angular\blogsystem\backend\web api\BlogPosts.json", JsonSerializer.Serialize(blogPosts));
            return id;
        }
        [HttpDelete(Name = "DeleteBlogPost")]
        public bool DeleteBlogPost(int id, List<BlogPost>? blogPosts)
        {
            List<BlogPost> blogPost = new List<BlogPost>();
            if (File.Exists("BlogPosts.json"))
            {
                blogPosts = JsonSerializer.Deserialize<List<BlogPost>>(File.ReadAllText(@"E:\Angular\blogsystem\backend\web api\BlogPosts.json"));
            }

#pragma warning disable CS8602 // Dereference of a possibly null reference.
#pragma warning disable CS8604 // Possible null reference argument.
            blogPosts.Remove(blogPosts.Where((x) => x.Id == id).FirstOrDefault());
#pragma warning restore CS8604 // Possible null reference argument.
#pragma warning restore CS8602 // Dereference of a possibly null reference.
            File.WriteAllText(@"E:\Angular\blogsystem\backend\web api\BlogPosts.json", JsonSerializer.Serialize(blogPosts));
            return true;
        }

        

        [HttpPut(Name = "UpdateBlogPost")]
        public bool UpdateBlogPost(BlogPost blogPost)
        {
            List<BlogPost> blogPosts = new List<BlogPost>();
            if (File.Exists("BlogPosts.json"))
            {
                blogPosts = JsonSerializer.Deserialize<List<BlogPost>>(File.ReadAllText(@"E:\Angular\blogsystem\backend\web api\BlogPosts.json"));
            }
#pragma warning disable CS8604 // Possible null reference argument.
            if (blogPosts.Count() > 0)
            {
                var blogPostToEdit = blogPosts.Where((x) => x.Id == blogPost.Id).First();
                blogPostToEdit.Title = blogPost.Title;
                blogPostToEdit.Body = blogPost.Body;
                blogPostToEdit.Like = blogPost.Like;
                File.WriteAllText(@"E:\Angular\blogsystem\backend\web api\BlogPosts.json", JsonSerializer.Serialize(blogPosts));
                return true;
            }
#pragma warning restore CS8604 // Possible null reference argument.
            return false;
        }
    }
}