import { useState, useEffect } from 'react';
import outpassService from '../../services/outpassService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const OutpassHistory = () => {
  const [outpasses, setOutpasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchOutpasses();
  }, []);

  const fetchOutpasses = async () => {
    try {
      const response = await outpassService.getOutpassHistory();
      setOutpasses(response.data);
    } catch (error) {
      console.error('Error fetching outpass history:', error);
      toast.error('Failed to load outpass history');
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

  const filteredOutpasses = filter === 'ALL' 
    ? outpasses 
    : outpasses.filter(o => o.status === filter);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col-12">
          <h2>Outpass History</h2>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="row mb-3">
        <div className="col-12">
          <div className="btn-group" role="group">
            <button
              className={`btn ${filter === 'ALL' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setFilter('ALL')}
            >
              All
            </button>
            <button
              className={`btn ${filter === 'PENDING' ? 'btn-warning' : 'btn-outline-warning'}`}
              onClick={() => setFilter('PENDING')}
            >
              Pending
            </button>
            <button
              className={`btn ${filter === 'APPROVED' ? 'btn-success' : 'btn-outline-success'}`}
              onClick={() => setFilter('APPROVED')}
            >
              Approved
            </button>
            <button
              className={`btn ${filter === 'DECLINED' ? 'btn-danger' : 'btn-outline-danger'}`}
              onClick={() => setFilter('DECLINED')}
            >
              Declined
            </button>
          </div>
        </div>
      </div>

      {/* Outpass Table */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              {filteredOutpasses.length === 0 ? (
                <div className="text-center py-5">
                  <h5 className="text-muted">No outpass requests found</h5>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Place</th>
                        <th>Departure</th>
                        <th>Return</th>
                        <th>Days</th>
                        <th>Contact</th>
                        <th>Status</th>
                        <th>Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOutpasses.map((outpass) => (
                        <tr key={outpass.id}>
                          <td>{outpass.id}</td>
                          <td>{outpass.placeOfVisit}</td>
                          <td>{format(new Date(outpass.date), 'dd/MM/yyyy HH:mm')}</td>
                          <td>{format(new Date(outpass.returnDate), 'dd/MM/yyyy HH:mm')}</td>
                          <td>{outpass.noOfDays}</td>
                          <td>{outpass.contactNumber}</td>
                          <td>
                            <span className={`badge ${getStatusBadge(outpass.status)}`}>
                              {outpass.status}
                            </span>
                          </td>
                          <td>{format(new Date(outpass.createdAt), 'dd/MM/yyyy')}</td>
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

export default OutpassHistory;
