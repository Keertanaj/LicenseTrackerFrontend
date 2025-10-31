import React, { useState, useEffect } from 'react';
import { Row, Col, Table, Button, Dropdown, Spinner, Alert, Breadcrumb, Card, Form } from 'react-bootstrap';
import DeviceForm from './DeviceForm';
import { deviceService } from '../services/api';
import AssignLicenseModal from '../components/AssignLicenseModal'; 

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
    const [showAssignmentModal, setShowAssignmentModal] = useState(false);
    const [selectedDeviceId, setSelectedDeviceId] = useState(null);

    const openAssignmentModal = (deviceId) => {
        setSelectedDeviceId(deviceId);
        setShowAssignmentModal(true);
    };

    const closeAssignmentModal = () => {
        setShowAssignmentModal(false);
        setSelectedDeviceId(null);
        loadDevices(); 
    };

 
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

    const handleSearch = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await deviceService.searchDevices(searchIP, searchLocation);
            if (res.data && res.data.length === 0) {
                setError("No such devices");
                setDevices([]);
            } else {
                setDevices(res.data || []);
            }
        } catch (err) {
            console.error(err);
            setError('YOOOHOO');
        } finally {
            setLoading(false);
        }
    };
    
    const handleReset = () => {
        setSearchIP(''); 
        setSearchLocation(''); 
        loadDevices();
    };

    const handleDelete = async (device) => {
        // Frontend check before making the API call
        if (device.status !== 'DECOMMISSIONED') {
            alert('Device must be DECOMMISSIONED before deletion. Please update the status first.');
            return; // Stop the function
        }

        if (!window.confirm('Are you sure you want to delete this decommissioned device? This action cannot be undone.')) {
            return;
        }

        try {
            await deviceService.deleteDevice(device.deviceId);
            loadDevices(); // Refresh list on success
        } catch (err) {
            // This will now only catch unexpected server/network errors
            console.error("Delete failed:", err);
            alert(`Failed to delete device. An unexpected error occurred.`);
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

    const actionButtonStyle = {
        width: '75px', 
        textAlign: 'center', 
        fontSize: '0.8rem',
        padding: '3px 0' 
    };
    const actionButtonMobileStyle = {
        fontSize: '0.9rem',
        padding: '8px 0',
        width: '33.33%', 
        borderRadius: '0',
    };
    
    const getStatusBadge = (status) => {
        let backgroundColor;
        let color = 'white'; 
        switch (status) {
            case 'ACTIVE':
                backgroundColor = '#83B366';
                break;
            case 'MAINTENANCE':
                backgroundColor = '#F25016'; 
                break;
            case 'OBSOLETE':
            case 'DECOMMISSIONED':
                backgroundColor = '#F3000E'; 
                break;
            default:
                backgroundColor = '#D7EAAC'; 
                color = 'black'; 
        }
        return (
            <span 
                style={{ 
                    backgroundColor: backgroundColor, 
                    color: color, 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontWeight: 'bold',
                    fontSize: '0.8rem',
                    display: 'inline-block',
                    width: '110px',
                    textAlign: 'center'
                }}
            >
                {status}
            </span>
        );
    };

    // --- MOBILE CARD VIEW COMPONENT ---
    const DeviceCard = ({ d }) => (
        <Card className="mb-3 shadow-sm" style={{ border: '1px solid #B2DCE2' }}>
            <Card.Body className="p-3">
                <h5 className="mb-1" style={{ fontWeight: 'bold', color: '#F3000E' }}>{d.deviceName}</h5>
                <p className="mb-2 text-muted" style={{ fontSize: '0.85rem' }}>ID: {d.deviceId} | IP: {d.ipAddress}</p>
                
                <Row className="g-2 text-start" style={{ fontSize: '0.9rem' }}>
                    <Col xs={6}><strong>Location:</strong> {d.location}</Col>
                    <Col xs={6}><strong>Type:</strong> {d.deviceType}</Col>
                    <Col xs={6}><strong>Model:</strong> {d.model || '-'}</Col>
                    <Col xs={6}><strong className="me-2">Status:</strong> {getStatusBadge(d.status)}</Col>
                </Row>
            </Card.Body>
            <div className="d-flex border-top">
                <Button 
                    onClick={() => openAssignmentModal(d.deviceId)}
                    style={{ ...actionButtonMobileStyle, backgroundColor: '#83B366', borderColor: '#83B366', color: 'white' }}
                >
                    🔗 Assign
                </Button>
                <Button 
                    onClick={() => openEditForm(d)}
                    style={{ ...actionButtonMobileStyle, backgroundColor: '#6596F3', borderColor: '#6596F3', color: 'white' }}
                >
                    ✏️ Edit
                </Button>
                <Button 
                    onClick={() => handleDelete(d)}
                    style={{ ...actionButtonMobileStyle, backgroundColor: '#F3000E', borderColor: '#F3000E', color: 'white' }}
                >
                    🗑️ Delete
                </Button>
            </div>
        </Card>
    );

    return (
        <div className="container-fluid p-2 p-sm-4" style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>

            <Row className="mb-4 align-items-center">
                <Col xs={12} md={8}>
                    <h2 style={{ color: 'black', fontWeight: 'bold' }}>Device Management </h2>
                    <Breadcrumb>
                        <Breadcrumb.Item linkAs="span" style={{ color: 'gray' }}>Dashboard</Breadcrumb.Item>
                        <Breadcrumb.Item active style={{ color: '#83B366', fontWeight: 'bold' }}>Devices</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col xs={12} md={4} className="d-flex justify-content-md-end mt-2 mt-md-0">
                    <Button 
                        onClick={openAddForm}
                        style={{ backgroundColor: '#83B366', borderColor: '#83B366', color: 'white' }}
                        className="shadow-sm fw-bold w-100 w-md-auto"
                    >
                        + Add New Device
                    </Button>
                </Col>
            </Row>

            {/* Search and Filter Card */}
            <Card className="mb-4 shadow-sm" style={{ backgroundColor: '#6596F3', border: 'none' }}>
                <Card.Body>
                    <h5 style={{ color: 'white' }} className="mb-3">Filter Device List</h5>
                    <Row className="g-2 g-md-3 align-items-end">
                        
                        {/* IP Address Filter */}
                        <Col xs={12} md={4}>
                            <Form.Label style={{ color: 'white' }}>Filter by IP Address</Form.Label>
                            <Dropdown className="w-100">
                                <Dropdown.Toggle 
                                    className="w-100 text-start"
                                    style={{ backgroundColor: 'white', color: 'black', borderColor: '#D7EAAC' }}
                                >
                                    {searchIP || 'All IP Addresses'}
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="w-100">
                                    <Dropdown.Item onClick={() => setSearchIP('')}>All IP Addresses</Dropdown.Item>
                                    {allIpAddresses.map((ip) => (
                                        <Dropdown.Item key={ip} onClick={() => setSearchIP(ip)}>{ip}</Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>

                        {/* Location Filter */}
                        <Col xs={12} md={4}>
                            <Form.Label style={{ color: 'white' }}>Filter by Location</Form.Label>
                            <Dropdown className="w-100">
                                <Dropdown.Toggle 
                                    className="w-100 text-start"
                                    style={{ backgroundColor: 'white', color: 'black', borderColor: '#D7EAAC' }}
                                >
                                    {searchLocation || 'All Locations'}
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="w-100">
                                    <Dropdown.Item onClick={() => setSearchLocation('')}>All Locations</Dropdown.Item>
                                    {allLocations.map((loc) => (
                                        <Dropdown.Item key={loc} onClick={() => setSearchLocation(loc)}>{loc}</Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>

                        {/* Search and Reset Buttons */}
                        <Col xs={12} md={4} className="d-flex gap-2 mt-4 mt-md-0">
                            <Button 
                                onClick={handleSearch}
                                style={{ backgroundColor: '#83B366', borderColor: '#83B366', color: 'white' }}
                                className="flex-grow-1 fw-bold"
                            >
                                Search
                            </Button>
                            <Button 
                                onClick={handleReset}
                                style={{ backgroundColor: '#F3000E', borderColor: '#F3000E', color: 'white' }}
                                className="flex-grow-1 fw-bold"
                            >
                                Reset
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Device List View */}
            <Card className="shadow-sm" style={{ backgroundColor: 'white', border: 'none' }}>
                <Card.Body>
                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" style={{ color: '#83B366' }} role="status" />
                            <p className="mt-2" style={{ color: '#F3000E' }}>Loading devices...</p>
                        </div>
                    ) : error ? (
                        <Alert variant="danger" className="text-center" style={{backgroundColor: '#F3000E', color: 'white', borderColor: '#F3000E'}}>{error}</Alert>
                    ) : devices.length === 0 ? (
                        <Alert style={{ backgroundColor: '#D7EAAC', color: 'black', borderColor: '#83B366' }} className="text-center">
                            No devices found matching your criteria.
                        </Alert>
                    ) : (
                        <>
                            {/* Desktop/Tablet View: Full Table */}
                            <div className="table-responsive d-none d-md-block">
                                <Table hover striped className="mb-0">
                                    <thead style={{ backgroundColor: '#B2DCE2', color: 'black' }} className="text-center">
                                        <tr>
                                            <th>Device ID</th>
                                            <th>Name</th> 
                                            <th>IP</th>
                                            <th>Type</th>
                                            <th>Location</th>
                                            <th>Status</th>
                                            <th style={{ minWidth: '240px' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-center">
                                        {devices.map(d => (
                                            <tr key={d.deviceId}>
                                                <td style={{ fontWeight: 'bold', color: '#F3000E' }}>{d.deviceId}</td>
                                                <td>{d.deviceName}</td>
                                                <td>{d.ipAddress}</td>
                                                <td>{d.deviceType}</td>
                                                <td>{d.location}</td>
                                                <td>{getStatusBadge(d.status)}</td>
                                                
                                                <td className="d-flex gap-2 justify-content-center align-items-center">
                                                    <Button 
                                                        onClick={() => openAssignmentModal(d.deviceId)}
                                                        style={{ ...actionButtonStyle, backgroundColor: '#83B366', borderColor: '#83B366', color: 'white' }}
                                                        title="Assign License"
                                                    >
                                                        🔗 Assign
                                                    </Button>
                                                    <Button 
                                                        onClick={() => openEditForm(d)}
                                                        style={{ ...actionButtonStyle, backgroundColor: '#6596F3', borderColor: '#6596F3', color: 'white' }}
                                                        title="Edit Details"
                                                    >
                                                        ✏️ Edit
                                                    </Button>
                                                    <Button 
                                                        onClick={() => handleDelete(d)}
                                                        style={{ ...actionButtonStyle, backgroundColor: '#F3000E', borderColor: '#F3000E', color: 'white' }}
                                                        title="Delete Device"
                                                    >
                                                        🗑️ Del
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                            
                            {/* Mobile View: Stacked Cards */}
                            <div className="d-md-none">
                                {devices.map(d => <DeviceCard key={d.deviceId} d={d} />)}
                            </div>
                        </>
                    )}
                </Card.Body>
            </Card>
            
            {/* Modals for Forms */}
            {showAssignmentModal && selectedDeviceId && (
                <AssignLicenseModal
                    deviceId={selectedDeviceId}
                    onClose={closeAssignmentModal}
                />
            )}
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