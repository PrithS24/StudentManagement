import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminPage = () => {
    const [students, setStudents] = useState([]);
    const [notices, setNotices] = useState([]);
    const [studentFormData, setStudentFormData] = useState({
        id: "",
        name: "",
        email: "",
        desiredCourse: "",
    });
    const [noticeFormData, setNoticeFormData] = useState({
        course: "",
        content: "",
        date: "",
        time: "",
        venue: "",
    });
    const [isEditingStudent, setIsEditingStudent] = useState(false);
    const [studentMessage, setStudentMessage] = useState("");
    const [noticeMessage, setNoticeMessage] = useState("");
    const courses = ["Full-Stack", "Mobile-App", "DevOps", "Machine Learning"];

    // Fetch all students and notices
    useEffect(() => {
        fetchStudents();
        fetchNotices();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await axios.get("https://localhost:7005/api/students");
            setStudents(response.data);
        } catch (error) {
            console.error("Error fetching students:", error);
        }
    };

    const fetchNotices = async () => {
        try {
            const response = await axios.get("https://localhost:7005/api/notices");
            setNotices(response.data);
        } catch (error) {
            console.error("Error fetching notices:", error);
        }
    };

    const handleStudentChange = (e) => {
        setStudentFormData({ ...studentFormData, [e.target.name]: e.target.value });
    };

    const handleNoticeChange = (e) => {
        setNoticeFormData({ ...noticeFormData, [e.target.name]: e.target.value });
    };

    const handleStudentSubmit = async (e) => {
        e.preventDefault();

        if (isEditingStudent) {
            try {
                await axios.put(`https://localhost:7005/api/students/${studentFormData.id}`, studentFormData);
                setStudentMessage("Student updated successfully.");
                fetchStudents();
                resetStudentForm();
            } catch (error) {
                setStudentMessage("Error updating student.");
            }
        } else {
            try {
                await axios.post("https://localhost:7005/api/students", studentFormData);
                setStudentMessage("Student added successfully.");
                fetchStudents();
                resetStudentForm();
            } catch (error) {
                setStudentMessage("Error adding student.");
            }
        }
    };

    const handleNoticeSubmit = async (e) => {
        e.preventDefault();
        try {
            // Updated URL to match the backend route
            await axios.post("https://localhost:7005/api/notice", noticeFormData);
            setNoticeMessage("Notice created successfully.");
            fetchNotices();
            resetNoticeForm();
        } catch (error) {
            setNoticeMessage("Error creating notice.");
        }
    };

    const handleStudentEdit = (student) => {
        setIsEditingStudent(true);
        setStudentFormData(student);
    };

    const handleStudentDelete = async (id) => {
        try {
            await axios.delete(`https://localhost:7005/api/students/${id}`);
            setStudentMessage("Student deleted successfully.");
            fetchStudents();
        } catch (error) {
            setStudentMessage("Error deleting student.");
        }
    };

    const resetStudentForm = () => {
        setIsEditingStudent(false);
        setStudentFormData({ id: "", name: "", email: "", desiredCourse: "" });
    };

    const resetNoticeForm = () => {
        setNoticeFormData({ course: "", content: "", date: "", time: "", venue: "" });
    };

    const styles = {
        container: {
            padding: "20px",
            maxWidth: "900px",
            margin: "0 auto",
        },
        heading: {
            textAlign: "center",
            marginBottom: "20px",
        },
        form: {
            marginBottom: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
        },
        input: {
            padding: "10px",
            fontSize: "16px",
        },
        select: {
            padding: "10px",
            fontSize: "16px",
        },
        button: {
            padding: "10px",
            fontSize: "16px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
        },
        submitButton: {
            backgroundColor: "#007BFF",
            color: "white",
        },
        cancelButton: {
            backgroundColor: "red",
            color: "white",
        },
        message: {
            color: "green",
        },
        table: {
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "20px",
        },
        th: {
            backgroundColor: "#f0f0f0",
            padding: "10px",
            border: "1px solid #ccc",
        },
        td: {
            padding: "10px",
            border: "1px solid #ccc",
        },
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Admin Dashboard</h2>

            {/* Student Management */}
            <div>
                <h3>{isEditingStudent ? "Edit Student" : "Add Student"}</h3>
                <form onSubmit={handleStudentSubmit} style={styles.form}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={studentFormData.name}
                        onChange={handleStudentChange}
                        required
                        style={styles.input}
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={studentFormData.email}
                        onChange={handleStudentChange}
                        required
                        style={styles.input}
                    />
                    <select
                        name="desiredCourse"
                        value={studentFormData.desiredCourse}
                        onChange={handleStudentChange}
                        required
                        style={styles.select}
                    >
                        <option value="">Select Course</option>
                        {courses.map((course, index) => (
                            <option key={index} value={course}>
                                {course}
                            </option>
                        ))}
                    </select>
                    <button type="submit" style={{ ...styles.button, ...styles.submitButton }}>
                        {isEditingStudent ? "Update Student" : "Add Student"}
                    </button>
                    {isEditingStudent && (
                        <button
                            type="button"
                            onClick={resetStudentForm}
                            style={{ ...styles.button, ...styles.cancelButton }}
                        >
                            Cancel
                        </button>
                    )}
                </form>
                {studentMessage && <p style={styles.message}>{studentMessage}</p>}
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Name</th>
                            <th style={styles.th}>Email</th>
                            <th style={styles.th}>Course</th>
                            <th style={styles.th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                            <tr key={student.id}>
                                <td style={styles.td}>{student.name}</td>
                                <td style={styles.td}>{student.email}</td>
                                <td style={styles.td}>{student.desiredCourse}</td>
                                <td style={styles.td}>
                                    <button
                                        onClick={() => handleStudentEdit(student)}
                                        style={styles.button}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleStudentDelete(student.id)}
                                        style={{ ...styles.button, ...styles.cancelButton }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Notice Management */}
            <div>
                <h3>Create Notice</h3>
                <form onSubmit={handleNoticeSubmit} style={styles.form}>
                    <select
                        name="course"
                        value={noticeFormData.course}
                        onChange={handleNoticeChange}
                        required
                        style={styles.select}
                    >
                        <option value="">Select Course</option>
                        {courses.map((course, index) => (
                            <option key={index} value={course}>
                                {course}
                            </option>
                        ))}
                    </select>
                    <textarea
                        name="content"
                        placeholder="Notice Content"
                        value={noticeFormData.content}
                        onChange={handleNoticeChange}
                        required
                        style={styles.input}
                    />
                    <input
                        type="date"
                        name="date"
                        value={noticeFormData.date}
                        onChange={handleNoticeChange}
                        required
                        style={styles.input}
                    />
                    <input
                        type="time"
                        name="time"
                        value={noticeFormData.time}
                        onChange={handleNoticeChange}
                        required
                        style={styles.input}
                    />
                    <input
                        type="text"
                        name="venue"
                        placeholder="Venue"
                        value={noticeFormData.venue}
                        onChange={handleNoticeChange}
                        required
                        style={styles.input}
                    />
                    <button type="submit" style={{ ...styles.button, ...styles.submitButton }}>
                        Create Notice
                    </button>
                </form>
                {noticeMessage && <p style={styles.message}>{noticeMessage}</p>}
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Course</th>
                            <th style={styles.th}>Content</th>
                            <th style={styles.th}>Date</th>
                            <th style={styles.th}>Time</th>
                            <th style={styles.th}>Venue</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notices.map((notice) => (
                            <tr key={notice.id}>
                                <td style={styles.td}>{notice.course}</td>
                                <td style={styles.td}>{notice.content}</td>
                                <td style={styles.td}>{notice.date}</td>
                                <td style={styles.td}>{notice.time}</td>
                                <td style={styles.td}>{notice.venue}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPage;
