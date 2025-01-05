import React, { useState } from "react";
import axios from "axios";

const Signup = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        desiredCourse: "",
        role: "student", // Default role
    });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const courses = ["Full-Stack", "Mobile-App", "DevOps", "Machine Learning"];

    // Handle form changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Validate form data
    const validateForm = () => {
        if (!formData.name.trim() || !formData.email.trim() || !formData.password || !formData.desiredCourse) {
            setError("All fields are required.");
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            setError("Invalid email format.");
            return false;
        }
        setError(""); // Clear previous errors
        return true;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const response = await axios.post("https://localhost:7005/api/auth/signup", formData);
            setMessage(response.data.message); // Display success message
        } catch (error) {
            setMessage(""); // Clear previous success message
            setError(error.response?.data?.message || "Signup failed. Please try again.");
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Student Signup</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    onChange={handleChange}
                    value={formData.name}
                    required
                    style={styles.input}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                    value={formData.email}
                    required
                    style={styles.input}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                    value={formData.password}
                    required
                    style={styles.input}
                />
                <select
                    name="desiredCourse"
                    onChange={handleChange}
                    value={formData.desiredCourse}
                    required
                    style={styles.select}
                >
                    <option value="">Select a Course</option>
                    {courses.map((course, index) => (
                        <option key={index} value={course}>
                            {course}
                        </option>
                    ))}
                </select>
                <button type="submit" style={styles.button}>
                    Sign Up
                </button>
            </form>
            {error && <p style={styles.error}>{error}</p>} {/* Render error message */}
            {message && <p style={styles.success}>{message}</p>} {/* Render success message */}
        </div>
    );
};

// Inline styles
const styles = {
    container: {
        maxWidth: "400px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    },
    heading: {
        textAlign: "center",
        marginBottom: "20px",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    },
    input: {
        padding: "10px",
        fontSize: "16px",
        borderRadius: "5px",
        border: "1px solid #ccc",
    },
    select: {
        padding: "10px",
        fontSize: "16px",
        borderRadius: "5px",
        border: "1px solid #ccc",
    },
    button: {
        padding: "10px",
        backgroundColor: "#007BFF",
        color: "white",
        fontSize: "16px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
    error: {
        textAlign: "center",
        color: "red",
        marginTop: "10px",
    },
    success: {
        textAlign: "center",
        color: "green",
        marginTop: "10px",
    },
};

export default Signup;
