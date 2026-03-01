import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import outpassService from '../../services/outpassService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

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
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">Warden Dashboard</h2>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-center bg-warning text-dark h-100 shadow">
            <div className="card-body">
              <h1 className="display-3">{stats.pending}</h1>
              <h5>Pending Requests</h5>
              <Link to="/warden/pending" className="btn btn-dark mt-3">
                Review Requests
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center bg-info text-white h-100 shadow">
            <div className="card-body">
              <h1 className="display-3">{stats.total}</h1>
              <h5>Total Processed</h5>
              <p className="mb-0 mt-3">All time history</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center bg-primary text-white h-100 shadow">
            <div className="card-body">
              <h1 className="display-4">📋</h1>
              <h5>Quick Actions</h5>
              <Link to="/warden/pending" className="btn btn-light mt-3">
                View All Requests
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">📢 Warden Panel Information</h5>
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
