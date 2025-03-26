import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:4000/users', {
                name,
                email,
                password,
                role: 'employee'
            });
            history.push('/login');
        } catch (error) {
            console.error('Error signing up:', error);
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '40px',
                backgroundColor: 'rgba(76, 81, 84, 0.5)', // Semi-transparent dark gray background
                borderRadius: '10px', // Rounded corners
                boxShadow: '0 0 10px rgba(0,0,0,0.1)', // Subtle shadow
                maxWidth: '400px', // Fixed width
                margin: '40px auto', // Centered horizontally
                border: '1px solid rgba(221, 221, 221, 0.5)' // Semi-transparent light border
            }}
        >
            <h2
                style={{
                    marginBottom: '20px',
                    fontSize: '24px', // Larger font size
                    color: '#3498db', // Blue text
                    fontWeight: 'bold'
                }}
            >
                Sign Up
            </h2>
            <form
                onSubmit={handleSignUp}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background for form
                    padding: '20px',
                    borderRadius: '5px',
                    boxShadow: '0 0 5px rgba(0,0,0,0.05)', // Subtle shadow for form
                    border: '1px solid rgba(206, 212, 218, 0.5)' // Semi-transparent light border for form
                }}
            >
                <label
                    style={{
                        display: 'block',
                        marginBottom: '5px',
                        fontSize: '16px',
                        fontWeight: '500',
                        color: '#2c3e50' // Dark blue-gray text
                    }}
                >
                    Name:
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={{
                            padding: '10px',
                            borderRadius: '5px',
                            border: '1px solid rgba(206, 212, 218, 0.5)', // Semi-transparent lighter border
                            width: '100%' // Full width
                        }}
                    />
                </label>
                <label
                    style={{
                        display: 'block',
                        marginBottom: '5px',
                        fontSize: '16px',
                        fontWeight: '500',
                        color: '#2c3e50' // Dark blue-gray text
                    }}
                >
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                            padding: '10px',
                            borderRadius: '5px',
                            border: '1px solid rgba(206, 212, 218, 0.5)', // Semi-transparent lighter border
                            width: '100%' // Full width
                        }}
                    />
                </label>
                <label
                    style={{
                        display: 'block',
                        marginBottom: '5px',
                        fontSize: '16px',
                        fontWeight: '500',
                        color: '#2c3e50' // Dark blue-gray text
                    }}
                >
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                            padding: '10px',
                            borderRadius: '5px',
                            border: '1px solid rgba(206, 212, 218, 0.5)', // Semi-transparent lighter border
                            width: '100%' // Full width
                        }}
                    />
                </label>
                <button
                    type="submit"
                    style={{
                        backgroundColor: '#ff9800', // Orange background
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        borderRadius: '5px',
                        width: '100%' // Full width
                    }}
                >
                    Sign Up
                </button>
            </form>
            <button
                onClick={() => history.push('/login')}
                style={{
                    backgroundColor: '#4CAF50', // Green background
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    borderRadius: '5px',
                    marginTop: '10px',
                    width: '100%' // Full width
                }}
            >
                Login
            </button>
        </div>
    );
};

export default SignUp;
