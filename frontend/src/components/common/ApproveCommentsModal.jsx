import { useState } from 'react';
import PropTypes from 'prop-types';

const ApproveCommentsModal = ({ show, onClose, onSubmit, processingId }) => {
  const [comments, setComments] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ comments: comments.trim() || null });
    setComments('');
  };

  const handleClose = () => {
    setComments('');
    onClose();
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-success text-white">
            <h5 className="modal-title">✓ Approve Outpass Request</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={handleClose}
              disabled={processingId}
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label fw-bold">Comments (Optional)</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="E.g., 'Approved. Please return on time.', 'Approved for emergency purposes.'"
                  maxLength={500}
                ></textarea>
                <small className="text-muted">{comments.length}/500 characters</small>
              </div>

              <div className="alert alert-info">
                <small>
                  <strong>Tip:</strong> Add notes about conditions or expectations if needed.
                  The student will see these comments.
                </small>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClose}
                disabled={processingId}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-success"
                disabled={processingId}
              >
                {processingId ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Approving...
                  </>
                ) : (
                  '✓ Confirm Approval'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

ApproveCommentsModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  processingId: PropTypes.number
};

export default ApproveCommentsModal;
