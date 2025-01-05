using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using StudentManagement.Data;
using StudentManagement.Models;
using System;
using System.Linq;

namespace StudentManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NoticeController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<NoticeController> _logger;

        public NoticeController(AppDbContext context, ILogger<NoticeController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // Get all notices
        [HttpGet]
        public IActionResult GetAllNotices()
        {
            try
            {
                var notices = _context.Notices.ToList();
                return Ok(notices);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching notices: {ex.Message}");
                return StatusCode(500, new { message = "An error occurred while fetching notices.", statusCode = 500 });
            }
        }

        // Get notices by course
        [HttpGet("{course}")]
        public IActionResult GetNoticesByCourse(string course)
        {
            try
            {
                var notices = _context.Notices.Where(n => n.Course == course).ToList();
                if (!notices.Any())
                {
                    return NotFound(new { message = "No notices found for the specified course.", statusCode = 404 });
                }
                return Ok(notices);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching notices by course: {ex.Message}");
                return StatusCode(500, new { message = "An error occurred while fetching notices by course.", statusCode = 500 });
            }
        }

        // Create a new notice
        [HttpPost]
        public IActionResult CreateNotice([FromBody] Notice notice)
        {
            if (notice == null)
            {
                return BadRequest(new { message = "Notice data is required.", statusCode = 400 });
            }

            if (string.IsNullOrWhiteSpace(notice.Course) ||
                string.IsNullOrWhiteSpace(notice.Content) ||
                string.IsNullOrWhiteSpace(notice.Venue) ||
                notice.ClassDate == default ||
                notice.ClassTime == default)
            {
                return BadRequest(new
                {
                    message = "All fields (Course, Content, ClassDate, ClassTime, Venue) are required.",
                    statusCode = 400
                });
            }

            notice.CreatedAt = DateTime.UtcNow;

            try
            {
                _context.Notices.Add(notice);
                _context.SaveChanges();
                return Ok(new { message = "Notice created successfully.", statusCode = 200 });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error saving notice: {ex.Message}");
                return StatusCode(500, new { message = "An error occurred while saving the notice.", statusCode = 500 });
            }
        }

        // Update an existing notice
        [HttpPut("{id}")]
        public IActionResult UpdateNotice(int id, [FromBody] Notice updatedNotice)
        {
            if (updatedNotice == null)
            {
                return BadRequest(new { message = "Invalid notice data.", statusCode = 400 });
            }

            var notice = _context.Notices.FirstOrDefault(n => n.Id == id);
            if (notice == null)
            {
                return NotFound(new { message = "Notice not found.", statusCode = 404 });
            }

            notice.Course = updatedNotice.Course;
            notice.Content = updatedNotice.Content;
            notice.Venue = updatedNotice.Venue;
            notice.ClassDate = updatedNotice.ClassDate;
            notice.ClassTime = updatedNotice.ClassTime;

            try
            {
                _context.SaveChanges();
                return Ok(new { message = "Notice updated successfully.", statusCode = 200 });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating notice: {ex.Message}");
                return StatusCode(500, new { message = "An error occurred while updating the notice.", statusCode = 500 });
            }
        }

        // Delete a notice
        [HttpDelete("{id}")]
        public IActionResult DeleteNotice(int id)
        {
            var notice = _context.Notices.FirstOrDefault(n => n.Id == id);
            if (notice == null)
            {
                return NotFound(new { message = "Notice not found.", statusCode = 404 });
            }

            try
            {
                _context.Notices.Remove(notice);
                _context.SaveChanges();
                return Ok(new { message = "Notice deleted successfully.", statusCode = 200 });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error deleting notice: {ex.Message}");
                return StatusCode(500, new { message = "An error occurred while deleting the notice.", statusCode = 500 });
            }
        }
    }
}
