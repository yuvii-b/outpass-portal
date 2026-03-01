import { useState, useEffect } from 'react';
import outpassService from '../../services/outpassService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const SecurityDashboard = () => {
  const [activeOutpasses, setActiveOutpasses] = useState([]);
  const [todayOutpasses, setTodayOutpasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [activeRes, todayRes] = await Promise.all([
        outpassService.getActiveOutpasses(),
        outpassService.getTodayOutpasses(),
      ]);
      
      setActiveOutpasses(activeRes.data);
      setTodayOutpasses(todayRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: 'bg-warning text-dark',
      APPROVED: 'bg-success',
      DECLINED: 'bg-danger',
      EXPIRED: 'bg-secondary',
    };
    return badges[status] || 'bg-secondary';
  };

  if (loading) return <LoadingSpinner />;

  const displayOutpasses = activeTab === 'active' ? activeOutpasses : todayOutpasses;

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col-12">
          <h2>Security Guard Dashboard</h2>
          <p className="text-muted">Monitor approved outpasses and student movements</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card text-center bg-success text-white h-100 shadow">
            <div className="card-body">
              <h1 className="display-3">{activeOutpasses.length}</h1>
              <h5>Active Outpasses</h5>
              <p className="mb-0">Currently approved</p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card text-center bg-info text-white h-100 shadow">
            <div className="card-body">
              <h1 className="display-3">{todayOutpasses.length}</h1>
              <h5>Today's Outpasses</h5>
              <p className="mb-0">Scheduled for today</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="row mb-3">
        <div className="col-12">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'active' ? 'active' : ''}`}
                onClick={() => setActiveTab('active')}
              >
                Active Outpasses ({activeOutpasses.length})
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'today' ? 'active' : ''}`}
                onClick={() => setActiveTab('today')}
              >
                Today's Outpasses ({todayOutpasses.length})
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Outpass Table */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              {displayOutpasses.length === 0 ? (
                <div className="text-center py-5">
                  <h5 className="text-muted">
                    {activeTab === 'active' ? 'No active outpasses' : 'No outpasses scheduled for today'}
                  </h5>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Student Name</th>
                        <th>Roll No</th>
                        <th>Department</th>
                        <th>Hostel</th>
                        <th>Room</th>
                        <th>Place</th>
                        <th>Departure</th>
                        <th>Return</th>
                        <th>Days</th>
                        <th>Contact</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayOutpasses.map((outpass) => (
                        <tr key={outpass.id}>
                          <td>{outpass.id}</td>
                          <td>{outpass.name}</td>
                          <td>{outpass.rollNo}</td>
                          <td>{outpass.department}</td>
                          <td>{outpass.hostel}</td>
                          <td>{outpass.roomNumber}</td>
                          <td>{outpass.placeOfVisit}</td>
                          <td>{format(new Date(outpass.date), 'dd/MM/yyyy HH:mm')}</td>
                          <td>{format(new Date(outpass.returnDate), 'dd/MM/yyyy HH:mm')}</td>
                          <td>{outpass.noOfDays}</td>
                          <td>
                            {outpass.contactNumber}
                            <br />
                            <small className="text-muted">Parent: {outpass.parentNumber}</small>
                          </td>
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

      {/* Instructions */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="alert alert-info">
            <h6>📋 Instructions:</h6>
            <ul className="mb-0">
              <li><strong>Active Outpasses:</strong> All currently approved outpasses</li>
              <li><strong>Today's Outpasses:</strong> Students leaving or returning today</li>
              <li>Verify student identity before allowing exit</li>
              <li>Contact numbers are provided for verification if needed</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityDashboard;
