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

export const authService = {
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
    searchLicenses: (vendorName, software) => api.get(`/licenses/search?vendor=${vendorName}&software=${software}`),
    getAllVendors: () => api.get("/licenses/vendors"),
    getAllSoftware: () => api.get("/licenses/software")
};

export const vendorService = {
    getAllVendors: () => api.get("/vendors"), 
    addVendor: (data) => api.post("/vendors", data),
    updateVendor: (id, data) => api.put(`/vendors/${id}`, data),
    deleteVendor: (id) => api.delete(`/vendors/${id}`), 
};
export const softwareService = {
    
    getAllSoftware: () => api.get("/software"),
    addSoftware: (data) => api.post("/software", data),
    updateSoftware: (id, data) => api.put(`/software/${id}`, data),
    deleteSoftware: (id) => api.delete(`/software/${id}`)
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

export const dashboardService = {
    getMetrics: () => api.get("/dashboard/metrics"),
    getExpiringLicenses: () => api.get("/dashboard/expiringlicenses"),
    getDevicesAtRisk: (days) => api.get("/dashboard/devicesatrisk")
};

export const reportService = {
    getReport: (queryString) => api.get(`/reports/licenses?${queryString}`)
}

export const userService = {
    getUsers: () => api.get('/users'),
    createUser: (data) => api.post('/users', data),
    assignRole: (userId, data) => api.put(`/users/${userId}/role`, data),
    deleteUser: (userId) => api.delete(`/users/${userId}`) 
};

export const auditLogService = {
    getLogs: (filters) => api.get(`/auditlogs`, { params: filters }) 
} 

export const roleService = {
    getRoles: () => api.get('/roles') 
}

export const aiService = {
    getSummary: (sessionId, query, filters) => api.post('/ai/query', 
        { 
            query: query,
            ...filters 
        },
        { 
            params: { sessionId }
        }
    ),
};

export default api;