using Microsoft.EntityFrameworkCore;
using SkillWaveAPI.Models;

public class SkillWaveDbContext : DbContext
{
    // إضافة هذا المنشئ
    public SkillWaveDbContext(DbContextOptions<SkillWaveDbContext> options)
        : base(options)
    {
    }
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
        // تعريف العلاقة بين Course و CourseCategory
        modelBuilder.Entity<CourseCategory>()
            .HasKey(cc => new { cc.CourseID, cc.MainCategoryID, cc.SubCategoryID }); // المفتاح المركب

        modelBuilder.Entity<CourseCategory>()
            .HasOne(cc => cc.Course)
            .WithMany(c => c.CourseCategories)
            .HasForeignKey(cc => cc.CourseID);

        modelBuilder.Entity<CourseCategory>()
            .HasOne(cc => cc.MainCategory)
            .WithMany(mc => mc.CourseCategories)
            .HasForeignKey(cc => cc.MainCategoryID);

        modelBuilder.Entity<CourseCategory>()
            .HasOne(cc => cc.SubCategory)
            .WithMany(sc => sc.CourseCategories)
            .HasForeignKey(cc => cc.SubCategoryID);

        // تعريف العلاقة بين MainCategory و SubCategory (واحد إلى متعدد)
        modelBuilder.Entity<SubCategory>()
            .HasOne(sc => sc.MainCategory)
            .WithMany(mc => mc.SubCategories)
            .HasForeignKey(sc => sc.MainCategoryID);

        base.OnModelCreating(modelBuilder);
    }
}
