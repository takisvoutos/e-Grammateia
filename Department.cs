using System.ComponentModel.DataAnnotations;

namespace e_Grammateia.Models;

    public class Department
    { 
          [Key]
          public int Id { get; set; }
          [Required]
          public string? Name { get; set; }
          [Required]
          public string? School { get; set; }

    }