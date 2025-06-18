using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

[ApiController]
[Route("api/[controller]")]
public class EnrollmentsController : ControllerBase
{
    private readonly IWebHostEnvironment _env;

    public EnrollmentsController(IWebHostEnvironment env)
    {
        _env = env;
    }

    [HttpPost]
    public async Task<IActionResult> Enroll([FromBody] EnrollmentModel model)
    {
        if (model == null || string.IsNullOrEmpty(model.StudentId) || string.IsNullOrEmpty(model.CourseId))
        {
            return BadRequest("Invalid enrollment data.");
        }

        string filePath = Path.Combine(_env.ContentRootPath, "Data", "enrollments.json");

        List<EnrollmentModel> enrollments = new List<EnrollmentModel>();

        if (System.IO.File.Exists(filePath))
        {
            var jsonData = await System.IO.File.ReadAllTextAsync(filePath);
            enrollments = JsonConvert.DeserializeObject<List<EnrollmentModel>>(jsonData) ?? new List<EnrollmentModel>();
        }

        // Prevent duplicate
        bool alreadyEnrolled = enrollments.Any(e => e.StudentId == model.StudentId && e.CourseId == model.CourseId);
        if (alreadyEnrolled)
        {
            return Conflict("Already enrolled.");
        }

        enrollments.Add(model);
        var updatedJson = JsonConvert.SerializeObject(enrollments, Formatting.Indented);
        await System.IO.File.WriteAllTextAsync(filePath, updatedJson);

        return Ok();
    }

[HttpGet]
public async Task<IActionResult> GetEnrollments()
{
    string filePath = Path.Combine(_env.ContentRootPath, "Data", "enrollments.json");

    if (!System.IO.File.Exists(filePath))
    {
        return Ok(new List<EnrollmentModel>()); // ترجع ليست فارغة إذا الملف غير موجود
    }

    var jsonData = await System.IO.File.ReadAllTextAsync(filePath);
    var enrollments = JsonConvert.DeserializeObject<List<EnrollmentModel>>(jsonData) ?? new List<EnrollmentModel>();

    return Ok(enrollments);
}

}


public class EnrollmentModel
{
    public string StudentId { get; set; }
    public string CourseId { get; set; }
    public string EnrollDate { get; set; }
}
