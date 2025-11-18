import React, { useEffect, useState } from "react";
import { listParkir} from "../../services/API";
import { Link } from 'react-router-dom';

function ListParkir() {
  const [parkir, setParkir] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatDateTime = (dateString) => {
    if (!dateString || dateString === '0000-00-00 00:00:00' || dateString === 'null') {
      return '-';
    }
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '-';
      return date.toLocaleString('id-ID', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const fetchParkirs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await listParkir();
      
      // Handle jika response.data adalah object dengan property data atau records
      let parkirData = response.data;
      
      if (parkirData && typeof parkirData === 'object' && !Array.isArray(parkirData)) {
        // Coba ambil dari property yang mungkin
        parkirData = parkirData.data || parkirData.records || parkirData.parkir || [];
      }
      
      setParkir(Array.isArray(parkirData) ? parkirData : []);
    } catch (err) {
      console.error('❌ Fetch error:', err);
      setError(err.message || "Gagal mengambil data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParkirs();
  }, []);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
        <h3 align='left'>🛍️ Daftar Parkir</h3>
        <h4 style={{ paddingLeft: '16px' }}>Kelola inovasi Anda dengan mudah</h4>
        </div>

        <div style={{ marginBottom: 16 }}>
          <Link to="/add-parkir">
            <button style={{ marginRight: 8 }} className="btn btn-light btn-outline-success">➕Tambah Parkir</button>
          </Link>
          <button onClick={fetchParkirs} className="btn btn-outline-primary">🔄 Refresh</button>
        </div>

        {loading && <div>Loading...</div>}
        {error && <div style={{ color: "red" }}>Error: {error}</div>}
      </div>

       <div className="card shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-dark">
                <tr>
                  <th style={{ border: "1px solid #ddd", textAlign:"left"}} >No</th>
                  <th style={{ border: "1px solid #ddd", textAlign:"left"}}>Plat Nomor</th>
                  <th style={{ border: "1px solid #ddd", textAlign:"left"}}>Jenis</th>
                  <th style={{ border: "1px solid #ddd", textAlign:"left"}}>Waktu Masuk</th>
                  <th style={{ border: "1px solid #ddd", textAlign:"left"}}>Waktu Keluar</th>
                  <th style={{ border: "1px solid #ddd", textAlign:"left"}}>Total Tarif</th>
                  <th style={{ border: "1px solid #ddd", textAlign:"left"}}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {parkir.length === 0 && !loading ? (
                  <tr>
                    <td colSpan={7} style={{ padding: 12, textAlign: "center" }}>Tidak ada data</td>
                  </tr>
                ) : (
                  parkir.map((parkir, idx) => (
                    <tr key={parkir.prk_id || idx}>
                      <td style={{ border: "1px solid #eee" , textAlign:"right"}} >{idx + 1}</td>
                      <td style={{ border: "1px solid #eee", textAlign:"left"}} >{parkir.prk_platnomor || '-'}</td>
                      <td style={{ border: "1px solid #eee", textAlign:"left"}}>
                        {parkir.jpr_nama || '-'}
                        <small className="text-muted d-block">Rp {parseFloat(parkir.jpr_perjam || 0).toLocaleString('id-ID')}/jam</small>
                      </td>
                      <td style={{ border: "1px solid #eee", textAlign:"right"}}>{formatDateTime(parkir.prk_waktumasuk)}</td>
                      <td style={{ border: "1px solid #eee", textAlign:"left"}}>
                        {parkir.prk_waktukeluar && parkir.prk_waktukeluar !== 'null' ? (
                          <span className="badge bg-success">{formatDateTime(parkir.prk_waktukeluar)}</span>
                        ) : (
                          <span className="badge bg-warning text-dark">Belum Keluar</span>
                        )}
                      </td>
                      <td style={{ border: "1px solid #eee", textAlign:"right"}}>
                        {parkir.prk_totaltarif && parseFloat(parkir.prk_totaltarif) > 0 
                          ? `Rp ${parseFloat(parkir.prk_totaltarif).toLocaleString('id-ID')}` 
                          : '-'}
                      </td>
                      <td style={{ border: "1px solid #eee", textAlign:"left"}}>
                        <Link 
                          to={`/parkir-keluar/${parkir.prk_id}`} 
                          style={{ 
                            marginRight: 8, 
                            pointerEvents: (parkir.prk_waktukeluar && parkir.prk_waktukeluar !== 'null') ? 'none' : 'auto' 
                          }}
                        >
                          <button 
                            className="btn btn-sm btn-outline-warning text-dark" 
                            disabled={parkir.prk_waktukeluar && parkir.prk_waktukeluar !== 'null'}
                          >
                            {(parkir.prk_waktukeluar && parkir.prk_waktukeluar !== 'null') ? '✅ Sudah Keluar' : '❌ Parkir Keluar'}
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {parkir && parkir.length > 0 && (
        <div className="mt-3 text-muted text-center">
          <small>Menampilkan {parkir.length} Parkir</small>
        </div>
      )}
    </div>

  );
}

export default ListParkir;