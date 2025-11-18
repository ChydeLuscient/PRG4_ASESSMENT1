import axios from 'axios';

const BASE_URL = 'https://prg4.roniprsty.com';

// API untuk Jenis Parkir
export const jenisParkirAPI = {
  //getJenisParkir: () => axios.get(`${BASE_URL}/jenis/read.php`)
  getJenisParkir: () => axios.get(`${BASE_URL}/jenis/read2.php`),
  createJenisParkir: (data) => axios.post(`${BASE_URL}/jenis/create.php`, data)
};

// API untuk Parkir
export const parkirAPI = {
  //getParkir: () => axios.get(`${BASE_URL}/parkir/read.php`)
  getParkir: () => axios.get(`${BASE_URL}/parkir/read2.php`),
  createParkir: (data) => {
    const jsonData = {
      prk_platnomor: data.prk_platnomor || '',
      prk_waktumasuk: data.prk_waktumasuk || '',
      prk_waktukeluar: data.prk_waktukeluar || '',
      prk_totaltarif: data.prk_totaltarif || '0',
      jpr_id: data.jpr_id || ''
    };
    
    return axios.post(`${BASE_URL}/parkir/masuk.php`, jsonData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  },
  updateParkir: (data) => {
    const jsonData = {
      prk_id: data.prk_id,
      prk_waktukeluar: data.prk_waktukeluar,
      prk_totaltarif: data.prk_totaltarif
    };
    
    return axios.put(`${BASE_URL}/parkir/keluar.php`, jsonData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

// helper functions Jenis Parkir
export const listJenisParkir = () => jenisParkirAPI.getJenisParkir();
export const addJenisParkir = (data) => jenisParkirAPI.createJenisParkir(data);

// komponen jenis
export const listJenis = () => jenisParkirAPI.getJenisParkir();
export const addJenis = (data) => jenisParkirAPI.createJenisParkir(data);

// helper functions untuk Parkir
export const listParkir = () => parkirAPI.getParkir();
export const addParkir = (data) => parkirAPI.createParkir(data);
export const updateParkirKeluar = (data) => parkirAPI.updateParkir(data);

// ambil ID
export const getParkirById = async (id) => {
  const response = await parkirAPI.getParkir();
  let parkirList = response.data;
  
  // jika response.data adalah object
  if (parkirList && typeof parkirList === 'object' && !Array.isArray(parkirList)) {
    parkirList = parkirList.data || parkirList.records || parkirList.parkir || [];
  }
  
  // cek parkirList adalah array
  if (!Array.isArray(parkirList)) {
    throw new Error('Format data tidak valid');
  }
  
  const parkir = parkirList.find(p => p.prk_id === id || p.prk_id === parseInt(id));
  if (!parkir) {
    throw new Error('Data parkir tidak ditemukan');
  }
  return { data: parkir };
};