import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'STUDENT':
        return '/student/dashboard';
      case 'WARDEN':
        return '/warden/dashboard';
      case 'SECURITY_GUARD':
        return '/security/dashboard';
      default:
        return '/';
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to={getDashboardLink()}>
          🎓 Outpass Portal
        </Link>
        
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to={getDashboardLink()}>
                    Dashboard
                  </Link>
                </li>
                
                {user.role === 'STUDENT' && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/student/create-outpass">
                        Create Outpass
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/student/history">
                        History
                      </Link>
                    </li>
                  </>
                )}

                {user.role === 'WARDEN' && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/warden/pending">
                      Pending Requests
                    </Link>
                  </li>
                )}

                <li className="nav-item">
                  <span className="nav-link">
                    <strong>{user.email}</strong> ({user.role})
                  </span>
                </li>
                
                <li className="nav-item">
                  <button className="btn btn-outline-light btn-sm ms-2" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
