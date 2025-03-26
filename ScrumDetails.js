import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';
import { useHistory } from 'react-router-dom';

const ScrumDetails = ({ scrum }) => {
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const { user } = useContext(UserContext);
    const history = useHistory();

    useEffect(() => {
        const checkUser = () => {
            const loggedInUser = JSON.parse(localStorage.getItem('user'));
            if (!loggedInUser) {
                history.push('/login');
            }
        };

        checkUser();
    }, [history]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/tasks?scrumId=${scrum.id}`);
                setTasks(response.data);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };

        fetchTasks();
    }, [scrum.id]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:4000/users');
                const scrumUsers = response.data.filter(user => tasks.some(task => task.assignedTo === user.id));
                setUsers(scrumUsers);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        if (tasks.length > 0) {
            fetchUsers();
        }
    }, [tasks]);

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await axios.patch(`http://localhost:4000/tasks/${taskId}`, {
                status: newStatus,
                history: [
                    ...tasks.find(task => task.id === taskId).history,
                    {
                        status: newStatus,
                        date: new Date().toISOString().split('T')[0], // Set the current date
                    },
                ],
            });

            // Update the tasks state with the new status
            setTasks(prevTasks =>
                prevTasks.map(task =>
                    task.id === taskId ? { ...task, status: newStatus } : task
                )
            );
        } catch (error) {
            console.error('Error updating task status:', error);
        }
    };

    return (
        <div style={{
            backgroundImage: `linear-gradient(to bottom, #3498db, #2ecc71)`, // Gradient background
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            minHeight: '100vh',
            width: '100vw',
            margin: '0',
            padding: '2rem',
            boxSizing: 'border-box',
            color: 'white', // Text color
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.7)', // Transparent background
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                maxWidth: '80%',
                minWidth: '600px', // Adjusted minimum width
                padding: '50px', // Reduced padding
                fontFamily: 'Arial, sans-serif', // Font family
                fontSize: '16px', // Font size
                color: '#333' // Text color inside container
            }}>
                <h3 style={{
                    color: '#2ecc71', // Header color
                    borderBottom: '2px solid #3498db', // Border color
                    paddingBottom: '1rem',
                    marginBottom: '1.5rem',
                    fontSize: '24px', // Header font size
                    fontWeight: 'bold' // Header font weight
                }}>
                    Scrum Details for {scrum.name}
                </h3>

                <h4 style={{
                    marginTop: '2rem',
                    fontSize: '18px', // Section title font size
                    color: '#3498db', // Section title color
                    fontWeight: 'bold' // Section title font weight
                }}>
                    Tasks
                </h4>
                <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: '2rem 0'
                }}>
                    {tasks.map(task => (
                        <li key={task.id} style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.9)', // Task background
                            padding: '1rem',
                            marginBottom: '1rem',
                            borderRadius: '6px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            transition: 'transform 0.2s ease',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                        }}>
                            <div style={{
                                flex: 1,
                                marginRight: '1rem',
                                color: '#444' // Task text color
                            }}>
                                <strong style={{
                                    fontSize: '16px' // Task title font size
                                }}>{task.title}:</strong> {task.description}
                                <em style={{
                                    color: '#7f8c8d', // Task status color
                                    marginLeft: '0.5rem'
                                }}>- {task.status}</em>
                            </div>
                            {user?.role === 'admin' && (
                                <select
                                    style={{
                                        padding: '8px 12px',
                                        borderRadius: '4px',
                                        border: '2px solid #3498db', // Select border color
                                        backgroundColor: 'rgba(255, 255, 255, 0.9)', // Select background
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        color: '#333' // Select text color
                                    }}
                                    value={task.status}
                                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                >
                                    <option value="To Do">To Do</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Done">Done</option>
                                </select>
                            )}
                        </li>
                    ))}
                </ul>

                <h4 style={{
                    marginTop: '2rem',
                    fontSize: '18px', // Section title font size
                    color: '#3498db', // Section title color
                    fontWeight: 'bold' // Section title font weight
                }}>
                    Scrum Teams
                </h4>
                <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: '2rem 0',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '1rem'
                }}>
                    {users.map(user => (
                        <li key={user.id} style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.9)', // User background
                            padding: '1rem',
                            borderRadius: '6px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            color: '#444' // User text color
                        }}>
                            <div style={{
                                flex: 1
                            }}>
                                <strong style={{
                                    fontSize: '16px' // User name font size
                                }}>{user.name}</strong>
                                <div>{user.email}</div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ScrumDetails;
