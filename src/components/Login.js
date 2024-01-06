import React, { useState } from 'react';
import axios from 'axios';
import '../css/login.css';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/api/django/user/token/', {
                email,
                password,
            });

            if (response.data.token) {
                // Assuming the backend returns a token upon successful login
                const token = response.data.token;

                // Store the token in the browser's local storage
                localStorage.setItem('authToken', token);
                // Call the onLogin callback with the token
                onLogin(token);
            } else {
                setError('Invalid credentials');
            }
        } catch (error) {
            console.error('Login failed:', error);
            setError('An unexpected error occurred.');
        }
    };

    return (
        <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit" className="login-btn">Login</button>
      </form>
    </div>
    );
};

export default Login;
