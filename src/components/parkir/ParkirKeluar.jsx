import React, { useState, useEffect } from 'react';
import { getParkirById, updateParkirKeluar } from '../../services/API';
import { Link, useNavigate, useParams } from 'react-router-dom';

function ParkirKeluar() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [parkirData, setParkirData] = useState(null);
  const [formData, setFormData] = useState({
    prk_id: '',
    prk_waktukeluar: '',
    prk_totaltarif: 0
  });
  
  const [duration, setDuration] = useState({ hours: 0, minutes: 0, roundedHours: 0 });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const now = new Date();
    const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    
    setFormData(prev => ({
      ...prev,
      prk_waktukeluar: localDateTime
    }));
  }, []);

  // Fetch data parkir berdasarkan ID
  useEffect(() => {
    const fetchParkir = async () => {
      try {
        setLoading(true);
        setFetchError(null);
        
        if (!id) {
          throw new Error('ID parkir tidak valid');
        }

        const response = await getParkirById(id);
        const parkir = response.data;

        setParkirData(parkir);
        setFormData(prev => ({
          ...prev,
          prk_id: parkir.prk_id
        }));
        
      } catch (error) {
        console.error("❌ Error fetching parkir:", error);
        setFetchError(error.message || "Gagal mengambil data parkir.");
      } finally {
        setLoading(false);
      }
    };

    fetchParkir();
  }, [id]);

  // hitung total tarif
  useEffect(() => {
    if (!parkirData || !formData.prk_waktukeluar) return;

    const waktuMasuk = new Date(parkirData.prk_waktumasuk);
    const waktuKeluar = new Date(formData.prk_waktukeluar);
    
    // selisih
    const diffMs = waktuKeluar - waktuMasuk;
    
    if (diffMs < 0) {
      setError('Waktu keluar tidak boleh lebih awal dari waktu masuk');
      return;
    }

    // menit dan jam
    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    // pembulatan
    const roundedHours = minutes > 0 ? hours + 1 : hours;
    // minimal
    const finalHours = roundedHours === 0 ? 1 : roundedHours;
    
    setDuration({ hours, minutes, roundedHours: finalHours });
    
    // total tarif
    const tarifPerJam = parseFloat(parkirData.jpr_perjam || 0);
    const totalTarif = finalHours * tarifPerJam;
    
    setFormData(prev => ({
      ...prev,
      prk_totaltarif: totalTarif
    }));
  }, [formData.prk_waktukeluar, parkirData]);

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
    if (!formData.prk_waktukeluar) {
      setError('Waktu keluar harus diisi');
      return;
    }

    setIsSubmitting(true);

    try {
      const waktuKeluarFormatted = formData.prk_waktukeluar.replace('T', ' ') + ':00';
      
      const updateData = {
        prk_id: formData.prk_id,
        prk_waktukeluar: waktuKeluarFormatted,
        prk_totaltarif: formData.prk_totaltarif
      };
    
      const response = await updateParkirKeluar(updateData);
      console.log('✅ Update response:', response);
      
      setSuccessMessage('✅ Parkir keluar berhasil dicatat! Mengalihkan...');
      
      setTimeout(() => {
        navigate('/');
      }, 1500);
      
    } catch (error) {
      console.error("❌ Error updating parkir:", error);
      const errorMsg = error.response?.data?.message || error.message || "Gagal mencatat parkir keluar";
      setError(`❌ ${errorMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h4 className="text-muted mt-3">Memuat data parkir...</h4>
        <p className="text-muted">ID: {id}</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          <h5>❌ Error</h5>
          <p>{fetchError}</p>
          <div className="mt-3">
            <Link to="/" className="btn btn-secondary me-2">
              ← Kembali ke Daftar Parkir
            </Link>
            <button 
              className="btn btn-primary"
              onClick={() => window.location.reload()}
            >
              🔄 Refresh Halaman
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card shadow-sm">
            <div className="card-header bg-danger text-white">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">📦 Parkir Keluar</h4>
                <div>
                  <small className="me-3">ID: {id}</small>
                  <Link to="/" className="btn btn-light btn-sm">
                    ← Kembali
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="card-body">
              {error && (
                <div className="alert alert-danger alert-dismissible fade show">
                  {error}
                  <button type="button" className="btn-close" onClick={() => setError(null)}></button>
                </div>
              )}
              
              {successMessage && (
                <div className="alert alert-success">
                  {successMessage}
                </div>
              )}

              <div className="card mb-4 bg-light">
                <div className="card-body">
                  <h5 className="card-title mb-3">📋 Informasi Parkir</h5>
                  <div className="row">
                    <div className="col-md-6">
                      <p><strong>Plat Nomor:</strong> {parkirData?.prk_platnomor}</p>
                      <p><strong>Jenis Parkir:</strong> {parkirData?.jpr_nama}</p>
                      <p><strong>Tarif per Jam:</strong> Rp {parseFloat(parkirData?.jpr_perjam || 0).toLocaleString('id-ID')}</p>
                    </div>
                    <div className="col-md-6">
                      <p><strong>Waktu Masuk:</strong> {new Date(parkirData?.prk_waktumasuk).toLocaleString('id-ID')}</p>
                      {duration.roundedHours > 0 && (
                        <>
                          <p><strong>Durasi:</strong> {duration.hours} jam {duration.minutes} menit</p>
                          {/* <p><strong>Durasi Dibulatkan:</strong> <span className="badge bg-info">{duration.roundedHours} jam</span></p> */}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="prk_waktukeluar" className="form-label fw-semibold">
                        Waktu Keluar <span className="text-danger">*</span>
                      </label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        id="prk_waktukeluar"
                        name="prk_waktukeluar"
                        value={formData.prk_waktukeluar}
                        readOnly
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                      />
                      {/* <small className="text-muted">Waktu keluar bisa disesuaikan</small> */}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="prk_totaltarif" className="form-label fw-semibold">
                        Total Tarif <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg fw-bold text-success"
                        id="prk_totaltarif"
                        value={`Rp ${formData.prk_totaltarif.toLocaleString('id-ID')}`}
                        readOnly
                        disabled={isSubmitting}
                      />
                      {/* <small className="text-muted">
                        Perhitungan: {duration.roundedHours} jam × Rp {parseFloat(parkirData?.jpr_perjam || 0).toLocaleString('id-ID')} = Rp {formData.prk_totaltarif.toLocaleString('id-ID')}
                      </small> */}
                    </div>
                  </div>
                </div>

                {/* <div className="alert alert-info">
                  <strong>ℹ️ Catatan:</strong>
                  <ul className="mb-0 mt-2">
                    <li>Durasi parkir dibulatkan ke atas ke jam berikutnya</li>
                    <li>Contoh: 1 jam 10 menit = 2 jam</li>
                    <li>Minimal durasi parkir adalah 1 jam</li>
                  </ul>
                </div> */}

                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <Link 
                    to="/" 
                    className="btn btn-secondary me-md-2"
                  >
                    Batal
                  </Link>
                  <button 
                    type="submit" 
                    className="btn btn-danger"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Memproses...
                      </>
                    ) : (
                      '💾 Proses Keluar'
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

export default ParkirKeluar;
