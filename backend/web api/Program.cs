using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;



namespace web_api

{

    public class Program
    {
        static void Main(string[] args)

        {
var builder = WebApplication.CreateBuilder(args);

    // Add services to the container.

    builder.Services.AddControllers();
    // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();
            var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";



            builder.Services.AddCors(options =>
            {
                options.AddPolicy(name: MyAllowSpecificOrigins,
                                  builder =>
                                  {
                                      builder
                                          .WithOrigins("http://localhost:4200")
                                          .AllowAnyHeader()
                                          .AllowAnyMethod()
                                          .AllowCredentials(); 
                                  });
            });
            var app = builder.Build();

    // Configure the HTTP request pipeline.
    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

            app.UseCors(MyAllowSpecificOrigins);
            app.UseHttpsRedirection();

    app.UseAuthorization();

    app.MapControllers();

    app.Run();
        }

    
        

        }}
