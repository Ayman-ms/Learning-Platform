using SkillwaveAPI.Services;
using SkillwaveAPI.Models; // إضافة استيراد النماذج
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container

// إضافة سياسة CORS للسماح بالطلبات من الأصل المطلوب
builder.Services.AddCors(options =>
{
 options.AddPolicy("AllowAngular",
        policy => policy.WithOrigins("http://localhost:4200") // عنوان الـ Angular
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials()); // في حال إرسال بيانات المصادقة (Authentication)
// });
});

builder.Services.AddSingleton(new JsonFileService<Admin>("Data/admins.json"));
builder.Services.AddSingleton(new JsonFileService<Course>("Data/courses.json"));
builder.Services.AddSingleton(new JsonFileService<MainCategory>("Data/maincategories.json"));
builder.Services.AddSingleton(new JsonFileService<SubCategory>("Data/subcategories.json"));
builder.Services.AddSingleton(new JsonFileService<Teacher>("Data/teachers.json"));
builder.Services.AddSingleton(new JsonFileService<Student>("Data/students.json"));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

// تمكين سياسة CORS
app.UseCors("AllowAngular"); 
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.UseSwagger();
app.UseSwaggerUI();
// (c =>
// {
//     c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
// }
// );

app.Run();
