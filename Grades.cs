using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace e_Grammateia.Models;

    public class Grades
    { 
          [Key]
          public int Id { get; set; }
          [Required]
          [Range(0, 10, ErrorMessage = "Grade must be between 0 and 10.")]
          public decimal? Grade { get; set; }

          [Required]
          [ForeignKey("Student")]
          public int StudentID { get; set; }
          public Student Student { get; set; }
          [Required]
          [ForeignKey("Course")]
          public int CourseID { get; set; }
          public Course Course { get; set; }
          public string Exam { get; set; }
          [Required]
          [ForeignKey("Teacher")]
           public int TeacherID { get; set; }
           public Teacher Teacher { get; set; }


    }