import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Switch, Link, useHistory } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/Login/Login';
import UserProfile from './components/UserProfile/UserProfile';
import SignUp from './components/Signup/SignUp';
import { UserProvider, UserContext } from '../src/context/UserContext';

const App = () => {
    return (
        <UserProvider>
            <Router>
                <div style={{
                    backgroundImage: `url('/background.png.png')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    minHeight: '100vh',
                    width: '100vw',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',  // Changed to flex-start to accommodate Nav
                    padding: '20px',
                    boxSizing: 'border-box',  // To include padding in the width and height
                    color: 'black'  // Set a default text color that works well with your image
                }}>
                    <Nav />
                    <Switch>
                        <Route path="/" exact component={Dashboard} />
                        <Route path="/login" component={Login} />
                        <Route path="/signup" component={SignUp} />
                        <Route path="/profiles" component={UserProfile} />
                    </Switch>
                </div>
            </Router>
        </UserProvider>
    );
};

const Nav = () => {
    const { user, logout } = useContext(UserContext);
    const history = useHistory();

    const handleLogout = () => {
        logout();
        history.push('/login');
    };

    return (
        <nav style={{
            backgroundColor: 'rgba(52, 152, 219, 0.7)',  // Semi-transparent background
            padding: '10px',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',  // Make the Nav take the full width
            marginBottom: '20px'  // Add some spacing between Nav and content
        }}>
            <ul style={{
                listStyle: 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                margin: 0,
                padding: 0
            }}>
                <li style={{ marginRight: '20px' }}>
                    <Link to="/" style={{
                        color: 'white',
                        textDecoration: 'none'
                    }}>
                        Dashboard
                    </Link>
                </li>
                {user ? (
                    <>
                        <li style={{ marginRight: '20px' }}>
                            <Link to="/profiles" style={{
                                color: 'white',
                                textDecoration: 'none'
                            }}>
                                Profiles
                            </Link>
                        </li>
                        <li>
                            <button
                                onClick={handleLogout}
                                style={{
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    color: 'white',
                                    cursor: 'pointer'
                                }}
                            >
                                Logout
                            </button>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <Link to="/login" style={{
                                color: 'white',
                                textDecoration: 'none'
                            }}>
                                Login
                            </Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default App;
