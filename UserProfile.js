import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';

const UserProfile = () => {
    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [newUserName, setNewUserName] = useState('');
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserPassword, setNewUserPassword] = useState('');
    const [newUserRole, setNewUserRole] = useState('employee');
    const { user } = useContext(UserContext);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:4000/users');
                if (user?.role === 'admin') {
                    setUsers(response.data.filter(user => user?.role !== 'admin'));
                } else {
                    setSelectedUser(user);
                    fetchTasks(user?.id);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, [user]);

    const fetchTasks = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:4000/tasks?assignedTo=${userId}`);
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const handleGetHistory = (userId) => {
        setSelectedUser(users.find(user => user?.id === userId));
        fetchTasks(userId);
    };

    const handleAddUser = async (event) => {
        event.preventDefault();

        try {
            await axios.post('http://localhost:4000/users', {
                name: newUserName,
                email: newUserEmail,
                password: newUserPassword,
                role: newUserRole,
            });

            const updatedUsers = await axios.get('http://localhost:4000/users');
            setUsers(updatedUsers.data.filter(user => user?.role !== 'admin'));
            setShowForm(false); // Hide the form after submission
            setNewUserName('');
            setNewUserEmail('');
            setNewUserPassword('');
            setNewUserRole('employee');
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    return (
        <div style={{
            maxWidth: '800px',  // Reduced width for better readability
            margin: '0 auto',
            padding: '20px',
            backgroundColor: 'rgba(128, 128, 128, 0.5)',  // Dark blue background
            minHeight: '100vh',
            borderRadius: '8px',  // Rounded corners
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',  // Subtle shadow
        }}>
            <h2 style={{
                color: '#ffffff',  // White text
                paddingBottom: '10px',
                borderBottom: '2px solid #3498db',  // Blue underline
                marginBottom: '20px',
                textAlign: 'center'
            }}>
                User Profiles
            </h2>

            {/* Admin user form to add new user */}
            {user?.role === 'admin' && (
                <div style={{
                    marginBottom: '30px',
                    padding: '10px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)'  // Transparent white background
                }}>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        style={{
                            backgroundColor: showForm ? '#dc3545' : '#3498db',  // Red for cancel, blue for add
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            marginBottom: '15px',
                            transition: 'background-color 0.3s ease'
                        }}
                    >
                        {showForm ? 'Cancel' : 'Add New User'}
                    </button>

                    {/* Form for adding new user */}
                    {showForm && (
                        <form onSubmit={handleAddUser} style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',  // Transparent white background for form
                            padding: '20px',
                            borderRadius: '8px',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                            width: '100%',  // Full width for form
                            margin: '0 auto'
                        }}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#2c3e50' }}>Name:</label>
                                <input
                                    type="text"
                                    value={newUserName}
                                    onChange={(e) => setNewUserName(e.target.value)}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '8px',
                                        border: '1px solid #ced4da',
                                        borderRadius: '4px'
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#2c3e50' }}>Email:</label>
                                <input
                                    type="email"
                                    value={newUserEmail}
                                    onChange={(e) => setNewUserEmail(e.target.value)}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '8px',
                                        border: '1px solid #ced4da',
                                        borderRadius: '4px'
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#2c3e50' }}>Password:</label>
                                <input
                                    type="password"
                                    value={newUserPassword}
                                    onChange={(e) => setNewUserPassword(e.target.value)}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '8px',
                                        border: '1px solid #ced4da',
                                        borderRadius: '4px'
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#2c3e50' }}>Role:</label>
                                <select
                                    value={newUserRole}
                                    onChange={(e) => setNewUserRole(e.target.value)}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '8px',
                                        border: '1px solid #ced4da',
                                        borderRadius: '4px',
                                        backgroundColor: 'white'
                                    }}
                                >
                                    <option value="employee">Employee</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                style={{
                                    backgroundColor: '#28a745',  // Green background
                                    color: 'white',
                                    border: 'none',
                                    padding: '10px 20px',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    width: '100%',
                                    fontSize: '16px'
                                }}
                            >
                                Create User
                            </button>
                        </form>
                    )}
                </div>
            )}

            {/* User List (for Admin) */}
            {user?.role === 'admin' && (
                <div style={{ marginBottom: '30px' }}>
                    <h3 style={{ color: '#3498db', marginBottom: '15px' }}>Users List</h3>
                    {users.map(user => (
                        <div key={user?.id} style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',  // Transparent white background for each user card
                            padding: '15px',
                            marginBottom: '15px',
                            borderRadius: '8px',  // Rounded corners
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',  // Subtle shadow
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div style={{ fontSize: '16px', color: '#2c3e50' }}>
                                <strong>Name:</strong> {user?.name} <br />
                                <strong>Email:</strong> {user?.email}
                            </div>
                            <button
                                onClick={() => handleGetHistory(user?.id)}
                                style={{
                                    backgroundColor: '#17a2b8',  // Teal background
                                    color: 'white',
                                    border: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Get History
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Tasks List (for Admin or Employee) */}
            {(user?.role === 'admin' || user?.role !== 'admin') && (
                <div>
                    <h3 style={{ color: '#3498db', marginBottom: '15px' }}>
                        {selectedUser ? `Tasks Worked By ${selectedUser.name}` : `Tasks Assigned to ${user?.name}`}
                    </h3>
                    <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: '2rem 0'
                    }}>
                        {tasks.map(task => (
                            <li
                                key={task.id}
                                style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.8)',  // Transparent white background for task
                                    padding: '15px',
                                    marginBottom: '15px',
                                    borderRadius: '8px',  // Rounded corners
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    transition: 'transform 0.2s ease',
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                                }}
                            >
                                <div style={{ flex: 1, marginRight: '1.5rem', color: '#2c3e50' }}>
                                    <strong>Title:</strong> {task.title} <br />
                                    <strong>Description:</strong> {task.description} <br />
                                    <strong>Status:</strong> {task.status}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
