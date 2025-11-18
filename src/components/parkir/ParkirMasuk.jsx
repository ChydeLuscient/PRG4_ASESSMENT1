import React, { useState, useEffect } from 'react';
import { addParkir, listJenisParkir } from '../../services/API';
import { Link, useNavigate } from 'react-router-dom';

function AddParkir() {
  const [formData, setFormData] = useState({
    prk_platnomor: '',
    prk_waktumasuk: '',
    prk_waktukeluar: '',
    prk_totaltarif: '0.00',
    prk_jenis: '',
    jpr_nama: '',
    jpr_perjam: ''
  });

  const [jenisParkir, setJenisParkir] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    const now = new Date();
    const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    
    setFormData(prev => ({
      ...prev,
      prk_waktumasuk: localDateTime
    }));
  }, []);

  // Fetch jenis parkir dari API
  useEffect(() => {
    const fetchJenisParkir = async () => {
      try {
        setLoading(true);
        console.log('🔄 Fetching jenis parkir from API...');
        const response = await listJenisParkir();
        
        let jenisData = response.data;
        
        if (jenisData && typeof jenisData === 'object' && !Array.isArray(jenisData)) {
          jenisData = jenisData.data || jenisData.records || jenisData.jenis || [];
        }
        
        const finalData = Array.isArray(jenisData) ? jenisData : [];
        
        setJenisParkir(finalData);
      } catch (err) {
        console.error('❌ Error fetching jenis parkir:', err);
        console.error('❌ Error details:', err.response?.data);
        setError('Gagal mengambil data jenis parkir: ' + (err.message || 'Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchJenisParkir();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'prk_jenis') {
      const selectedJenis = jenisParkir.find(j => 
        j.jpr_id == value || j.jpr_id === parseInt(value) || j.jpr_id === value
      );
      
      setFormData(prev => ({
        ...prev,
        prk_jenis: value,
        jpr_nama: selectedJenis ? selectedJenis.jpr_nama : '',
        jpr_perjam: selectedJenis ? selectedJenis.jpr_perjam : ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Validation
    if (!formData.prk_platnomor.trim()) {
      setError('Plat Nomor harus diisi');
      return;
    }
    if (!formData.prk_jenis || !formData.jpr_nama || !formData.jpr_perjam) {
      setError('Jenis parkir harus dipilih');
      console.log('❌ Validation failed:', {
        prk_jenis: formData.prk_jenis,
        jpr_nama: formData.jpr_nama,
        jpr_perjam: formData.jpr_perjam
      });
      return;
    }
    
    setIsSubmitting(true);

    try {
      const waktuMasukFormatted = formData.prk_waktumasuk.replace('T', ' ') + ':00';
     
      const newParkir = {
        prk_platnomor: formData.prk_platnomor.trim().toUpperCase(),
        prk_waktumasuk: waktuMasukFormatted,
        jpr_id: formData.prk_jenis
      }
      
      const response = await addParkir(newParkir);
      console.log('✅ Response:', response);
      
      if (response.data && response.data.status === 'error') {
        throw new Error(response.data.message || 'Gagal menambahkan parkir');
      }
      
      if (response.data && response.data.status === 'success') {
        setSuccessMessage('✅ Parkir masuk berhasil dicatat!');
      } else if (response.status === 200 || response.status === 201) {
        setSuccessMessage('✅ Parkir masuk berhasil dicatat!');
      } else {
        throw new Error('Response tidak dikenali');
      }
      
      // Reset form and redirect
      setTimeout(() => {
        navigate('/');
      }, 1500);
      
    } catch (error) {
      console.error("Error adding parkir:", error);
      const errorMsg = error.response?.data?.message || error.message || "Gagal menambahkan parkir";
      setError(`❌ ${errorMsg}`);
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
                <h4 className="mb-0">➕ Tambah Parkir Masuk</h4>
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

              {/* Debug Info - Hapus setelah testing */}
              {/* <div className="alert alert-info small">
                <strong>🔍 Debug Info:</strong>
                <pre className="mb-0" style={{fontSize: '10px'}}>
                  {JSON.stringify({
                    prk_platnomor: formData.prk_platnomor,
                    prk_jenis: formData.prk_jenis,
                    jpr_nama: formData.jpr_nama,
                    jpr_perjam: formData.jpr_perjam,
                    waktumasuk: formData.prk_waktumasuk
                  }, null, 2)}
                </pre>
              </div> */}
              
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="prk_platnomor" className="form-label fw-semibold">
                        Plat Nomor <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="prk_platnomor"
                        name="prk_platnomor"
                        value={formData.prk_platnomor}
                        onChange={handleInputChange}
                        placeholder="Masukkan plat nomor"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="prk_waktumasuk" className="form-label fw-semibold">
                        Waktu Masuk <span className="text-danger">*</span>
                      </label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        id="prk_waktumasuk"
                        name="prk_waktumasuk"
                        value={formData.prk_waktumasuk}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="prk_jenis" className="form-label fw-semibold">
                        Jenis Parkir <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-control"
                        id="prk_jenis"
                        name="prk_jenis"
                        value={formData.prk_jenis}
                        onChange={handleInputChange}
                        disabled={isSubmitting || loading}
                      >
                        <option value="">Pilih Jenis Parkir</option>
                        {jenisParkir.map(item => (
                          <option key={item.jpr_id} value={item.jpr_id}>
                            {item.jpr_nama} - Rp {parseFloat(item.jpr_perjam).toLocaleString('id-ID')}/jam
                          </option>
                        ))}
                      </select>
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
                    disabled={isSubmitting || loading}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Menyimpan...
                      </>
                    ) : (
                      '💾 Simpan Parkir Masuk'
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

export default AddParkir;