import React, { useState } from 'react';
import { addJenis } from '../../services/API';
import { Link, useNavigate } from 'react-router-dom';

function AddJenis() {
  const [formData, setFormData] = useState({
    jpr_nama: '',
    jpr_perjam: '',
    jpr_status: 'Aktif',
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Validation
    if (!formData.jpr_nama.trim()) {
      setError('Nama jenis parkir harus diisi');
      return;
    }
    if (!formData.jpr_perjam || parseFloat(formData.jpr_perjam) < 0) {
      setError('Tarif per jam harus berupa angka positif');
      return;
    }

    setIsSubmitting(true);

    try {
      const newJenis = {
        jpr_nama: formData.jpr_nama.trim(),
        jpr_perjam: parseFloat(formData.jpr_perjam),
        jpr_status: formData.jpr_status
      };
      
      await addJenis(newJenis);
      setSuccessMessage('✅ Jenis parkir berhasil ditambahkan!');
      
      // Reset form and redirect
      setTimeout(() => {
        navigate('/');
      }, 1500);
      
    } catch (error) {
      console.error("Error adding jenis parkir:", error);
      setError("❌ Gagal menambahkan jenis parkir. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">➕ Tambah Jenis Parkir Baru</h4>
                <Link to="/" className="btn btn-light btn-sm">
                  ← Kembali
                </Link>
              </div>
            </div>
            
            <div className="card-body">
              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}
              
              {successMessage && (
                <div className="alert alert-success">
                  {successMessage}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="jpr_nama" className="form-label fw-semibold">
                        Nama Jenis Parkir <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="jpr_nama"
                        name="jpr_nama"
                        value={formData.jpr_nama}
                        onChange={handleInputChange}
                        placeholder="Masukkan nama jenis parkir"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="jpr_perjam" className="form-label fw-semibold">
                        Tarif Per jam (Rp) <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="jpr_perjam"
                        name="jpr_perjam"
                        value={formData.jpr_perjam}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        placeholder="0"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>

                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <Link to="/" className="btn btn-secondary me-md-2">
                    Batal
                  </Link>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Menyimpan...
                      </>
                    ) : (
                      '💾 Simpan Inovasi'
                    )}
                  </button>
                </div>
                
                <div className="mt-3">
                  <small className="text-muted">
                    <span className="text-danger">*</span> Menandakan field wajib diisi
                  </small>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddJenis;