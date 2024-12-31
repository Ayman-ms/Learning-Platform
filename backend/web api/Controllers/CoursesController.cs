using Microsoft.EntityFrameworkCore;
using SkillWaveAPI.Models;

public class CoursesController : DbContext
{
    public DbSet<Admin> Admins { get; set; }
    public DbSet<MainCategory> MainCategories { get; set; }
    public DbSet<SubCategory> SubCategories { get; set; }
    public DbSet<Course> Courses { get; set; }
    public DbSet<CourseCategory> CourseCategories { get; set; }
    public DbSet<Student> Students { get; set; }
    public DbSet<StudentCourse> StudentCourses { get; set; }
    public DbSet<Teacher> Teachers { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<CourseCategory>()
            .HasKey(cc => new { cc.CourseID, cc.MainCategoryID, cc.SubCategoryID });

        modelBuilder.Entity<StudentCourse>()
            .HasKey(sc => new { sc.StudentID, sc.CourseID });
    }
}
