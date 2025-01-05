import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true); // Show loading state
        setMessage(""); // Clear previous messages

        try {
            const response = await axios.post("https://localhost:7005/api/auth/login", {
                email,
                password,
            });

            const { user, token, message: successMessage } = response.data;

            // Store token for authenticated routes
            localStorage.setItem("token", token);

            setMessage(successMessage || "Login successful!"); // Display success message

            // Navigate based on role
            if (user.role === "Admin") {
                navigate("/admin");
            } else if (user.role === "Student") {
                navigate("/profile");
            } else {
                setMessage("Unknown user role.");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
            setMessage(errorMessage); // Display error message
        } finally {
            setLoading(false); // Hide loading state
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Login to IICT Student Portal</h2>
            <form onSubmit={handleLogin} style={styles.form}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                    required
                />
                <button
                    type="submit"
                    style={styles.button}
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
            {message && (
                <p
                    style={{
                        marginTop: "15px",
                        textAlign: "center",
                        fontSize: "14px",
                        color: message.startsWith("Login successful") ? "green" : "red",
                    }}
                >
                    {message}
                </p>
            )}
        </div>
    );
};

// Styles
const styles = {
    container: {
        maxWidth: "400px",
        margin: "200px 590px 200px 500px",
        padding: "20px",
        backgroundColor: "#f9f9f9",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    title: {
        textAlign: "center",
        marginBottom: "20px",
        fontSize: "1.5rem",
        color: "#333",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "15px",
    },
    input: {
        padding: "10px",
        fontSize: "16px",
        border: "1px solid #ddd",
        borderRadius: "5px",
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
};

export default Login;
