using Microsoft.AspNetCore.Mvc;
using StudentManagement.Data;
using StudentManagement.Models;

[ApiController]
[Route("api/[controller]")]
public class StudentController : ControllerBase
{
    private readonly AppDbContext _context;

    public StudentController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult GetAllStudents()
    {
        var students = _context.Students.ToList();
        return Ok(students);
    }

    [HttpPut("{id}")]
    public IActionResult UpdateStudent(int id, [FromBody] Student updatedStudent)
    {
        if (updatedStudent == null)
            return BadRequest(new { message = "Invalid student data.", statusCode = 400 });

        var student = _context.Students.FirstOrDefault(s => s.Id == id);
        if (student == null)
            return NotFound(new { message = "Student not found.", statusCode = 404 });

        student.Name = updatedStudent.Name;
        student.DesiredCourse = updatedStudent.DesiredCourse;
        _context.SaveChanges();

        return Ok(new { message = "Student updated successfully.", statusCode = 200 });
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteStudent(int id)
    {
        var student = _context.Students.FirstOrDefault(s => s.Id == id);
        if (student == null)
            return NotFound(new { message = "Student not found.", statusCode = 404 });

        _context.Students.Remove(student);
        _context.SaveChanges();
        return Ok(new { message = "Student deleted successfully.", statusCode = 200 });
    }
}
