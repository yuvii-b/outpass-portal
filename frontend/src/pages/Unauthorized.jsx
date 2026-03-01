const Unauthorized = () => {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 text-center">
          <div className="card shadow">
            <div className="card-body p-5">
              <h1 className="display-1 text-danger">🚫</h1>
              <h2 className="mb-4">Unauthorized Access</h2>
              <p className="text-muted mb-4">
                You don't have permission to access this page.
              </p>
              <a href="/" className="btn btn-primary">
                Go to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
