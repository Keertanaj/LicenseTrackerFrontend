import axios from "axios";

// Base URL for your Spring Boot application
const API_BASE_URL = 'http://localhost:8080';

// Create a reusable Axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const deviceService = {
    addDevice: (data) => api.post('/devices', data),
    getAllDevices: () => api.get('/devices'),
    updateDevice: (deviceId, data) => api.put(`/devices/${deviceId}`, data),
    deleteDevice: (deviceId) => api.delete(`/devices/${deviceId}`),
    updateDeviceStatus: (deviceId, status) => api.put(`/devices/${deviceId}/status`, null, { 
        params: { status } 
    }),
    searchDevices: (ipAddress, location) =>
  api.get(`/devices/search`, {
    params: { ipAddress, location },
  }),
    getAllLocations: () => api.get('/devices/locations'),
    getAllIpAddresses: () => api.get('/devices/ipaddresses'),
};

export const licenseService = {
    createLicense: (data) => api.post('/licenses', data),

    /**
     * GET /licenses (listLicenses)
     * @returns {Promise<List<LicenseResponseDTO>>}
     */
    getAllLicenses: () => api.get('/licenses'),

    /**
     * PUT /licenses/{licenseId} (updateLicense)
     */
    updateLicense: (licenseId, data) => api.put(`/licenses/${licenseId}`, data),

    /**
     * DELETE /licenses/{licenseId} (deleteLicense)
     */
    deleteLicense: (licenseId) => api.delete(`/licenses/${licenseId}`),
};

export default api;