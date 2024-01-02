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
using iText.Kernel.Pdf;
using iText.Layout;
using iText.Layout.Element;
using iText.Kernel.Font;
using iText.IO.Font;
using iText.Layout.Properties;
using iText.IO.Image;
using iText.Kernel.Colors;
using Microsoft.Extensions.FileProviders;
using Org.BouncyCastle.Asn1.Ocsp;
using System.IO;
using System.Net;
using System.Net.Mail;

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

// Configure static file serving for the 'docs' directory
        app.UseStaticFiles(new StaticFileOptions
        {
            FileProvider = new PhysicalFileProvider(
                Path.Combine(Directory.GetCurrentDirectory(), "docs")),
            RequestPath = "/docs" // Adjust as needed
        });

// Email New Grade //

static void SendEmail(string toEmail, string courseName)
{
    string fromMail = "edusecretary587@gmail.com";
    string fromPassword = "nifdjiunnpbgfldl";

    MailMessage message = new MailMessage();
    message.From = new MailAddress(fromMail, "EduSecretary");
    message.Subject = "Νέος Βαθμός";
    message.To.Add(new MailAddress(toEmail));
    message.Body = $"<html><body> Προστέθηκε ένας νέος βαθμός για το μάθημα <b>{courseName}</b>. </body></html>";
    message.IsBodyHtml = true;

    var smtpClient = new SmtpClient("smtp.gmail.com")
    {
        Port = 587, 
        Credentials = new NetworkCredential(fromMail, fromPassword),
        EnableSsl = true,
    };

    smtpClient.Send(message);
}

app.MapGet("/send-email/{studentId}/{courseId}", async (GrammateiaDb db, IHttpContextAccessor httpContextAccessor, int studentId, int courseId) =>
{
    try
    {
        var userEmail = await db.Student
            .Where(s => s.StudentID == studentId)
            .Join(db.User, student => student.UserID, user => user.Id, (student, user) => user.Email)
            .FirstOrDefaultAsync();

        if (userEmail == null)
        {
            return "User not found!";
        }

        var courseName = await db.Course
            .Where(c => c.Id == courseId)
            .Select(c => c.Name)
            .FirstOrDefaultAsync();

        if (courseName == null)
        {
            return "Course not found!";
        }

        // Call the email function
        SendEmail(userEmail,courseName);

        return "Email sent successfully!";
    }
    catch (Exception ex)
    {
        // Log the exception or handle it appropriately
        return $"Error sending email: {ex.Message}";
    }
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

app.MapGet("/courses/byDepartment/{departmentID}", async (GrammateiaDb db, int departmentID) => 
{
    // Fetch the courses based on the department ID, including the associated department and Teacher
    var course = await db.Course
        .Include(c => c.Department)
        .Include(c => c.Teacher)
        .Where(c => c.DepartmentID == departmentID)
        .ToListAsync();

    return course;
});

app.MapGet("/courses/registration/{departmentID}", async (GrammateiaDb db, int departmentID) => 
{
    DateTime currentDate = DateTime.Now;
    int currentMonth = currentDate.Month;

    List<Course> courses;

    if (currentMonth >= 1 && currentMonth <= 8)
    {
        courses = await db.Course
        .Include(c => c.Department)
        .Include(c => c.Teacher)
        .Where(c => c.DepartmentID == departmentID && c.Semester % 2 == 0)
        .ToListAsync();
    }
    else if (currentMonth >= 9 && currentMonth <= 12)
    {
        courses = await db.Course
        .Include(c => c.Department)
        .Include(c => c.Teacher)
        .Where(c => c.DepartmentID == departmentID && c.Semester % 2 != 0)
        .ToListAsync();
    }
    else
    {
        // Handle the case where currentMonth is not within expected ranges
        courses = new List<Course>();
    }

    return courses;
});


app.MapGet("/courses/teacher/{teacherID}", async (GrammateiaDb db, int teacherID) => 
{
    // Fetch the courses based on the teacher ID, including the associated department and Teacher
    var course = await db.Course
        .Include(c => c.Department)
        .Include(c => c.Teacher)
        .Where(c => c.TeacherID == teacherID)
        .ToListAsync();

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
            StudentNumber = user.Role == UserRole.Student ? user.Student.StudentNumber : null,
            Department = user.Role == UserRole.Student
                ? user.Student.Department
                : (user.Role == UserRole.Teacher
                    ? user.Teacher.Department
                    : (user.Role == UserRole.Admin
                        ? user.Secretary.Department
                        : null)),
        })
        .ToListAsync();

    return usersData;
});

app.MapGet("/users/{departmentId}", async (GrammateiaDb db, int departmentId) =>
{
    var usersData = await db.User
        .Where(user => user.Role == UserRole.Student && user.Student.DepartmentID == departmentId ||
                       user.Role == UserRole.Teacher && user.Teacher.DepartmentID == departmentId )
        .Select(user => new
        {
            user.Id,
            user.Name,
            user.Username,
            user.Email,
            user.Role,
            StudentNumber = user.Role == UserRole.Student ? user.Student.StudentNumber : null,
            Department = user.Role == UserRole.Student
                ? user.Student.Department
                : (user.Role == UserRole.Teacher
                    ? user.Teacher.Department
                    : null),
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

app.MapGet("/teachers/{departmentID}", async (GrammateiaDb db, int departmentID) => 
{
    var teachersInDepartment = await db.Teacher
        .Include(s => s.Department)
        .Include(s => s.User)
        .Where(s => s.DepartmentID == departmentID)
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

    return teachersInDepartment;
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

app.MapGet("/students/{departmentID}", async (GrammateiaDb db, int departmentID) => 
{
    var students = await db.Student
        .Include(s => s.Department)
        .Include(s => s.User)
        .Where(s => s.DepartmentID == departmentID)
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
    var user = await db.User
    .Include(u => u.Student)
        .ThenInclude(s => s.Department)
    .Include(u => u.Teacher)
        .ThenInclude(t => t.Department)
    .Include(u => u.Secretary)
        .ThenInclude(s => s.Department)
    .FirstOrDefaultAsync(u => u.Username == loginRequest.Username);

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

        // Retrieve the department based on the user's role
        var departmentName = user.Role switch
        {
            UserRole.Student => user.Student?.Department?.Name,
            UserRole.Teacher => user.Teacher?.Department?.Name,
            UserRole.Admin => user.Secretary?.Department?.Name,
            _ => null 
        };

        var departmentID = user.Role switch
        {
            UserRole.Student => user.Student?.Department?.Id,
            UserRole.Teacher => user.Teacher?.Department?.Id,
            UserRole.Admin => user.Secretary?.Department?.Id,
            _ => null 
        };

        int? teacherID = null;
        int? studentID = null;

        switch (user.Role)
        {
            case UserRole.Teacher:
                teacherID = user.Teacher?.TeacherID;
                break;
            case UserRole.Student:
                studentID = user.Student?.StudentID;
                break;
        }

        object response;

        if (teacherID.HasValue)
        {
            response = new
            {
                authToken = tokenHandler.WriteToken(token),
                departmentName,
                departmentID,
                teacherID
            };
        
        }
        else if (studentID.HasValue)
        {
            response = new
            {
                authToken = tokenHandler.WriteToken(token),
                departmentName,
                departmentID,
                studentID
            };
        }
        else
        {
            response = new
            {
                authToken = tokenHandler.WriteToken(token),
                departmentName,
                departmentID
            };
        }

        

        return Results.Ok(response);
    }
}).WithMetadata(new HttpMethodMetadata(new[] { "POST" }));

// Grades //

app.MapGet("/grade", async (GrammateiaDb db) => 
{
    var grades = await db.Grade
    .Include(g => g.Course)
    .Include(g => g.Student)
    .Include(g => g.Teacher)
    .ToListAsync();
    return grades;
});

app.MapGet("/grade/teacher/{id}", async (GrammateiaDb db, int id) => 
{
    var grades = await db.Grade
        .Include(g => g.Course)
        .Include(g => g.Student)
        .Include(g => g.Teacher)
        .Where(g => g.TeacherID == id)
        .ToListAsync();

    return grades;
});

app.MapGet("/grade/student/{id}", async (GrammateiaDb db, int id) => 
{
    var grades = await db.Grade
        .Include(g => g.Course)
        .Include(g => g.Student)
        .Include(g => g.Teacher)
        .Where(g => g.StudentID == id)
        .ToListAsync();

    return grades;
});

app.MapGet("/grade/student/{id}/pdf", async (HttpContext context, GrammateiaDb db, int id) => 
{
    var grades = await db.Grade
    .Include(g => g.Course)
    .Include(g => g.Student)
    .Where(g => g.StudentID == id && g.Grade >= 5)
    .Select(g => new
    {
        g.Id,
        g.Grade,
        g.Student.StudentNumber,
        StudentName = g.Student.User.Name, 
        Course = new
        {
            g.Course.Id,
            g.Course.Name,
            g.Course.Semester,
            g.Course.Course_Type,
            g.Course.ECTS,
        },
        g.Exam
    })
    .ToListAsync();

    string pdfDirectory = "./docs";

    // Create a PDF document
    var pdfPath = Path.Combine(pdfDirectory, $"grades_{id}.pdf");

    using (var writer = new PdfWriter(pdfPath))
    {
        var pdf = new PdfDocument(writer);
        var document = new Document(pdf);

        // Specify the path to a font file that supports Greek characters
        string fontPath = "arial-unicode-ms.ttf";
        PdfFont font = PdfFontFactory.CreateFont(fontPath, PdfEncodings.IDENTITY_H);
  
        // Add an image to the document
        string imagePath = "./e-GrammateiaClient/public/logo-login.png";
        Image image = new Image(ImageDataFactory.Create(imagePath))
            .SetWidth(150);

        document.Add(image);

        // Add a title to the document
        document.Add(new Paragraph("Πιστοποιητικό Αναλυτικής Βαθμολογία")
            .SetFont(font)
            .SetFontSize(16)
            .SetTextAlignment(TextAlignment.CENTER));

        // Add the student's name to the document
        document.Add(new Paragraph($"Όνομα Φοιτητή: {grades.FirstOrDefault()?.StudentName}")
            .SetFont(font));

        document.Add(new Paragraph($"Αρ. Μητρώου: {grades.FirstOrDefault()?.StudentNumber}")
            .SetFont(font));

        // Add the current date
        string currentDate = DateTime.Now.ToString("dd/MM/yyyy");
        document.Add(new Paragraph($"Ημερομηνία: {currentDate}")
            .SetFont(font)
            .SetTextAlignment(TextAlignment.LEFT));

        // Add a line break
        document.Add(new Paragraph());

        // Group grades by semester
        var gradesBySemester = grades
            .GroupBy(g => g.Course.Semester)
            .OrderBy(g => g.Key);

        foreach (var semesterGroup in gradesBySemester)
        {
            // Add a header for the semester
            document.Add(new Paragraph($"Εξάμηνο {semesterGroup.Key}")
                .SetFont(font)
                .SetFontSize(14)
                .SetBold()
                .SetTextAlignment(TextAlignment.LEFT));

            // Add a line break
            document.Add(new Paragraph());

            var table = new Table(5);

            // Set the font for the table cells
            table.SetFont(font);

            // Add table headers
            table.AddHeaderCell(CreateHeaderCell("Μάθημα", font));
            table.AddHeaderCell(CreateHeaderCell("Βαθμός", font));
            table.AddHeaderCell(CreateHeaderCell("Τύπος Μαθήματος", font));
            table.AddHeaderCell(CreateHeaderCell("ECTS", font));
            table.AddHeaderCell(CreateHeaderCell("Εξεταστική", font));

            Cell CreateHeaderCell(string text, PdfFont font)
            {
                return new Cell()
                    .Add(new Paragraph(text).SetFont(font).SetBold())
                    .SetBackgroundColor(ColorConstants.LIGHT_GRAY);
            }

            foreach (var grade in semesterGroup)
            {
                // Add table data
                table.AddCell(new Cell().Add(new Paragraph($"{grade.Course?.Name ?? "N/A"}")));
                table.AddCell(new Cell().Add(new Paragraph($"{grade.Grade}")));
                table.AddCell(new Cell().Add(new Paragraph($"{grade.Course?.Course_Type ?? "N/A"}")));
                table.AddCell(new Cell().Add(new Paragraph($"{grade.Course?.ECTS}")));
                table.AddCell(new Cell().Add(new Paragraph($"{grade.Exam}")));
            }

            document.Add(table);

            document.Add(new Paragraph()); // Add a line break
        }
        document.Close();
    }

    // Construct and return the URL
    var baseUrl = $"{context.Request.Scheme}://{context.Request.Host}";
    var pdfURL = new Uri(new Uri(baseUrl), pdfPath).ToString();
    return pdfURL;
});

app.MapGet("/pdf/{id}", async (HttpContext context, GrammateiaDb db, int id) => 
{
    string pdfDirectory = "./docs";
    var pdfFileName = $"grades_{id}.pdf";
    var pdfPath = Path.Combine(pdfDirectory, pdfFileName);

    if (System.IO.File.Exists(pdfPath))
    {
        var pdfUrl = $"{context.Request.Scheme}://{context.Request.Host}/docs/{pdfFileName}";
        return Results.Ok(pdfUrl);
    }
    else
    {
        return Results.NotFound("PDF not found");
    }
});



app.MapGet("/grade/{id}", async (GrammateiaDb db, int id) =>
{
    var grade = await db.Grade
    .Include(g => g.Course)
    .Include(g => g.Student)
    .Include(g => g.Teacher)
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

    if (updateGrade.TeacherID != null)
    {
        existingGrade.TeacherID = updateGrade.TeacherID;
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

// get registration by Student with grades
app.MapGet("/registration/grade/{id}", async (GrammateiaDb db, int id) =>
{
    var registrationWithGrades = await db.Registration
        .Include(r => r.Course)
        .Include(r => r.Student)
        .Select(r => new
        {
            Registration = r,
            Grades = db.Grade
                .Where(g => g.CourseID == r.CourseID && g.StudentID == r.StudentID)
                .ToList()
        })
        .Where(r => r.Registration.StudentID == id)
        .ToListAsync();

    return registrationWithGrades;
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
