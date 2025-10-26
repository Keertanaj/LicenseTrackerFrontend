import React, { useState, useEffect } from 'react';
import { Row, Col, Table, Button, Dropdown, Spinner, Alert, Breadcrumb } from 'react-bootstrap';
import DeviceForm from './DeviceForm';
import { deviceService } from '../services/api';

const DeviceManagement = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);
  const [searchIP, setSearchIP] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [allLocations, setAllLocations] = useState([]);
  const [allIpAddresses, setAllIpAddresses] = useState([]);


  // Load devices
  const loadDevices = async () => {
    setLoading(true);
    try {
      const res = await deviceService.getAllDevices();
      setDevices(res.data || []);
    } catch (err) {
      setError('Failed to fetch devices');
    } finally {
      setLoading(false);
    }
  };

  // Load all locations
  const loadLocations = async () => {
    try {
      const res = await deviceService.getAllLocations();
      setAllLocations(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };
    const loadIpAddresses = async () => {
    try {
      const res = await deviceService.getAllIpAddresses();
      setAllIpAddresses(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadDevices();
    loadLocations();
    loadIpAddresses();
  }, []);

  // Search
   // Updated Search function using your api.js route
  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      // Calls your deviceService.searchDevices API
      const res = await deviceService.searchDevices(searchIP, searchLocation);
      setDevices(res.data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to search devices');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this device?')) return;
    try {
      await deviceService.deleteDevice(id);
      loadDevices();
    } catch (err) {
      alert(err.message);
    }
  };

  const openAddForm = () => {
    setEditingDevice(null);
    setShowForm(true);
  };

  const openEditForm = (device) => {
    setEditingDevice(device);
    setShowForm(true);
  };

  return (
    <div className="devices-page p-4">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h2 className="mb-1">Devices</h2>
          <Breadcrumb>
            <Breadcrumb.Item active>Dashboard</Breadcrumb.Item>
            <Breadcrumb.Item active>Device Management</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <Button variant="primary" onClick={openAddForm}>Add Device</Button>
      </div>

      <Row className="mb-3">
        <Col md={4}>
            <Dropdown>
            <Dropdown.Toggle variant="light" className="w-100 text-start">
              {searchIP || 'Select Ip Address'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setSearchIP('')}>All IP Addresses</Dropdown.Item>
              {allIpAddresses.map((ip) => (
                <Dropdown.Item key={ip} onClick={() => setSearchIP(ip)}>{ip}</Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Col md={4}>
          <Dropdown>
            <Dropdown.Toggle variant="light" className="w-100 text-start">
              {searchLocation || 'Select Location'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setSearchLocation('')}>All Locations</Dropdown.Item>
              {allLocations.map((loc) => (
                <Dropdown.Item key={loc} onClick={() => setSearchLocation(loc)}>{loc}</Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Col md={4} className="d-flex gap-2">
          <Button variant="primary" onClick={handleSearch}>Search</Button>
          <Button variant="secondary" onClick={() => { setSearchIP(''); setSearchLocation(''); loadDevices(); }}>Reset</Button>
        </Col>
      </Row>

      {loading ? <Spinner animation="border" /> :
        error ? <Alert variant="danger">{error}</Alert> :
        <Table hover responsive>
          <thead>
            <tr>
              <th>Device ID</th>
              <th>Name</th>
              <th>IP</th>
              <th>Type</th>
              <th>Location</th>
              <th>Model</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {devices.map(d => (
              <tr key={d.deviceId}>
                <td>{d.deviceId}</td>
                <td>{d.deviceName}</td>
                <td>{d.ipAddress}</td>
                <td>{d.deviceType}</td>
                <td>{d.location}</td>
                <td>{d.model}</td>
                <td>{d.status}</td>
                <td>{d.createdAt ? new Date(d.createdAt).toLocaleString() : '-'}</td>
                <td>{d.updatedAt ? new Date(d.updatedAt).toLocaleString() : '-'}</td>
                <td>
                  <Button variant="link" onClick={() => openEditForm(d)}>Edit</Button>
                  <Button variant="link" className="text-danger" onClick={() => handleDelete(d.deviceId)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      }

      {showForm && (
        <DeviceForm
          existingDevice={editingDevice}
          onClose={() => { setShowForm(false); loadDevices(); }}
        />
      )}
    </div>
  );
};

export default DeviceManagement;
