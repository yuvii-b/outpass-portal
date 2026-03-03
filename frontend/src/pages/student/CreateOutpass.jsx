import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import outpassService from '../../services/outpassService';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const CreateOutpass = () => {
  const [formData, setFormData] = useState({
    date: '',
    returnDate: '',
    noOfDays: 1,
    placeOfVisit: '',
    contactNumber: '',
    parentNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Get current date-time for min attribute
  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Auto-calculate days
    if (name === 'date' || name === 'returnDate') {
      const startDate = name === 'date' ? new Date(value) : new Date(formData.date);
      const endDate = name === 'returnDate' ? new Date(value) : new Date(formData.returnDate);
      
      if (startDate && endDate && endDate > startDate) {
        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setFormData(prev => ({ ...prev, noOfDays: diffDays }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate dates
    const startDate = new Date(formData.date);
    const endDate = new Date(formData.returnDate);

    if (endDate <= startDate) {
      toast.error('Return date must be after departure date');
      return;
    }

    if (formData.contactNumber.length !== 10 || formData.parentNumber.length !== 10) {
      toast.error('Contact numbers must be 10 digits');
      return;
    }

    setLoading(true);

    try {
      await outpassService.createOutpass(formData);
      toast.success('Outpass request created successfully!');
      navigate('/student/history');
    } catch (error) {
      console.error('Error creating outpass:', error);
      toast.error(error.response?.data?.message || 'Failed to create outpass');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">Create New Outpass Request</h4>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Date of Leaving *</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      min={getCurrentDateTime()}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Return Date *</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      name="returnDate"
                      value={formData.returnDate}
                      onChange={handleChange}
                      min={formData.date || getCurrentDateTime()}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Number of Days</label>
                  <input
                    type="number"
                    className="form-control"
                    name="noOfDays"
                    value={formData.noOfDays}
                    readOnly
                    disabled
                  />
                  <small className="text-muted">Automatically calculated</small>
                </div>

                <div className="mb-3">
                  <label className="form-label">Place of Visit *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="placeOfVisit"
                    value={formData.placeOfVisit}
                    onChange={handleChange}
                    placeholder="e.g., Home, Delhi"
                    required
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Contact Number *</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      placeholder="10 digits"
                      maxLength="10"
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Parent Contact Number *</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="parentNumber"
                      value={formData.parentNumber}
                      onChange={handleChange}
                      placeholder="10 digits"
                      maxLength="10"
                      required
                    />
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Submitting...
                      </>
                    ) : (
                      'Submit Request'
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate('/student/dashboard')}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOutpass;
