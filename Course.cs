using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace e_Grammateia.Models;

 public class Course
    { 
          [Key]
          public int Id { get; set; }
          [Required]
          public string Name { get; set; }
          [Required]
          public int Semester { get; set; }
          [Required]
          [ForeignKey("Department")]
          public int DepartmentID { get; set; }
          public Department Department { get; set; }
          [Required]
          public int ECTS { get; set; }
          [Required]
          public string Course_Type { get; set; }
          [Required]
          [ForeignKey("Teacher")]
           public int TeacherID { get; set; }
           public Teacher Teacher { get; set; }
      
    }