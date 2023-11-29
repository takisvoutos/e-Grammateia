using Microsoft.OpenApi.Models;
using Microsoft.EntityFrameworkCore;
using e_Grammateia.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using System.Text;
using System;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Cryptography;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("Grammateia") ?? "Data Source=Grammateia.db";

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSqlite<GrammateiaDb>(connectionString);
builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
builder.Services.AddSwaggerGen(c =>
{
     c.SwaggerDoc("v1", new OpenApiInfo {
         Title = "e-Grammateia API",
         Description = "e-Grammateia API",
         Version = "v1" });
});


string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
      builder =>
      {
          builder.WithOrigins(
                "http://localhost:3000",
                "https://localhost:3000",
                "http://example.com"
           )
           .AllowAnyHeader()
           .AllowAnyMethod()
           .AllowCredentials()
           .WithExposedHeaders("Content-Disposition");
      });
});



var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI(c =>
{
   c.SwaggerEndpoint("/swagger/v1/swagger.json", "e-Grammateia API V1");
});

// Departments //

app.MapGet("/departments", async (GrammateiaDb db) => await db.Department.ToListAsync());

app.MapGet("/department/{id}", async (GrammateiaDb db, int id) => await db.Department.FindAsync(id));

app.MapPost("/departments", async (GrammateiaDb db, Department department) =>
{
  await db.Department.AddAsync(department);
  await db.SaveChangesAsync();
  return Results.Created($"/departments/{department.Id}", department);
});

app.MapPut("department/{id}", async (GrammateiaDb db, Department updateDepartment, int id) =>
{
    
    // Fetch the existing department from the database
    var existingDepartment = await db.Department.FindAsync(id);

    // Check if the course with the given ID exists
    if (existingDepartment == null)
    {
        return Results.NotFound();
    }

    // Update only the properties that are provided in the request
    if (updateDepartment.Name != null)
    {
        existingDepartment.Name = updateDepartment.Name;
    }

    if (updateDepartment.School != default)
    {
        existingDepartment.School = updateDepartment.School;
    }

    await db.SaveChangesAsync();

    return Results.Ok(existingDepartment);
});

app.MapDelete("/department/{id}", async (GrammateiaDb db, int id) =>
{
   var department = await db.Department.FindAsync(id);
   if (department is null)
   {
      return Results.NotFound();
   }
   db.Department.Remove(department);
   await db.SaveChangesAsync();
   return Results.Ok();
});

// Courses //

app.MapGet("/courses", async (GrammateiaDb db) => 
{
    var courses = await db.Course
    .Include(c => c.Department)
    .Include(c => c.Teacher)
    .ToListAsync();
    return courses;
});

app.MapGet("/courses/{id}", async (GrammateiaDb db, int id) => 
{
    // Fetch the specific course by ID, including the associated department and Teacher
    var course = await db.Course
    .Include(c => c.Department)
    .Include(c => c.Teacher)
    .FirstOrDefaultAsync(c => c.Id == id);

    return course;
});

app.MapPost("/courses", async (GrammateiaDb db, Course course) =>
{

  await db.Course.AddAsync(course);
  await db.SaveChangesAsync();
  return Results.Created($"/courses/{course.Id}", course);

});

app.MapPut("/courses/{id}", async (GrammateiaDb db, int id, Course updatedCourse) =>
{
    // Fetch the existing course from the database
    var existingCourse = await db.Course.FindAsync(id);

    // Check if the course with the given ID exists
    if (existingCourse == null)
    {
        return Results.NotFound();
    }

    // Update only the properties that are provided in the request
    if (updatedCourse.Name != null)
    {
        existingCourse.Name = updatedCourse.Name;
    }

    if (updatedCourse.Semester != default)
    {
        existingCourse.Semester = updatedCourse.Semester;
    }

    if (updatedCourse.Course_Type != default)
    {
        existingCourse.Course_Type = updatedCourse.Course_Type;
    }

    if (updatedCourse.ECTS != default)
    {
        existingCourse.ECTS = updatedCourse.ECTS;
    }

    if (updatedCourse.DepartmentID != default)
    {
        existingCourse.DepartmentID = updatedCourse.DepartmentID;
    }

    if (updatedCourse.TeacherID != default)
    {
        existingCourse.TeacherID = updatedCourse.TeacherID;
    }

    // Save changes to the database
    await db.SaveChangesAsync();

    return Results.Ok(existingCourse);
});

app.MapDelete("/course/{id}", async (GrammateiaDb db, int id) =>
{
   var course = await db.Course.FindAsync(id);
   if (course is null)
   {
      return Results.NotFound();
   }
   db.Course.Remove(course);
   await db.SaveChangesAsync();
   return Results.Ok();
});

// Users //

app.MapGet("/users", async (GrammateiaDb db) =>
{
    var usersData = await db.User
        .Select(user => new
        {
            user.Id,
            user.Name,
            user.Username,
            user.Email,
            user.Role,
            // user.Student.Department,
            Department = user.Role == UserRole.Student ? user.Student.Department : user.Teacher.Department,
        })
        .ToListAsync();

    return usersData;
});


app.MapPost("/user", async (GrammateiaDb db, User user) =>
{
    user.SetPassword(user.Password);

    // Save the user to the database
    await db.User.AddAsync(user);
    await db.SaveChangesAsync();

    
    if (user.Role == UserRole.Student)
    {
        if (user.Student != null) 
        {
            int departmentId = user.Student.DepartmentID;
        
            var department = await db.Department.FindAsync(departmentId);
            string departmentName = department.Name;

            string[] words = departmentName.Split(' ');

            // Get the first letter, regardless of the number of words
            char firstLetter = words.First().FirstOrDefault();

            Console.WriteLine($"First letter: {firstLetter}");

        string Student_id = GenerateUniqueStudentId(firstLetter);

            // Create and add the corresponding Student entity
            var student = new Student
            {
                UserID = user.Id,
                StudentNumber = Student_id,
                RegistrationDate = DateTime.UtcNow,
                DepartmentID = user.Student.DepartmentID,
            };

            await db.Student.AddAsync(student);
            await db.SaveChangesAsync();
        }else
        {
            
            Console.WriteLine("Student property is null.");
        }
       

        
    }
    else if(user.Role == UserRole.Teacher)
    {
        var teacher = new Teacher
        {
            UserID = user.Id,
            DepartmentID = user.Teacher.DepartmentID,
        };
        
        await db.Teacher.AddAsync(teacher);
        await db.SaveChangesAsync();
    }else if(user.Role == UserRole.Admin)
    {
        var secretary = new Secretary
        {
            UserID = user.Id,
            DepartmentID = user.Secretary.DepartmentID,
        };

        await db.Secretary.AddAsync(secretary);
        await db.SaveChangesAsync();
    }
});

// Function to generate a unique student_id
static string GenerateUniqueStudentId(char departmentLetter)
{
    // Extract the last two digits of the current year
    string yearDigits = DateTime.UtcNow.ToString("yy");

    // Generate a random component (3 digits)
    string randomComponent = new Random().Next(100, 999).ToString();

    // Combine the components to form the unique student_id
    return $"{departmentLetter}{yearDigits}{randomComponent}";
}

app.MapGet("/user/{id}", async (GrammateiaDb db, int id) => await db.User.FindAsync(id));

app.MapPut("/user/{id}", async (GrammateiaDb db, User updateuser, int id) =>
{
    // Log the incoming payload
    Console.WriteLine($"Updating user: {System.Text.Json.JsonSerializer.Serialize(updateuser)}");

    // Fetch the existing user from the database
    var user = await db.User.FindAsync(id);

    // Check if the user exists
    if (user == null)
    {
        Results.NotFound("User not found");
    }

    // // Perform input validation (customize this based on your requirements)
    // if (string.IsNullOrEmpty(updateuser.Name) && string.IsNullOrEmpty(updateuser.Username) && string.IsNullOrEmpty(updateuser.Email))
    // {
    //     Results.BadRequest("At least one of Name, Username, or Email should be provided for update");
    // }

    // Update common user properties if provided
    if (!string.IsNullOrEmpty(updateuser.Name))
    {
        user.Name = updateuser.Name;
    }

    if (!string.IsNullOrEmpty(updateuser.Username))
    {
        user.Username = updateuser.Username;
    }

    if (!string.IsNullOrEmpty(updateuser.Email))
    {
        user.Email = updateuser.Email;
    }
    if (updateuser.Role != null && updateuser.Role != default(UserRole))
    {
        user.Role = updateuser.Role;
    }
    try
    {
        // Save changes to the database
        await db.SaveChangesAsync();

        // Update additional fields based on user role
        if (user.Role == UserRole.Student)
        {
            // Update student-related fields
            var student = await db.Student.FirstOrDefaultAsync(s => s.UserID == user.Id);
            if (student != null)
            {
                student.StudentNumber = updateuser.Student.StudentNumber;
                student.DepartmentID = updateuser.Student.DepartmentID;
            }
        }
        else if (user.Role == UserRole.Teacher)
        {
            // Update teacher-related fields
            var teacher = await db.Teacher.FirstOrDefaultAsync(t => t.UserID == user.Id);
            if (teacher != null)
            {
                teacher.DepartmentID = updateuser.Teacher.DepartmentID;
            }
        }

        // Save additional changes to the database
        await db.SaveChangesAsync();

        Results.NoContent();
    }
    catch (DbUpdateConcurrencyException)
    {
        // Handle concurrency conflict
        Results.Conflict("Concurrency conflict. Please refresh and try again.");
    }
    catch (Exception ex)
    {
        // Log and handle other exceptions
        Console.WriteLine($"Error updating user: {ex.Message}");
        
    }
});


app.MapDelete("/user/{id}", async (GrammateiaDb db, int id) =>
{
   var user = await db.User.FindAsync(id);
   if (user is null)
   {
      return Results.NotFound();
   }
   db.User.Remove(user);
   await db.SaveChangesAsync();
   return Results.Ok();
});

// Teachers //

app.MapGet("/teachers", async (GrammateiaDb db) => 
{
    var teachers = await db.Teacher
        .Include(s => s.Department)
        .Include(s => s.User)
        .Select(s => new
        {
            s.TeacherID,
            s.UserID,
            s.DepartmentID,
            s.Department,
            User = new
            {
                s.User.Name,
                s.User.Username,
                s.User.Email,
                s.User.Role
            }
        })
        .ToListAsync();

    return teachers;
});

// Student //

app.MapGet("/students", async (GrammateiaDb db) => 
{
    var students = await db.Student
        .Include(s => s.Department)
        .Include(s => s.User)
        .Select(s => new
        {
            s.StudentID,
            s.StudentNumber,
            s.RegistrationDate,
            s.DepartmentID,
            s.Department,
            // s.UserID,
            User = new
            {
                s.User.Name,
                s.User.Username,
                s.User.Email,
                s.User.Role
            }
        })
        .ToListAsync();

    return students;
});

app.MapGet("/student/{studentId}", async (GrammateiaDb db, int studentId) => 
{
    var student = await db.Student
        .Include(s => s.Department)
        .Include(s => s.User)
        .Where(s => s.StudentID == studentId)
        .Select(s => new
        {
            s.StudentID,
            s.StudentNumber,
            s.RegistrationDate,
            s.DepartmentID,
            s.Department,
            User = new
            {
                s.User.Name,
                s.User.Username,
                s.User.Email,
                s.User.Role
            }
        })
        .FirstOrDefaultAsync();

    if (student == null)
    {
        // Return a 404 Not Found response if the student is not found
       Results.NotFound();
    }

    return student;
});


// Login //

app.MapPost("/login", async (GrammateiaDb db, [FromBody] LoginRequest loginRequest, IHttpContextAccessor httpContextAccessor) =>
{
    var user = await db.User.FirstOrDefaultAsync(u => u.Username == loginRequest.Username);

    if (user == null || !user.ValidateCredentials(loginRequest.Username, loginRequest.Password))
    {
        return Results.Unauthorized();
    }
    else
    {
        // Generate a token
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = new byte[32]; // 256 bits // strong secret key
        using (var rng = new RNGCryptoServiceProvider())
        {
            rng.GetBytes(key);
        }

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Role, user.Role.ToString())
            }),
            Expires = DateTime.UtcNow.AddHours(1), // Set the token expiration time
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);

        // Set the token as an HTTP-only cookie
        httpContextAccessor.HttpContext.Response.Cookies.Append("authToken", tokenHandler.WriteToken(token), new CookieOptions
        {
            HttpOnly = true,
            SameSite = SameSiteMode.None, 
            Secure = true
        });

        // var responseData = new
        // {
        //     user.Role
        // };

        return Results.Ok(new { authToken = tokenHandler.WriteToken(token) });
    }
}).WithMetadata(new HttpMethodMetadata(new[] { "POST" }));

// Grades //

app.MapGet("/grade", async (GrammateiaDb db) => 
{
    var grades = await db.Grade
    .Include(g => g.Course)
    .Include(g => g.Student)
    .ToListAsync();
    return grades;
});

app.MapGet("/grade/{id}", async (GrammateiaDb db, int id) =>
{
    var grade = await db.Grade
    .Include(g => g.Course)
    .Include(g => g.Student)
    .FirstOrDefaultAsync(g => g.Id == id);

    return grade;
}); 

app.MapPost("/grades", async (GrammateiaDb db, Grades grade) =>
{

  await db.Grade.AddAsync(grade);
  await db.SaveChangesAsync();
  return Results.Created($"/grades/{grade.Id}", grade);

});

app.MapPut("grade/{id}", async (GrammateiaDb db, Grades updateGrade, int id) =>
{
    
    // Fetch the existing department from the database
    var existingGrade = await db.Grade.FindAsync(id);

    // Check if the course with the given ID exists
    if (existingGrade == null)
    {
        return Results.NotFound();
    }

    // Update only the properties that are provided in the request
    if (updateGrade.Grade != null)
    {
        existingGrade.Grade = updateGrade.Grade;
    }

    if (updateGrade.StudentID != default)
    {
        existingGrade.StudentID = updateGrade.StudentID;
    }

    if (updateGrade.CourseID != default)
    {
        existingGrade.CourseID = updateGrade.CourseID;
    }

    if (updateGrade.Exam != null)
    {
        existingGrade.Exam = updateGrade.Exam;
    }

    await db.SaveChangesAsync();

    return Results.Ok(existingGrade);
});

app.MapDelete("/grade/{id}", async (GrammateiaDb db, int id) =>
{
   var grade = await db.Grade.FindAsync(id);
   if (grade is null)
   {
      return Results.NotFound();
   }
   db.Grade.Remove(grade);
   await db.SaveChangesAsync();
   return Results.Ok();
});

// Registration //

app.MapGet("/registration", async (GrammateiaDb db) => 
{
    var registration = await db.Registration
    .Include(r => r.Course)
    .Include(r => r.Student)
    .ToListAsync();
    return registration;
});

// get registration by Student
app.MapGet("/registration/{id}", async (GrammateiaDb db, int id) =>
{
    var registration = await db.Registration
    .Include(r => r.Course)
    .Include(r => r.Student)
    .Where(r => r.StudentID == id)
    .ToListAsync();

    return registration;
}); 

app.MapPost("/registration", async (GrammateiaDb db, Registration registration) =>
{

  registration.RegDate = DateTime.UtcNow;

  await db.Registration.AddAsync(registration);
  await db.SaveChangesAsync();
  return Results.Created($"/registration/{registration.RegId}", registration);

});

app.MapPut("/registration/{id}", async (GrammateiaDb db, int id, Registration updatedRegistration) =>
{
    // Find the existing registration by ID
    var existingRegistration = await db.Registration.FindAsync(id);

    // If the registration with the specified ID is not found, return a 404 Not Found response
    if (existingRegistration == null)
    {
        return Results.NotFound($"Registration with ID {id} not found");
    }

    // Update the properties of the existing registration with values from the updatedRegistration object
    
    
    
    if (updatedRegistration.StudentID != 0)
    {
        existingRegistration.StudentID = updatedRegistration.StudentID;
    }

    if (updatedRegistration.CourseID != 0)
    {
        existingRegistration.CourseID = updatedRegistration.CourseID;
    }

    // Save changes to the database asynchronously
    await db.SaveChangesAsync();

    // Return a response indicating successful update
    return Results.NoContent();
});


app.MapDelete("/registration/{id}", async (GrammateiaDb db, int id) =>
{
   var registration = await db.Registration.FindAsync(id);
   if (registration is null)
   {
      return Results.NotFound();
   }
   db.Registration.Remove(registration);
   await db.SaveChangesAsync();
   return Results.Ok();
});


app.UseCors(MyAllowSpecificOrigins);

app.Run();
