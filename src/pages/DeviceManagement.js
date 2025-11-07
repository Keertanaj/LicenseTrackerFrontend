import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Table, Button, Dropdown, Spinner, Alert, Breadcrumb, Card, Form, Pagination } from 'react-bootstrap';
import DeviceForm from '../components/DeviceForm';
import { deviceService } from '../services/api';
import AssignLicenseModal from '../components/AssignLicenseModal'; 
import ViewSoftwareModal from '../components/ViewSoftwareModal'; // 💡 IMPORTED NEW MODAL

const PRIMARY_BLUE = '#6596F3';
const ACCENT_GREEN = '#83B366';
const ERROR_RED = '#F3000E';
const WARNING_ORANGE = '#F25016';
const SECONDARY_HEADER = '#B2DCE2';
const MAIN_BG_COLOR = '#FFFFFF'; 

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
    const [feedbackMessage, setFeedbackMessage] = useState(null); 
    const [currentPage, setCurrentPage] = useState(1);
    const devicesPerPage = 5; 
    
    const [csvFile, setCsvFile] = useState(null);
    const fileInputRef = useRef(null);

    // 💡 NEW STATE FOR SOFTWARE MODAL
    const [showSoftwareModal, setShowSoftwareModal] = useState(false);
    const [deviceDetailsName, setDeviceDetailsName] = useState('');

    const openAssignmentModal = (deviceId) => {
        setSelectedDeviceId(deviceId);
        setShowAssignmentModal(true);
    };

    const closeAssignmentModal = () => {
        setShowAssignmentModal(false);
        setSelectedDeviceId(null);
        loadDevices(); 
    };

    // 💡 NEW HANDLER FOR SOFTWARE STATUS MODAL
    const openSoftwareModal = (deviceId, deviceName) => {
        setSelectedDeviceId(deviceId);
        setDeviceDetailsName(deviceName);
        setShowSoftwareModal(true);
    };

    const closeSoftwareModal = () => {
        setShowSoftwareModal(false);
        // We reload devices/locations in case the device status was changed
        loadDevices();
        loadLocations(); 
    }

    const displayFeedback = (message, variant = 'danger') => {
        setFeedbackMessage({ message, variant });
        setTimeout(() => setFeedbackMessage(null), 5000); 
    };

    const loadDevices = async () => {
        setLoading(true);
        try {
            const res = await deviceService.getAllDevices();
            setDevices(res.data || []);
            setError(null); 
            setCurrentPage(1);
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
        setFeedbackMessage(null); 
        try {
            const res = await deviceService.searchDevices(searchIP, searchLocation);
            if (res.data && res.data.length === 0) {
                displayFeedback("No devices found matching your criteria.", 'info');
                setDevices([]);
            } else {
                setDevices(res.data || []);
                setCurrentPage(1);
            }
        } catch (err) {
            console.error(err);
            displayFeedback('Search failed. Check API response.', 'danger'); 
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
        if (device.status !== 'DECOMMISSIONED') {
            displayFeedback('Device must be DECOMMISSIONED before deletion. Please update the status first.', 'warning');
            return; 
        }

        try {
            await deviceService.deleteDevice(device.deviceId);
            loadDevices(); 
            displayFeedback(`Device ${device.deviceId} deleted successfully.`, 'success');
        } catch (err) {
            console.error("Delete failed:", err);
            displayFeedback(`Failed to delete device: ${err.response?.data?.message || 'Unexpected error.'}`, 'danger');
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setCsvFile(file);
            displayFeedback(`File selected: ${file.name}`, 'info');
        } else {
            setCsvFile(null);
            displayFeedback("No file selected.", 'warning');
        }
    };
    
    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleBulkUpload = async () => {
        if (!csvFile) {
            displayFeedback("Please select a CSV file to upload.", 'warning');
            return;
        }

        setLoading(true);
        setFeedbackMessage(null);

        try {
            const formData = new FormData();
            formData.append('file', csvFile);
            
            console.log("Simulating Bulk Upload of:", csvFile.name);
            await new Promise(resolve => setTimeout(resolve, 1500)); 
            
            loadDevices();
            displayFeedback(`Successfully processed bulk upload of ${csvFile.name}.`, 'success');
            setCsvFile(null); 
            document.getElementById('bulk-upload-input-hidden').value = null; 

        } catch (err) {
            console.error("Bulk upload failed:", err);
            displayFeedback(`Bulk upload failed: ${err.response?.data?.message || 'Server error processing file.'}`, 'danger');
        } finally {
            setLoading(false);
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
        width: '25%', // Adjusted width for 4 buttons on mobile
        borderRadius: '0',
    };
    
    const getStatusBadge = (status) => {
        let backgroundColor;
        let color = 'white'; 
        switch (status) {
            case 'ACTIVE':
                backgroundColor = ACCENT_GREEN;
                break;
            case 'MAINTENANCE':
                backgroundColor = WARNING_ORANGE; 
                break;
            case 'OBSOLETE':
            case 'DECOMMISSIONED':
                backgroundColor = ERROR_RED; 
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
                    width: '140px',
                    textAlign: 'center'
                }}
            >
                {status}
            </span>
        );
    };

    const DeviceCard = ({ d }) => (
        <Card className="mb-3 shadow-sm" style={{ border: '1px solid #B2DCE2' }}>
            <Card.Body className="p-3">
                <h5 className="mb-1" style={{ fontWeight: 'bold', color: ERROR_RED }}>{d.deviceName}</h5>
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
                    style={{ ...actionButtonMobileStyle, backgroundColor: ACCENT_GREEN, borderColor: ACCENT_GREEN, color: 'white' }}
                >
                    Assign
                </Button>
                <Button 
                    onClick={() => openSoftwareModal(d.deviceId, d.deviceName)} // 💡 NEW BUTTON ACTION
                    style={{ ...actionButtonMobileStyle, backgroundColor: PRIMARY_BLUE, borderColor: PRIMARY_BLUE, color: 'white' }}
                >
                    SW Status
                </Button>
                <Button 
                    onClick={() => openEditForm(d)}
                    style={{ ...actionButtonMobileStyle, backgroundColor: PRIMARY_BLUE, borderColor: PRIMARY_BLUE, color: 'white' }}
                >
                    Edit
                </Button>
                <Button 
                    onClick={() => handleDelete(d)}
                    style={{ ...actionButtonMobileStyle, backgroundColor: ERROR_RED, borderColor: ERROR_RED, color: 'white' }}
                >
                    Delete
                </Button>
            </div>
        </Card>
    );
    
    const indexOfLastDevice = currentPage * devicesPerPage;
    const indexOfFirstDevice = indexOfLastDevice - devicesPerPage;
    const currentDevices = devices.slice(indexOfFirstDevice, indexOfLastDevice);
    const totalPages = Math.ceil(devices.length / devicesPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const renderPagination = () => {
        if (devices.length === 0) return null;

        let items = [];
        const totalPages = Math.ceil(devices.length / devicesPerPage);
        
        for (let number = 1; number <= totalPages; number++) {
            items.push(
                <Pagination.Item 
                    key={number} 
                    active={number === currentPage} 
                    onClick={() => paginate(number)}
                    style={{
                        backgroundColor: number === currentPage ? PRIMARY_BLUE : 'white',
                        borderColor: PRIMARY_BLUE,
                        color: number === currentPage ? 'white' : PRIMARY_BLUE,
                        fontWeight: 'bold',
                        transition: 'background-color 0.2s', 
                    }}
                >
                    {number}
                </Pagination.Item>,
            );
        }

        return (
            <Pagination className="justify-content-center mt-3">
                <Pagination.Prev 
                    onClick={() => paginate(currentPage - 1)} 
                    disabled={currentPage === 1} 
                    style={{ color: PRIMARY_BLUE, borderColor: PRIMARY_BLUE }}
                />
                {items}
                <Pagination.Next 
                    onClick={() => paginate(currentPage + 1)} 
                    disabled={currentPage === totalPages} 
                    style={{ color: PRIMARY_BLUE, borderColor: PRIMARY_BLUE }}
                />
            </Pagination>
        );
    };

    return (
        <div className="container-fluid p-2 p-sm-4" style={{ backgroundColor: MAIN_BG_COLOR, minHeight: '100vh' }}>

            <Row className="mb-4 align-items-center">
                <Col xs={12} md={6}>
                    <h2 style={{ color: 'black', fontWeight: 'bold' }}>Device Management </h2>
                    <Breadcrumb>
                        <Breadcrumb.Item linkAs="span" style={{ color: 'gray' }}>Dashboard</Breadcrumb.Item>
                        <Breadcrumb.Item active style={{ color: ACCENT_GREEN, fontWeight: 'bold' }}>Devices</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                
                <Col xs={12} md={6} className="d-flex flex-wrap justify-content-md-end gap-3 mt-2 mt-md-0">
                    
                    {/* Bulk Upload Controls */}
                    <div className="d-flex align-items-center gap-2">
                        
                        {/* HIDDEN FILE INPUT (Receives the file) */}
                        <Form.Control
                            type="file"
                            id="bulk-upload-input-hidden"
                            onChange={handleFileChange}
                            accept=".csv"
                            ref={fileInputRef} 
                            style={{ display: 'none' }} 
                            disabled={loading}
                        />
                        
                        {/* STYLED BUTTON (Triggers the click event on the hidden input) */}
                        <Button
                            onClick={handleButtonClick}
                            style={{ 
                                backgroundColor: MAIN_BG_COLOR, 
                                borderColor: PRIMARY_BLUE, 
                                color: PRIMARY_BLUE,
                                borderStyle: 'dashed' 
                            }}
                            className="shadow-sm fw-bold w-auto"
                            disabled={loading}
                        >
                            {csvFile ? `File: ${csvFile.name.substring(0, 10)}...` : 'Select CSV File'}
                        </Button>
                        
                        {/* UPLOAD BUTTON (Only active when csvFile state is set) */}
                        <Button
                            onClick={handleBulkUpload}
                            style={{ backgroundColor: PRIMARY_BLUE, borderColor: PRIMARY_BLUE, color: 'white' }}
                            className="shadow-sm fw-bold w-auto"
                            disabled={loading || !csvFile} 
                        >
                            Upload
                        </Button>
                    </div>

                    {/* Standard Add Device Button */}
                    <Button 
                        onClick={openAddForm}
                        style={{ backgroundColor: ACCENT_GREEN, borderColor: ACCENT_GREEN, color: 'white' }}
                        className="shadow-sm fw-bold w-100 w-md-auto"
                        disabled={loading}
                    >
                        + Add New Device
                    </Button>
                </Col>
            </Row>

            <Card className="mb-4 shadow-sm" style={{ backgroundColor: PRIMARY_BLUE, border: 'none' }}>
                <Card.Body>
                    <h5 style={{ color: 'white' }} className="mb-3">Filter Device List</h5>
                    <Row className="g-2 g-md-3 align-items-end">
                        
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

                        <Col xs={12} md={4} className="d-flex gap-2 mt-4 mt-md-0">
                            <Button 
                                onClick={handleSearch}
                                style={{ backgroundColor: ACCENT_GREEN, borderColor: ACCENT_GREEN, color: 'white' }}
                                className="flex-grow-1 fw-bold"
                            >
                                Search
                            </Button>
                            <Button 
                                onClick={handleReset}
                                style={{ backgroundColor: ERROR_RED, borderColor: ERROR_RED, color: 'white' }}
                                className="flex-grow-1 fw-bold"
                            >
                                Reset
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {feedbackMessage && (
                <Alert 
                    variant={feedbackMessage.variant} 
                    onClose={() => setFeedbackMessage(null)} 
                    dismissible 
                    className="mb-4 text-center"
                    style={{ 
                        backgroundColor: feedbackMessage.variant === 'danger' ? ERROR_RED : (feedbackMessage.variant === 'warning' ? WARNING_ORANGE : (feedbackMessage.variant === 'success' ? ACCENT_GREEN : PRIMARY_BLUE)),
                        color: 'white',
                        borderColor: 'transparent'
                    }}
                >
                    {feedbackMessage.message}
                </Alert>
            )}

            <Card className="shadow-sm" style={{ backgroundColor: 'white', border: 'none' }}>
                <Card.Body>
                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" style={{ color: ACCENT_GREEN }} role="status" />
                            <p className="mt-2" style={{ color: ERROR_RED }}>Loading devices...</p>
                        </div>
                    ) : error ? (
                        <Alert variant="danger" className="text-center" style={{backgroundColor: ERROR_RED, color: 'white', borderColor: ERROR_RED}}>{error}</Alert>
                    ) : devices.length === 0 ? (
                        <Alert style={{ backgroundColor: '#D7EAAC', color: 'black', borderColor: ACCENT_GREEN }} className="text-center">
                            No devices found matching your criteria.
                        </Alert>
                    ) : (
                        <>
                            <div className="table-responsive d-none d-md-block">
                                <Table hover striped className="mb-0">
                                    <thead style={{ backgroundColor: SECONDARY_HEADER, color: 'black' }} className="text-center">
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
                                        {currentDevices.map(d => ( 
                                            <tr key={d.deviceId}>
                                                <td style={{ fontWeight: 'bold', color: ERROR_RED }}>{d.deviceId}</td>
                                                <td>{d.deviceName}</td>
                                                <td>{d.ipAddress}</td>
                                                <td>{d.deviceType}</td>
                                                <td>{d.location}</td>
                                                <td>{getStatusBadge(d.status)}</td>
                                                
                                                <td className="d-flex gap-2 justify-content-center align-items-center">
                                                    <Button 
                                                        onClick={() => openAssignmentModal(d.deviceId)}
                                                        style={{ ...actionButtonStyle, backgroundColor: ACCENT_GREEN, borderColor: ACCENT_GREEN, color: 'white' }}
                                                        title="Assign License"
                                                    >
                                                        Assign
                                                    </Button>
                                                    <Button 
                                                        onClick={() => openSoftwareModal(d.deviceId, d.deviceName)} // 💡 NEW ACTION
                                                        style={{ ...actionButtonStyle, backgroundColor: PRIMARY_BLUE, borderColor: PRIMARY_BLUE, color: 'white' }}
                                                        title="View Software Status"
                                                    >
                                                        SW Status
                                                    </Button>
                                                    <Button 
                                                        onClick={() => openEditForm(d)}
                                                        style={{ ...actionButtonStyle, backgroundColor: PRIMARY_BLUE, borderColor: PRIMARY_BLUE, color: 'white' }}
                                                        title="Edit Details"
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button 
                                                        onClick={() => handleDelete(d)}
                                                        style={{ ...actionButtonStyle, backgroundColor: ERROR_RED, borderColor: ERROR_RED, color: 'white' }}
                                                        title="Delete Device"
                                                    >
                                                        Del
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                            
                            <div className="d-md-none">
                                {currentDevices.map(d => <DeviceCard key={d.deviceId} d={d} />)}
                            </div>
                            
                            {renderPagination()}
                        </>
                    )}
                </Card.Body>
            </Card>
            
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
            {showSoftwareModal && selectedDeviceId && (
                <ViewSoftwareModal
                    deviceId={selectedDeviceId}
                    deviceName={deviceDetailsName}
                    show={showSoftwareModal}
                    onClose={closeSoftwareModal}
                />
            )}
        </div>
    );
};

export default DeviceManagement;