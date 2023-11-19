using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;
using System.Security.Cryptography;
using System.Text.Json.Serialization;

namespace e_Grammateia.Models;

    public enum UserRole
    {
        Admin,
        Teacher,
        Student
    }

    public class User
    
    {
          [Key]
          public int Id { get; set; }

          // Common user properties
          [Required]
          [RegularExpression("^[A-Za-z]+$", ErrorMessage = "Name should contain only letters.")]
          public string Name { get; set; }
          [Required]
          public string Username { get; set; }
          [Required]
          [DataType(DataType.Password)]
          public string Password { get; set; }
          [Required]
          [EmailAddress]
          public string Email { get; set; }
          [Required]
          [EnumDataType(typeof(UserRole))]
          public UserRole Role { get; set; }

            // Navigation property to link User to Student
            public Student Student { get; set; }
            public Teacher Teacher { get; set; }



        public void SetPassword(string password)
        {
            // Generate a new random salt
            byte[] salt;
            new RNGCryptoServiceProvider().GetBytes(salt = new byte[16]);

            using (var algorithm = new Rfc2898DeriveBytes(password, salt, 10000, HashAlgorithmName.SHA256))
            {
                byte[] key = algorithm.GetBytes(32); // Key length: 256 bits

                // Store the salt and key as Base64 strings
                Password = Convert.ToBase64String(salt) + "|" + Convert.ToBase64String(key);
            }
        }

          public bool ValidateCredentials(string username, string password)
          {
            // Check if the provided username matches the stored username
            if (Username != username)
            {
                return false;
            }

            // Extract salt and key from stored password
        var parts = Password.Split('|');
        var salt = Convert.FromBase64String(parts[0]);
        var key = Convert.FromBase64String(parts[1]);

        using (var algorithm = new Rfc2898DeriveBytes(password, salt, 10000, HashAlgorithmName.SHA256))
        {
            byte[] testKey = algorithm.GetBytes(32);

            // Compare the derived key with the stored key
            return TimingSafeEquals(key, testKey);
        }
          }

          private bool TimingSafeEquals(byte[] a, byte[] b)
    {
        if (a == null || b == null || a.Length != b.Length)
        {
            return false;
        }

        int result = 0;
        for (int i = 0; i < a.Length; i++)
        {
            result |= a[i] ^ b[i];
        }

        return result == 0;
    }

    }

