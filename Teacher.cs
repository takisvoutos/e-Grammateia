using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace e_Grammateia.Models;

public class Teacher
{
    [Key]
    public int TeacherID { get; set; }
    [ForeignKey("User")]
    public int UserID { get; set; }
    public User User { get; set; }
    [ForeignKey("Department")]
    public int DepartmentID { get; set; }
    public Department Department { get; set; }
}