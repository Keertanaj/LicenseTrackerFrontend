import axios from "axios";

const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authService={
  login: (data) => api.post('/api/auth/login', data),
  signup: (data) => api.post('/api/auth/signup', data),
}

export const deviceService = {
    addDevice: (data) => api.post('/devices', data),
    getAllDevices: () => api.get('/devices'),
    updateDevice: (deviceId, data) => api.put(`/devices/${deviceId}`, data),
    deleteDevice: (deviceId) => api.delete(`/devices/${deviceId}`),
    updateDeviceStatus: (deviceId, status) => api.put(`/devices/${deviceId}/status`, null, { params: { status } }),
    searchDevices: (ipAddress, location) => api.get(`/devices/search`, {params: { ipAddress, location },}),
    getAllLocations: () => api.get('/devices/locations'),
    getAllIpAddresses: () => api.get('/devices/ipaddresses'),
    getDeviceById: (deviceId) => api.get(`/devices/${deviceId}`)
};

export const licenseService = {
  getAllLicenses: () => api.get("/licenses"),
  addLicense: (data) => api.post("/licenses", data),
  updateLicense: (key, data) => api.put(`/licenses/${key}`, data),
  deleteLicense: (key) => api.delete(`/licenses/${key}`),
  searchLicenses: (vendor, software) => api.get(`/licenses/search?vendor=${vendor}&software=${software}`)
};

export const assignmentService = {
    assignLicense: (data) => api.post("/assignments/assignlicense", data),
    getAssignmentsByDeviceId: (deviceId) => api.get(`/assignments/device/${deviceId}`),
    getLicenseUsage: (licenseKey) => api.get(`/assignments/usage/${licenseKey}`),
    unassignLicense: (assignmentId) => api.delete(`/assignments/${assignmentId}`),
    getAssignmentsByLicenseKey: (licenseKey) => api.get(`/assignments/license/${licenseKey}`),
};

export const alertService = {
    getExpiringAlerts: (days) => {
      return api.get('/alerts', { params: { days }});
    }
};

export default api;