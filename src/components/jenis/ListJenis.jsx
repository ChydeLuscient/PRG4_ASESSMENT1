import React, { useEffect, useState } from "react";
import { listJenis } from "../../services/API";
import { Link } from 'react-router-dom';

function ListJenis() {
  const [jenis, setJenis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchJenis = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await listJenis();
      
      // Handle jika response.data adalah object dengan property data
      let jenisData = response.data;
      
      if (jenisData && typeof jenisData === 'object' && !Array.isArray(jenisData)) {
        // Coba ambil dari property yang mungkin
        jenisData = jenisData.data || jenisData.records || jenisData.jenis || [];
      }
      
      setJenis(Array.isArray(jenisData) ? jenisData : []);
    } catch (err) {
      console.error('❌ Fetch error:', err);
      setError(err.message || "Gagal mengambil data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJenis();
  }, []);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
        <h3 align='left'>🛍️ Daftar Jenis Parkir</h3>
        <h4 style={{ paddingLeft: '16px' }}>Kelola inovasi Anda dengan mudah</h4>
        </div>

        <div style={{ marginBottom: 16 }}>
          <Link to="/add-jenis">
            <button style={{ marginRight: 8 }} className="btn btn-light btn-outline-success">➕Tambah Jenis</button>
          </Link>
          <button onClick={fetchJenis} className="btn btn-outline-primary">🔄 Refresh</button>
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
                  <th style={{ border: "1px solid #ddd", textAlign: "left" }}>No</th>
                  <th style={{ border: "1px solid #ddd", textAlign: "left" }}>Nama Jenis</th>
                  <th style={{ border: "1px solid #ddd", textAlign: "left" }}>Tarif / Jam</th>
                  <th style={{ border: "1px solid #ddd", textAlign: "left" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {jenis.length === 0 && !loading ? (
                  <tr>
                    <td colSpan={4} style={{ padding: 12, textAlign: "center" }}>Tidak ada data</td>
                  </tr>
                ) : (
                  jenis.map((jenis, idx) => (
                    <tr key={jenis.jpr_id || idx}>
                      <td style={{ border: "1px solid #eee", textAlign: "right" }}>{idx + 1}</td>
                      <td style={{ border: "1px solid #eee", textAlign: "left" }}>{jenis.jpr_nama || '-'}</td>
                      <td style={{ border: "1px solid #eee", textAlign: "right" }}>
                        {jenis.jpr_perjam ? `Rp ${parseFloat(jenis.jpr_perjam).toLocaleString('id-ID')}` : '-'}
                      </td>
                      <td style={{ border: "1px solid #eee", textAlign: "left" }}>
                         {jenis.jpr_status=== 'Aktif' ? (
                          <span className="badge bg-primary">{jenis.jpr_status}</span>
                        ) : (
                          <span className="badge bg-danger ">Non-Aktif</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {jenis && jenis.length > 0 && (
        <div className="mt-3 text-muted text-center">
          <small>Menampilkan {jenis.length} Jenis Parkir</small>
        </div>
      )}
    </div>

  );
}

export default ListJenis;