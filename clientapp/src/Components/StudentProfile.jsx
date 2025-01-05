import React, { useState, useEffect } from "react";
import axios from "axios";

const StudentProfile = ({ desiredCourse }) => {
    const [notices, setNotices] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const response = await axios.get(
                    `https://localhost:7005/api/notice/course/${desiredCourse}`
                );
                setNotices(response.data);
            } catch (err) {
                setError("Failed to load notices");
            }
        };

        fetchNotices();
    }, [desiredCourse]);

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Notices for {desiredCourse}</h2>
            {error && <p style={styles.error}>{error}</p>}
            {notices.length > 0 ? (
                <ul style={styles.noticeList}>
                    {notices.map((notice) => (
                        <li key={notice.id} style={styles.noticeItem}>
                            <p><strong>Notice:</strong> {notice.content}</p>
                            <p><strong>Date:</strong> {new Date(notice.date).toLocaleDateString()}</p>
                            <p><strong>Time:</strong> {notice.time}</p>
                            <p><strong>Venue:</strong> {notice.venue}</p>
                            <small>Posted on: {new Date(notice.createdAt).toLocaleString()}</small>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No notices found for this course.</p>
            )}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: "800px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#f9f9f9",
    },
    heading: {
        textAlign: "center",
        marginBottom: "20px",
        fontSize: "24px",
        color: "#333",
    },
    error: {
        color: "red",
        textAlign: "center",
        marginBottom: "20px",
    },
    noticeList: {
        listStyleType: "none",
        padding: 0,
        margin: 0,
    },
    noticeItem: {
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "15px",
        marginBottom: "15px",
        backgroundColor: "#ffffff",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    },
    noticeTitle: {
        fontSize: "18px",
        fontWeight: "bold",
        marginBottom: "10px",
        color: "#007BFF",
    },
    noticeDetail: {
        fontSize: "16px",
        color: "#555",
        marginBottom: "5px",
    },
    noticeDate: {
        fontSize: "14px",
        fontStyle: "italic",
        color: "#888",
    },
};

export default StudentProfile;
