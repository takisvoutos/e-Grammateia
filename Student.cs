using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace e_Grammateia.Models;

public class Student
{
    [Key]
    public int StudentID { get; set; }
    [ForeignKey("User")]
    public int UserID { get; set; }
    public User User { get; set; }

    public string? StudentNumber { get; set; }
    public DateTime? RegistrationDate { get; set; }
    [ForeignKey("Department")]
    public int DepartmentID { get; set; }
    public Department Department { get; set; }
}