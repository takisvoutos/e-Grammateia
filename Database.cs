using Microsoft.EntityFrameworkCore;

namespace e_Grammateia.Models;


    class GrammateiaDb : DbContext
    {
    public GrammateiaDb()
    {
    }

    public GrammateiaDb(DbContextOptions options) : base(options) { }
        public DbSet<User> User { get; set; } = null!;
        public DbSet<Department> Department { get; set; } = null!;
        public DbSet<Course> Course { get; set; } = null!;
        public DbSet<Grades> Grade { get; set; } = null!;
        public DbSet<Student> Student { get; set; } = null!;
        public DbSet<Teacher> Teacher { get; set; } = null!;
        public DbSet<Registration> Registration { get; set; } = null!;
        public DbSet<Secretary> Secretary { get; set; } = null!;
    }
