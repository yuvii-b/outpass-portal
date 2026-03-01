import { useState, useEffect } from 'react';
import outpassService from '../../services/outpassService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const PendingOutpasses = () => {
  const [outpasses, setOutpasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchPendingOutpasses();
  }, []);

  const fetchPendingOutpasses = async () => {
    try {
      const response = await outpassService.getPendingOutpasses();
      setOutpasses(response.data);
    } catch (error) {
      console.error('Error fetching pending outpasses:', error);
      toast.error('Failed to load pending outpasses');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm('Are you sure you want to approve this outpass?')) {
      return;
    }

    setProcessingId(id);
    try {
      await outpassService.approveOutpass(id);
      toast.success('Outpass approved successfully!');
      setOutpasses(outpasses.filter(o => o.id !== id));
    } catch (error) {
      console.error('Error approving outpass:', error);
      toast.error(error.response?.data?.message || 'Failed to approve outpass');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDecline = async (id) => {
    if (!window.confirm('Are you sure you want to decline this outpass?')) {
      return;
    }

    setProcessingId(id);
    try {
      await outpassService.declineOutpass(id);
      toast.success('Outpass declined successfully!');
      setOutpasses(outpasses.filter(o => o.id !== id));
    } catch (error) {
      console.error('Error declining outpass:', error);
      toast.error(error.response?.data?.message || 'Failed to decline outpass');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col-12">
          <h2>Pending Outpass Requests</h2>
          <p className="text-muted">Review and approve/decline student outpass requests</p>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          {outpasses.length === 0 ? (
            <div className="card">
              <div className="card-body text-center py-5">
                <h4 className="text-muted">✅ No pending requests</h4>
                <p>All outpass requests have been processed</p>
              </div>
            </div>
          ) : (
            <div className="row">
              {outpasses.map((outpass) => (
                <div key={outpass.id} className="col-md-6 col-lg-4 mb-4">
                  <div className="card h-100 shadow-sm">
                    <div className="card-header bg-warning">
                      <h6 className="mb-0">Request #{outpass.id}</h6>
                    </div>
                    <div className="card-body">
                      <h5 className="card-title">{outpass.name}</h5>
                      <hr />
                      <p className="mb-1"><strong>Roll No:</strong> {outpass.rollNo}</p>
                      <p className="mb-1"><strong>Department:</strong> {outpass.department}</p>
                      <p className="mb-1"><strong>Hostel:</strong> {outpass.hostel} - {outpass.roomNumber}</p>
                      <hr />
                      <p className="mb-1"><strong>Place:</strong> {outpass.placeOfVisit}</p>
                      <p className="mb-1"><strong>Departure:</strong> {format(new Date(outpass.date), 'dd/MM/yyyy HH:mm')}</p>
                      <p className="mb-1"><strong>Return:</strong> {format(new Date(outpass.returnDate), 'dd/MM/yyyy HH:mm')}</p>
                      <p className="mb-1"><strong>Days:</strong> {outpass.noOfDays}</p>
                      <hr />
                      <p className="mb-1"><strong>Contact:</strong> {outpass.contactNumber}</p>
                      <p className="mb-1"><strong>Parent:</strong> {outpass.parentNumber}</p>
                      <p className="mb-1"><small className="text-muted">Created: {format(new Date(outpass.createdAt), 'dd/MM/yyyy HH:mm')}</small></p>
                    </div>
                    <div className="card-footer">
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-success flex-fill"
                          onClick={() => handleApprove(outpass.id)}
                          disabled={processingId === outpass.id}
                        >
                          {processingId === outpass.id ? (
                            <span className="spinner-border spinner-border-sm"></span>
                          ) : (
                            '✓ Approve'
                          )}
                        </button>
                        <button
                          className="btn btn-danger flex-fill"
                          onClick={() => handleDecline(outpass.id)}
                          disabled={processingId === outpass.id}
                        >
                          {processingId === outpass.id ? (
                            <span className="spinner-border spinner-border-sm"></span>
                          ) : (
                            '✗ Decline'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PendingOutpasses;
