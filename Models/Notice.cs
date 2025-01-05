public class Notice
{
    public int Id { get; set; }
    public string Course { get; set; }
    public string Content { get; set; }
    public DateTime ClassDate { get; set; } // Maps to "classdate"
    public TimeSpan ClassTime { get; set; } // Maps to "classtime"
    public string Venue { get; set; }
    public DateTime CreatedAt { get; set; } // Maps to "createdat"
}
