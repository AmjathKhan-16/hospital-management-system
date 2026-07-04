import { Link } from 'react-router-dom';

const NavBar = ({ user, onLogout }) => {
  return (
    <nav className="navbar">
      <Link className="brand" to="/">
        <span className="brand-mark">H</span>
        <span>Hospital Manager</span>
      </Link>
      <div className="links">
        <Link to="/">Home</Link>
        {user ? (
          <>
            <span className="user-chip">{user.name} ({user.role})</span>
            <Link to="/dashboard">Dashboard</Link>
            {user.role === 'admin' && <Link to="/admin">Admin</Link>}
            {user.role === 'doctor' && <Link to="/doctor">Doctor</Link>}
            {user.role === 'patient' && <Link to="/patient">Patient</Link>}
            <button className="btn secondary" onClick={onLogout}>Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default NavBar;