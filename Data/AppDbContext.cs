using Microsoft.EntityFrameworkCore;
using StudentManagement.Models;

namespace StudentManagement.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Student> Students { get; set; }
        public DbSet<Notice> Notices { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure primary key and constraints for Student
            modelBuilder.Entity<Student>()
                .HasKey(s => s.Id);

            modelBuilder.Entity<Student>()
                .Property(s => s.Name)
                .IsRequired();

            modelBuilder.Entity<Student>()
                .Property(s => s.Email)
                .IsRequired();

            modelBuilder.Entity<Student>()
                .Property(s => s.Password)
                .IsRequired();

            modelBuilder.Entity<Student>()
                .Property(s => s.DesiredCourse)
                .IsRequired();

            // Configure primary key and constraints for Notice
            modelBuilder.Entity<Notice>()
                .HasKey(n => n.Id);

            modelBuilder.Entity<Notice>()
                .Property(n => n.Course)
                .IsRequired();

            modelBuilder.Entity<Notice>()
                .Property(n => n.Content)
                .IsRequired();

            modelBuilder.Entity<Notice>()
                .Property(n => n.CreatedAt)
                .IsRequired()
                .HasDefaultValueSql("GETDATE()"); // Automatically set the creation date

            base.OnModelCreating(modelBuilder);
        }
    }
}
