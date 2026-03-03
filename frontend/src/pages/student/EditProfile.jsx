import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import outpassService from '../../services/outpassService';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faLock } from '@fortawesome/free-solid-svg-icons';

const EditProfile = () => {
  const [formData, setFormData] = useState({
    hostel: '',
    roomNumber: '',
    contactNumber: '',
    parentNumber: '',
  });
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await outpassService.getStudentProfile();
      const data = response.data;
      setProfile(data);
      setFormData({
        hostel: data.hostel,
        roomNumber: data.roomNumber,
        contactNumber: data.contactNumber,
        parentNumber: data.parentNumber,
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (formData.contactNumber.length !== 10 || formData.parentNumber.length !== 10) {
      toast.error('Contact numbers must be 10 digits');
      return;
    }

    setSubmitting(true);

    try {
      await outpassService.updateStudentProfile(formData);
      toast.success('Profile updated successfully!');
      navigate('/student/dashboard');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mt-4 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg card-fade-in">
            <div className="card-header">
              <h4 className="mb-0"><FontAwesomeIcon icon={faEdit} /> Edit Profile</h4>
            </div>
            <div className="card-body p-4">
              {/* Display Read-only fields */}
              <div className="alert alert-info mb-4">
                <h6 className="alert-heading fw-bold"><FontAwesomeIcon icon={faLock} /> Read-Only Information</h6>
                <div className="row">
                  <div className="col-md-6">
                    <p className="mb-1"><strong>Name:</strong> {profile?.name}</p>
                    <p className="mb-1"><strong>Email:</strong> {profile?.email}</p>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-1"><strong>Roll No:</strong> {profile?.rollNo}</p>
                    <p className="mb-1"><strong>Department:</strong> {profile?.department}</p>
                  </div>
                </div>
                <small className="text-muted">These fields cannot be edited</small>
              </div>

              <form onSubmit={handleSubmit}>

                <div className="mb-3">
                  <label className="form-label">Hostel *</label>
                  <select
                    className="form-select"
                    name="hostel"
                    value={formData.hostel}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Hostel</option>
                    <option value="Main Hostel">Main Hostel</option>
                    <option value="NRI Hostel">NRI Hostel</option>
                    <option value="Girls Hostel">Girls Hostel</option>
                    <option value="PG Hostel">PG Hostel</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Room Number *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="roomNumber"
                    value={formData.roomNumber}
                    onChange={handleChange}
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
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Updating...
                      </>
                    ) : (
                      'Update Profile'
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

export default EditProfile;
