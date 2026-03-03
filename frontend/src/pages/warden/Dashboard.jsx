import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import outpassService from '../../services/outpassService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserTie, faSearch, faChartBar, faClipboardList, faBullhorn, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const WardenDashboard = () => {
  const [stats, setStats] = useState({
    pending: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [pendingRes, historyRes] = await Promise.all([
        outpassService.getPendingOutpasses(),
        outpassService.getWardenHistory(),
      ]);
      
      setStats({
        pending: pendingRes.data.length,
        total: historyRes.data.length,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mt-4 mb-5">
      <div className="row mb-4">
        <div className="col-12">
          <h2 className="mb-1" style={{ fontWeight: '700', color: 'var(--color-primary)' }}>
            <FontAwesomeIcon icon={faUserTie} /> Warden Dashboard
          </h2>
          <p className="text-muted">Review and manage student outpass requests</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row mb-4 g-4">
        <div className="col-md-4">
          <div className="card text-center h-100 shadow-sm" style={{ backgroundColor: '#ed8936', border: 'none' }}>
            <div className="card-body d-flex flex-column justify-content-center p-4">
              <h1 className="display-2 fw-bold" style={{ color: 'white', marginBottom: '1rem' }}>{stats.pending}</h1>
              <h5 className="mb-3 fw-bold" style={{ color: 'white' }}>Pending Requests</h5>
              <Link to="/warden/pending" className="btn btn-light mt-2 fw-semibold" style={{ fontWeight: '600' }}>
                <FontAwesomeIcon icon={faSearch} /> Review Requests
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center h-100 shadow-sm" style={{ backgroundColor: '#4299e1', border: 'none' }}>
            <div className="card-body d-flex flex-column justify-content-center p-4">
              <h1 className="display-2 fw-bold" style={{ color: 'white', marginBottom: '1rem' }}>{stats.total}</h1>
              <h5 className="mb-3 fw-bold" style={{ color: 'white' }}>Total Processed</h5>
              <p className="mb-0" style={{ fontSize: '0.95rem', color: 'rgba(255, 255, 255, 0.9)' }}>All time history</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center h-100 shadow-sm" style={{ backgroundColor: '#2d3748', border: 'none' }}>
            <div className="card-body d-flex flex-column justify-content-center p-4">
              <FontAwesomeIcon icon={faClipboardList} style={{ fontSize: '3.5rem', color: 'white', marginBottom: '1rem' }} />
              <h5 className="mb-3 fw-bold" style={{ color: 'white' }}>Quick Actions</h5>
              <Link to="/warden/pending" className="btn btn-light mt-2 fw-semibold" style={{ fontWeight: '600' }}>
                <FontAwesomeIcon icon={faArrowRight} /> View All Requests
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header">
              <h5 className="mb-0"><FontAwesomeIcon icon={faBullhorn} /> Warden Panel Information</h5>
            </div>
            <div className="card-body">
              <h6>Your Responsibilities:</h6>
              <ul>
                <li>Review and approve/decline student outpass requests</li>
                <li>Monitor pending requests regularly</li>
                <li>Ensure all requests have valid information</li>
                <li>Contact students or parents if needed</li>
              </ul>
              
              <div className="alert alert-info mt-3">
                <strong>Note:</strong> You have {stats.pending} pending request{stats.pending !== 1 ? 's' : ''} waiting for your review.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WardenDashboard;
