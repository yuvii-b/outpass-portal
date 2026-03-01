import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import outpassService from '../../services/outpassService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const StudentDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [recentOutpasses, setRecentOutpasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, outpassRes] = await Promise.all([
        outpassService.getStudentProfile(),
        outpassService.getOutpassHistory(),
      ]);
      
      setProfile(profileRes.data);
      setRecentOutpasses(outpassRes.data.slice(0, 5)); // Show only recent 5
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: 'bg-warning',
      APPROVED: 'bg-success',
      DECLINED: 'bg-danger',
      EXPIRED: 'bg-secondary',
    };
    return badges[status] || 'bg-secondary';
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">Student Dashboard</h2>
        </div>
      </div>

      {/* Profile Card */}
      {profile && (
        <div className="row mb-4">
          <div className="col-md-12">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Profile Information</h5>
                <div className="row">
                  <div className="col-md-3">
                    <p className="mb-1"><strong>Name:</strong> {profile.name}</p>
                    <p className="mb-1"><strong>Roll No:</strong> {profile.rollNo}</p>
                  </div>
                  <div className="col-md-3">
                    <p className="mb-1"><strong>Department:</strong> {profile.department}</p>
                    <p className="mb-1"><strong>Email:</strong> {profile.email}</p>
                  </div>
                  <div className="col-md-3">
                    <p className="mb-1"><strong>Hostel:</strong> {profile.hostel}</p>
                    <p className="mb-1"><strong>Room:</strong> {profile.roomNumber}</p>
                  </div>
                  <div className="col-md-3">
                    <p className="mb-1"><strong>Contact:</strong> {profile.contactNumber}</p>
                    <p className="mb-1"><strong>Parent:</strong> {profile.parentNumber}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-center bg-primary text-white h-100">
            <div className="card-body">
              <h1 className="display-4">📝</h1>
              <h5>Create New Outpass</h5>
              <Link to="/student/create-outpass" className="btn btn-light mt-3">
                Create Outpass
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center bg-info text-white h-100">
            <div className="card-body">
              <h1 className="display-4">📋</h1>
              <h5>View All History</h5>
              <Link to="/student/history" className="btn btn-light mt-3">
                View History
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center bg-success text-white h-100">
            <div className="card-body">
              <h1 className="display-4">📊</h1>
              <h5>Outpass Statistics</h5>
              <p className="mb-0 mt-3">Total: {recentOutpasses.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Outpasses */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Outpass Requests</h5>
              <Link to="/student/history" className="btn btn-sm btn-primary">
                View All
              </Link>
            </div>
            <div className="card-body">
              {recentOutpasses.length === 0 ? (
                <p className="text-center text-muted">No outpass requests yet</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Place of Visit</th>
                        <th>Date</th>
                        <th>Return Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOutpasses.map((outpass) => (
                        <tr key={outpass.id}>
                          <td>{outpass.id}</td>
                          <td>{outpass.placeOfVisit}</td>
                          <td>{format(new Date(outpass.date), 'dd/MM/yyyy HH:mm')}</td>
                          <td>{format(new Date(outpass.returnDate), 'dd/MM/yyyy HH:mm')}</td>
                          <td>
                            <span className={`badge ${getStatusBadge(outpass.status)}`}>
                              {outpass.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
