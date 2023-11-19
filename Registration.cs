using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace e_Grammateia.Models;

public class Registration
    { 
          [Key]
          public int RegId { get; set; }
          [Required]
          [ForeignKey("Student")]
          public int StudentID { get; set; }
          public Student Student { get; set; }
          [Required]
          [ForeignKey("Course")]
          public int CourseID { get; set; }
          public Course Course { get; set; }
          public DateTime RegDate { get; set; }


    }