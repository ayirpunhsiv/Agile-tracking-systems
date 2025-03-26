import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import ScrumDetails from '../Scrum Details/ScrumDetails';
import { UserContext } from '../../context/UserContext';

const Dashboard = () => {
    const [scrums, setScrums] = useState([]);
    const [selectedScrum, setSelectedScrum] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [users, setUsers] = useState([]);
    const [newScrumName, setNewScrumName] = useState('');
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [newTaskStatus, setNewTaskStatus] = useState('To Do');
    const [newTaskAssignedTo, setNewTaskAssignedTo] = useState('');
    const { user } = useContext(UserContext);

    useEffect(() => {
        const fetchScrums = async () => {
            try {
                const response = await axios.get('http://localhost:4000/scrums');
                setScrums(response.data);
            } catch (error) {
                console.error('Error fetching scrums:', error);
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:4000/users');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchScrums();
        fetchUsers();
    }, []);

    const handleGetDetails = async (scrumId) => {
        try {
            const response = await axios.get(`http://localhost:4000/scrums/${scrumId}`);
            setSelectedScrum(response.data);
        } catch (error) {
            console.error('Error fetching scrum details:', error);
        }
    };

    const handleAddScrum = async (event) => {
        event.preventDefault();

        try {
            // Add new Scrum
            const newScrumResponse = await axios.post('http://localhost:4000/scrums', {
                name: newScrumName,
            });

            const newScrum = newScrumResponse.data;

            // Add new Task
            const newTaskResponse = await axios.post('http://localhost:4000/tasks', {
                title: newTaskTitle,
                description: newTaskDescription,
                status: newTaskStatus,
                scrumId: newScrum.id,
                assignedTo: newTaskAssignedTo,
                history: [
                    {
                        status: newTaskStatus,
                        date: new Date().toISOString().split('T')[0], // Set the current date
                    },
                ],
            });

            const updatedScrums = await axios.get('http://localhost:4000/scrums');
            setScrums(updatedScrums.data);
            setShowForm(false); // Hide the form after submission
            setNewScrumName('');
            setNewTaskTitle('');
            setNewTaskDescription('');
            setNewTaskStatus('To Do');
            setNewTaskAssignedTo('');
        } catch (error) {
            console.error('Error adding scrum:', error);
        }
    };

    return (
        <div style={{
            maxWidth: '1900px',
            margin: '40px auto', // Added margin for better spacing
            padding: '40px', // Increased padding for a larger content area
            backgroundColor: 'rgba(76, 81, 84, 0.5)', // Semi-transparent dark gray background
            minHeight: '70vh',
            borderRadius: '10px', // Rounded corners
            boxShadow: '0 0 10px rgba(0,0,0,0.1)', // Subtle shadow
            border: '1px solid rgba(221, 221, 221, 0.5)' // Semi-transparent light border
        }}>
            <h2 style={{
                color: '#3498db', // Blue text
                paddingBottom: '10px', // Increased padding
                borderBottom: '2px solid #3498db',
                marginBottom: '20px', // Increased margin
                textAlign: 'center',
                fontSize: '28px', // Increased font size
                fontWeight: 'bold'
            }}>
                Scrum Teams
            </h2>
            {user?.role === 'admin' && (
                <div style={{ marginBottom: '20px' }}>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        style={{
                            backgroundColor: showForm ? '#dc3545' : '#3498db', // Red when canceling, blue when adding
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px', // Increased padding
                            borderRadius: '5px',
                            cursor: 'pointer',
                            marginBottom: '10px',
                            transition: 'background-color 0.3s',
                            fontSize: '16px' // Increased font size
                        }}
                    >
                        {showForm ? 'Cancel' : 'Add New Scrum'}
                    </button>
                </div>
            )}

            <div style={{
                padding: '20px', // Increased padding
                backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background
                borderRadius: '8px',
                boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                height: 'auto',
                overflowY: 'auto',
                border: '1px solid #ced4da' // Light border
            }}>
                {scrums.map((scrum, index) => (
                    <div
                        key={scrum.id}
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '15px', // Increased padding
                            marginBottom: '10px',
                            width: '100%',
                            backgroundColor: index % 2 === 0 ? 'rgba(247, 247, 247, 0.7)' : 'rgba(229, 229, 229, 0.7)', // Alternate background colors with transparency
                            borderRadius: '10px',
                            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                            border: '1px solid #ddd' // Light border
                        }}
                    >
                        <h3 style={{
                            margin: '0',
                            color: '#3498db', // Blue text
                            fontSize: '20px', // Increased font size
                            fontWeight: 'bold'
                        }}>
                            {scrum.name}
                        </h3>
                        <button
                            onClick={() => handleGetDetails(scrum.id)}
                            style={{
                                backgroundColor: '#4CAF50', // Green for view details
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px', // Increased padding
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontSize: '16px' // Increased font size
                            }}
                        >
                            View Details
                        </button>
                    </div>
                ))}
            </div>
            {showForm && (
                <form onSubmit={handleAddScrum} style={{
                    padding: '20px', // Increased padding
                    backgroundColor: 'rgba(249, 249, 249, 0.8)', // Semi-transparent light gray background
                    borderRadius: '10px',
                    width: '400px', // Increased width
                    margin: '20px auto', // Added margin
                    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                    border: '1px solid #ddd'
                }}>
                    <h3 style={{
                        marginBottom: '15px', // Increased margin
                        color: '#3498db', // Blue text
                        fontSize: '22px', // Increased font size
                        fontWeight: 'bold',
                        textAlign: 'center'
                    }}>
                        Add New Scrum
                    </h3>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '5px',
                            fontSize: '16px', // Increased font size
                            fontWeight: '500',
                            color: '#2c3e50' // Dark blue-gray text
                        }}>
                            Scrum Name:
                        </label>
                        <input
                            type="text"
                            value={newScrumName}
                            onChange={(e) => setNewScrumName(e.target.value)}
                            style={{
                                padding: '10px', // Increased padding
                                width: '100%',
                                borderRadius: '5px',
                                border: '1px solid #ced4da', // Lighter border
                                fontSize: '16px' // Increased font size
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '5px',
                            fontSize: '16px', // Increased font size
                            fontWeight: '500',
                            color: '#2c3e50' // Dark blue-gray text
                        }}>
                            Task Title:
                        </label>
                        <input
                            type="text"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            style={{
                                padding: '10px', // Increased padding
                                width: '100%',
                                borderRadius: '5px',
                                border: '1px solid #ced4da', // Lighter border
                                fontSize: '16px' // Increased font size
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '5px',
                            fontSize: '16px', // Increased font size
                            fontWeight: '500',
                            color: '#2c3e50' // Dark blue-gray text
                        }}>
                            Task Description:
                        </label>
                        <textarea
                            value={newTaskDescription}
                            onChange={(e) => setNewTaskDescription(e.target.value)}
                            style={{
                                padding: '10px', // Increased padding
                                width: '100%',
                                borderRadius: '5px',
                                border: '1px solid #ced4da', // Lighter border
                                height: '80px', // Increased height
                                fontSize: '16px' // Increased font size
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '5px',
                            fontSize: '16px', // Increased font size
                            fontWeight: '500',
                            color: '#2c3e50' // Dark blue-gray text
                        }}>
                            Task Status:
                        </label>
                        <select
                            value={newTaskStatus}
                            onChange={(e) => setNewTaskStatus(e.target.value)}
                            style={{
                                padding: '10px', // Increased padding
                                width: '100%',
                                borderRadius: '5px',
                                border: '1px solid #ced4da', // Lighter border
                                fontSize: '16px' // Increased font size
                            }}
                        >
                            <option value="To Do">To Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Done">Done</option>
                        </select>
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '5px',
                            fontSize: '16px', // Increased font size
                            fontWeight: '500',
                            color: '#2c3e50' // Dark blue-gray text
                        }}>
                            Assign To:
                        </label>
                        <select
                            value={newTaskAssignedTo}
                            onChange={(e) => setNewTaskAssignedTo(e.target.value)}
                            style={{
                                padding: '10px', // Increased padding
                                width: '100%',
                                borderRadius: '5px',
                                border: '1px solid #ced4da', // Lighter border
                                fontSize: '16px' // Increased font size
                            }}
                        >
                            {users.map((user) => (
                                <option key={user.id} value={user.name}>{user.name}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="submit"
                        style={{
                            backgroundColor: '#3498db', // Blue button
                            color: 'white',
                            border: 'none',
                            padding: '12px 24px', // Increased padding
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '16px', // Increased font size
                            fontWeight: 'bold',
                            width: '100%'
                        }}
                    >
                        Add Scrum
                    </button>
                </form>
            )}

            {selectedScrum && (
                <ScrumDetails scrum={selectedScrum} />
            )}

        </div>
    );
};

export default Dashboard;

