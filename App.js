import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import AuthForm from './components/AuthForm';
import ClosetGallery from './components/ClosetGallery';
import ClosetView from './components/ClosetView';
import './App.css'; // Global CSS

function AppContent() {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div className="loading-screen">Loading application...</div>;
    }

    return (
        <Switch>
            <Route path="/login" component={AuthForm} />
            <PrivateRoute path="/gallery" component={ClosetGallery} />
            <PrivateRoute path="/closet/:id" component={ClosetView} />
            <Route path="/">
                {isAuthenticated ? <Redirect to="/gallery" /> : <Redirect to="/login" />}
            </Route>
        </Switch>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </Router>
    );
}

export default App;