using Microsoft.AspNetCore.Mvc;
using StudentManagement.Data;
using StudentManagement.Models;
using System;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;

    public AuthController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("signup")]
    public IActionResult Signup([FromBody] Student student)
    {
        // Validate required fields
        if (string.IsNullOrWhiteSpace(student.Name) ||
            string.IsNullOrWhiteSpace(student.Email) ||
            string.IsNullOrWhiteSpace(student.Password) ||
            string.IsNullOrWhiteSpace(student.DesiredCourse))
        {
            return BadRequest(new
            {
                message = "All fields (Name, Email, Password, DesiredCourse) are required.",
                statusCode = 400
            });
        }

        // Normalize and trim inputs
        student.Name = student.Name.Trim();
        student.Email = student.Email.Trim().ToLower();
        student.DesiredCourse = student.DesiredCourse.Trim();

        Console.WriteLine($"Signup Request: Name: {student.Name}, Email: {student.Email}, Course: {student.DesiredCourse}");

        // Check if email already exists
        if (_context.Students.Any(s => s.Email == student.Email))
        {
            return BadRequest(new
            {
                message = "Email already exists.",
                statusCode = 400
            });
        }

        // Hash the password before saving
        student.Password = HashPassword(student.Password);

        // Assign default role as "Student"
        student.Role = "Student";

        // Add student to the database
        try
        {
            _context.Students.Add(student);
            _context.SaveChanges();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error saving student: {ex.Message}");
            return StatusCode(500, new
            {
                message = "An error occurred while saving the student.",
                statusCode = 500
            });
        }

        return Ok(new
        {
            message = "Student registered successfully.",
            statusCode = 200
        });
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest loginRequest)
    {
        if (string.IsNullOrWhiteSpace(loginRequest.Email) || string.IsNullOrWhiteSpace(loginRequest.Password))
        {
            return BadRequest(new
            {
                message = "Email and Password are required.",
                statusCode = 400
            });
        }

        var hashedPassword = HashPassword(loginRequest.Password);
        var student = _context.Students
            .FirstOrDefault(s => s.Email == loginRequest.Email && s.Password == hashedPassword);

        if (student == null)
        {
            return Unauthorized(new
            {
                message = "Invalid credentials.",
                statusCode = 401
            });
        }

        return Ok(new
        {
            message = "Login successful.",
            statusCode = 200,
            user = new
            {
                student.Id,
                student.Name,
                student.Email,
                student.Role,
                student.DesiredCourse
            }
        });
    }

    // Helper method to hash passwords using SHA256
    private string HashPassword(string password)
    {
        using (var sha256 = SHA256.Create())
        {
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }
    }
}
