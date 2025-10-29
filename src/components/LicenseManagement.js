import React, { useState, useEffect } from "react";
import {Row,Col,Table,Button,Spinner,Alert,Breadcrumb,Form,Card,Dropdown} from "react-bootstrap";
import LicenseForm from "./LicenseForm";
import ViewAssignedDevicesModal from '../components/ViewAssignedDevicesModal'; // Import the new modal
import { licenseService } from "../services/api";

const LicenseManagement = () => {
    const [licenses, setLicenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingLicense, setEditingLicense] = useState(null);
    const [searchSoftware, setSearchSoftware] = useState("");
    const [searchVendor, setSearchVendor] = useState("");
    
    const [showDevicesModal, setShowDevicesModal] = useState(false);
    const [selectedLicenseForDevices, setSelectedLicenseForDevices] = useState(null);

    const openDevicesModal = (license) => {
        setSelectedLicenseForDevices(license);
        setShowDevicesModal(true);
    };

    const closeDevicesModal = () => {
        setShowDevicesModal(false);
        setSelectedLicenseForDevices(null);
    };

    const loadLicenses = async () => {
        setLoading(true);
        try {
            const res = await licenseService.getAllLicenses();
            setLicenses(res.data || []);
        } catch (err) {
            setError("Failed to fetch licenses");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLicenses();
    }, []);

    const handleSearch = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await licenseService.searchLicenses(searchVendor, searchSoftware);
            setLicenses(res.data || []);
        } catch (err) {
            setError("Failed to search licenses");
        } finally {
            setLoading(false);
        }
    };
    
    const handleReset = () => {
        setSearchVendor("");
        setSearchSoftware("");
        loadLicenses();
    };

    const handleDelete = async (licenseKey) => {
        if (!window.confirm("Are you sure you want to delete this license? This action cannot be undone.")) return;
        try {
            await licenseService.deleteLicense(licenseKey);
            loadLicenses();
        } catch (err) {
            alert(`Failed to delete license: ${err.message}`);
        }
    };

    const openAddForm = () => {
        setEditingLicense(null);
        setShowForm(true);
    };

    const openEditForm = (license) => {
        setEditingLicense(license);
        setShowForm(true);
    };

    const getExpirationStatus = (validTo) => {
        const today = new Date();
        const expiryDate = new Date(validTo);
        const diffTime = expiryDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return { text: "EXPIRED", background: "#F3000E", color: "white" };
        if (diffDays <= 30) return { text: `Expires in ${diffDays} days`, background: "#F25016", color: "white" };
        return { text: "ACTIVE", background: "#6596F3", color: "white" }; 
    };

    // --- MODIFIED MOBILE CARD VIEW COMPONENT ---
    const LicenseCard = ({ l }) => {
        const status = getExpirationStatus(l.validTo);
        return (
            <Card className="mb-3 shadow-sm" style={{ border: "1px solid #B2DCE2" }}>
                <Card.Body className="p-3">
                    <h5 className="mb-1" style={{ fontWeight: "bold", color: "#6596F3" }}>{l.softwareName}</h5>
                    <p className="mb-2 text-muted" style={{ fontSize: "0.85rem" }}>Key: {l.licenseKey}</p>
                    
                    <Row className="g-2 text-start" style={{ fontSize: "0.9rem" }}>
                        <Col xs={12} className="mb-2">
                            <strong>Status:</strong> 
                            <span style={{ 
                                backgroundColor: status.background, 
                                color: status.color,
                                padding: '3px 8px', 
                                borderRadius: '4px', 
                                fontWeight: 'bold',
                                fontSize: '0.8rem',
                                marginLeft: '8px'
                            }}>
                                {status.text}
                            </span>
                        </Col>
                        <Col xs={6}><strong>Vendor:</strong> {l.vendor}</Col>
                        <Col xs={6}><strong>Type:</strong> {l.licenseType}</Col>
                        <Col xs={6}><strong>Valid From:</strong> {l.validFrom}</Col>
                        <Col xs={6}><strong>Valid To:</strong> {l.validTo}</Col>
                    </Row>
                </Card.Body>
                <div className="d-flex border-top">
                    {/* NEW BUTTON FOR MOBILE CARD */}
                    <Button 
                        onClick={() => openDevicesModal(l)}
                        style={{ fontSize: '0.9rem', padding: '8px 0', width: '33.33%', borderRadius: '0', backgroundColor: '#B2DCE2', borderColor: '#B2DCE2', color: 'black' }}
                    >
                        🖥️ View
                    </Button>
                    <Button 
                        onClick={() => openEditForm(l)}
                        style={{ fontSize: '0.9rem', padding: '8px 0', width: '33.33%', borderRadius: '0', backgroundColor: '#83B366', borderColor: '#83B366', color: 'white' }}
                    >
                        ✏️ Edit
                    </Button>
                    <Button 
                        onClick={() => handleDelete(l.licenseKey)}
                        style={{ fontSize: '0.9rem', padding: '8px 0', width: '33.33%', borderRadius: '0', backgroundColor: '#F3000E', borderColor: '#F3000E', color: 'white' }}
                    >
                        🗑️ Delete
                    </Button>
                </div>
            </Card>
        );
    };
    // --- END MODIFIED MOBILE CARD VIEW COMPONENT ---
    
    const actionButtonStyle = {
        width: '70px', 
        textAlign: 'center', 
        fontSize: '0.8rem',
        padding: '3px 0' 
    };

    // Increase minWidth to accommodate the new button
    const actionCellMinWidth = { minWidth: "210px" }; 

    return (
        <div className="container-fluid p-2 p-sm-4" style={{ backgroundColor: "#FFFFFF", minHeight: "100vh" }}>
            
            {/* Header and Add Button (Unchanged) */}
            <Row className="mb-4 align-items-center">
                <Col xs={12} md={8}>
                    <h2 style={{ color: "black", fontWeight: "bold" }}>License Management 📝</h2>
                    <Breadcrumb>
                        <Breadcrumb.Item linkAs="span" style={{ color: "gray" }}>Dashboard</Breadcrumb.Item>
                        <Breadcrumb.Item active style={{ color: "#6596F3", fontWeight: "bold" }}>Licenses</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col xs={12} md={4} className="d-flex justify-content-md-end mt-2 mt-md-0">
                    <Button
                        onClick={openAddForm}
                        style={{ backgroundColor: "#6596F3", borderColor: "#6596F3", color: "white" }}
                        className="shadow-sm fw-bold w-100 w-md-auto"
                    >
                        + Add New License
                    </Button>
                </Col>
            </Row>

            {/* Filter Card (Unchanged) */}
            <Card className="mb-4 shadow-sm" style={{ backgroundColor: "#B2DCE2", border: "none" }}>
                 {/* ... (Filter Card content is unchanged) ... */}
                <Card.Body>
                    <h5 style={{ color: "white" }} className="mb-3">Filter Licenses</h5>
                    <Row className="g-2 g-md-3 align-items-end">
                        <Col xs={12} md={4}>
                            <Form.Label style={{ color: "white" }}>Filter by Vendor</Form.Label>
                            <Form.Control
                                placeholder="e.g., Microsoft"
                                value={searchVendor}
                                onChange={(e) => setSearchVendor(e.target.value)}
                                style={{ borderColor: "white" }}
                            />
                        </Col>
                        <Col xs={12} md={4}>
                            <Form.Label style={{ color: "white" }}>Filter by Software</Form.Label>
                            <Form.Control
                                placeholder="e.g., Windows OS"
                                value={searchSoftware}
                                onChange={(e) => setSearchSoftware(e.target.value)}
                                style={{ borderColor: "white" }}
                            />
                        </Col>
                        <Col xs={12} md={4} className="d-flex gap-2 mt-4 mt-md-0">
                            <Button
                                onClick={handleSearch}
                                style={{ backgroundColor: "#6596F3", borderColor: "#6596F3", color: "white" }}
                                className="flex-grow-1 fw-bold"
                            >
                                Search
                            </Button>
                            <Button
                                onClick={handleReset}
                                style={{ backgroundColor: "#83B366", borderColor: "#83B366", color: "white" }}
                                className="flex-grow-1 fw-bold"
                            >
                                Reset
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>


            {/* License List View */}
            <Card className="shadow-sm" style={{ backgroundColor: "white", border: "none" }}>
                <Card.Body>
                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" style={{ color: "#6596F3" }} role="status" />
                            <p className="mt-2" style={{ color: "black" }}>Loading licenses...</p>
                        </div>
                    ) : error ? (
                        <Alert variant="danger" className="text-center" style={{backgroundColor: "#F3000E", color: "white", borderColor: "#F3000E"}}>{error}</Alert>
                    ) : licenses.length === 0 ? (
                        <Alert style={{ backgroundColor: "#D7EAAC", color: "black", borderColor: "#83B366" }} className="text-center">
                            No licenses found matching your criteria.
                        </Alert>
                    ) : (
                        <>
                            {/* Desktop/Tablet View: Full Table */}
                            <div className="table-responsive d-none d-md-block">
                                <Table hover striped className="mb-0 text-center">
                                    <thead style={{ backgroundColor: "#83B366", color: "white" }}>
                                        <tr>
                                            <th>Key</th>
                                            <th>Vendor</th>
                                            <th>Software</th>
                                            <th>Type</th>
                                            <th>Valid To</th>
                                            <th>Max Usage</th>
                                            <th>Status</th>
                                            <th style={actionCellMinWidth}>Actions</th> {/* Use the wider style here */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {licenses.map((l) => {
                                            const status = getExpirationStatus(l.validTo);
                                            return (
                                                <tr key={l.licenseKey}>
                                                    <td style={{ fontWeight: "bold" }}>{l.licenseKey}</td>
                                                    <td>{l.vendor}</td>
                                                    <td>{l.softwareName}</td>
                                                    <td>{l.licenseType}</td>
                                                    <td style={{ fontWeight: "bold" }}>{l.validTo}</td>
                                                    <td>{l.maxUsage}</td>
                                                    <td>
                                                        <span style={{ 
                                                            backgroundColor: status.background, 
                                                            color: status.color,
                                                            padding: '4px 8px', 
                                                            borderRadius: '4px', 
                                                            fontWeight: 'bold',
                                                            fontSize: '0.8rem'
                                                        }}>
                                                            {status.text}
                                                        </span>
                                                    </td>
                                                    <td className="d-flex gap-2 justify-content-center">
                                                        {/* NEW BUTTON FOR DESKTOP TABLE */}
                                                        <Button 
                                                            onClick={() => openDevicesModal(l)}
                                                            style={{ ...actionButtonStyle, backgroundColor: "#6596F3", borderColor: "#6596F3", color: "white" }}
                                                            title="View Assigned Devices"
                                                        >
                                                            🖥️ View
                                                        </Button>
                                                        <Button 
                                                            onClick={() => openEditForm(l)}
                                                            style={{ ...actionButtonStyle, backgroundColor: "#83B366", borderColor: "#83B366", color: "white" }}
                                                            title="Edit License"
                                                        >
                                                            ✏️ Edit
                                                        </Button>
                                                        <Button
                                                            onClick={() => handleDelete(l.licenseKey)}
                                                            style={{ ...actionButtonStyle, backgroundColor: "#F3000E", borderColor: "#F3000E", color: "white" }}
                                                            title="Delete License"
                                                        >
                                                            🗑️ Del
                                                        </Button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </Table>
                            </div>
                            <div className="d-md-none">
                                {licenses.map(l => <LicenseCard key={l.licenseKey} l={l} />)}
                            </div>
                        </>
                    )}
                </Card.Body>
            </Card>

            {/* Modals for Forms */}
            {showForm && (
                <LicenseForm
                    existingLicense={editingLicense}
                    onClose={() => {
                        setShowForm(false);
                        loadLicenses();
                    }}
                />
            )}
            {showDevicesModal && selectedLicenseForDevices && (
                <ViewAssignedDevicesModal
                    licenseKey={selectedLicenseForDevices.licenseKey}
                    softwareName={selectedLicenseForDevices.softwareName}
                    onClose={closeDevicesModal}
                />
            )}
        </div>
    );
};

export default LicenseManagement;