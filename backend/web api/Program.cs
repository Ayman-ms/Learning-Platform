using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
//using web_api.Data;

namespace web_api
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // إضافة خدمات إلى الحاوية
            // تسجيل DbContext
            builder.Services.AddDbContext<SkillWaveDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            // إضافة خدمات CORS
            var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
            builder.Services.AddCors(options =>
            {
                options.AddPolicy(name: MyAllowSpecificOrigins, policy =>
                {
                    policy.WithOrigins("http://localhost:4200")
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials();
                });
            });

            // إضافة الخدمات الأخرى (Controllers, Swagger)
            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            // تكوين التطبيق
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseCors(MyAllowSpecificOrigins);
            app.UseHttpsRedirection();
            app.UseAuthorization();

            app.MapControllers();

            // تشغيل التطبيق
            app.Run();
        }
    }
}
