import React from 'react';
import { Link } from 'react-router-dom';

function FooterComponent() {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-md-6 text-center text-md-start">
            <h6 className="text-uppercase fw-bold mb-3">🛍️ Inovasi Informatika</h6>
            <p className="mb-0">
              © {new Date().getFullYear()} Inovasi Informatika. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <div className="d-flex justify-content-center justify-content-md-end">
              <Link to="/" className="text-light text-decoration-none me-3">Home</Link>
              <Link to="/" className="text-light text-decoration-none me-3">Parkir</Link>
              <Link to="/list-jenis" className="text-light text-decoration-none">Jenis</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default FooterComponent;