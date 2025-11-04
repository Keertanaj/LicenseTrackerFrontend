import React, { useState, useEffect } from 'react';
import { Row, Col, Table, Button, Spinner, Alert, Breadcrumb, Card } from 'react-bootstrap';
import { softwareService } from '../services/api';
import SoftwareForm from '../components/SoftwareForm'; 

// --- COLOR THEME CONSTANTS ---
const PRIMARY_ACTION_COLOR = '#D3A4EA';     // Purple: Add Button, Success, Accent
const SECONDARY_HEADER_COLOR = '#F2A900'; // GOLD/Orange: Main card headers/accents, Edit Button
const TABLE_HEAD_COLOR = '#B2DCE2';        // Light Blue: Table Header Background
const DANGER_COLOR = '#F3000E';           // Red: Delete, Error Text
const ACCENT_COLOR_TEXT = '#D3A4EA';      // Purple: Key text (like ID/Name)

const statusPillStyle = {
    backgroundColor: PRIMARY_ACTION_COLOR,
    color: 'white',
    fontSize: '0.75rem', // Smaller text size
    padding: '4px 8px',
    borderRadius: '5px',
    display: 'inline-block',
    minWidth: '90px', 
    height: '25px',
    textAlign: 'center',
    lineHeight: '16px', // Centers the smaller text vertically
};

const SoftwareManagement = () => {
    const [softwareList, setSoftwareList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showForm, setShowForm] = useState(false);
    const [selectedSoftware, setSelectedSoftware] = useState(null);

    const fetchSoftware = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await softwareService.getAllSoftware();
            setSoftwareList(res.data || []);
        } catch (err) {
            setError('Failed to fetch software list.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSoftware();
    }, []);

    const openAddForm = () => {
        setSelectedSoftware(null);
        setShowForm(true);
    };

    const openEditForm = (software) => {
        setSelectedSoftware(software);
        setShowForm(true);
    };

    const handleSave = async (software) => {
        setShowForm(false);
        setSelectedSoftware(null);
        try {
            if (software.id) {
                await softwareService.updateSoftware(software.id, software);
            } else {
                await softwareService.addSoftware(software);
            }
            await fetchSoftware();
        } catch (err) {
            setError(`Failed to save software: ${err.message || 'Check network connection.'}`);
        }
    };

    const handleDelete = async (software) => {
        if (window.confirm('Are you sure you want to delete this software? This action cannot be undone.')) {
            try {
                await softwareService.deleteSoftware(software.id);
                fetchSoftware();
            } catch (err) {
                setError('Failed to delete software.');
            }
        }
    };

    // --- MOBILE CARD VIEW COMPONENT (UPDATED STATUS STYLE) ---
    const SoftwareCard = ({ sw }) => (
        <Card className="mb-3 shadow-sm" style={{ border: `1px solid ${TABLE_HEAD_COLOR}` }}>
            <Card.Body className="p-3">
                <h5 className="mb-1" style={{ fontWeight: 'bold', color: SECONDARY_HEADER_COLOR }}>{sw.softwareName}</h5>
                <p className="mb-2 text-muted" style={{ fontSize: '0.85rem' }}>ID: {sw.id}</p>
                <small className="d-block">
                    **V. Current:** {sw.currentVersion} | **V. Latest:** {sw.latestVersion}
                </small>
                <small className="d-block mb-2">
                    **Status:** <span style={statusPillStyle}>
                        {sw.status}
                    </span>
                </small>
                <small className="d-block text-secondary">
                    Last Checked: {sw.lastChecked}
                </small>
            </Card.Body>
            <div className="d-flex border-top">
                <Button 
                    onClick={() => openEditForm(sw)}
                    style={{ 
                        fontSize: '0.9rem',
                        padding: '8px 0',
                        width: '50%', 
                        borderRadius: '0',
                        backgroundColor: PRIMARY_ACTION_COLOR, 
                        borderColor: PRIMARY_ACTION_COLOR, 
                        color: 'white' 
                    }}
                >
                    ✏️ Edit
                </Button>
                <Button 
                    onClick={() => handleDelete(sw)}
                    style={{ 
                        fontSize: '0.9rem',
                        padding: '8px 0',
                        width: '50%', 
                        borderRadius: '0',
                        backgroundColor: DANGER_COLOR, 
                        borderColor: DANGER_COLOR, 
                        color: 'white' 
                    }}
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
                    <h2 style={{ color: 'black', fontWeight: 'bold' }}>Software Management</h2>
                    <Breadcrumb>
                        <Breadcrumb.Item linkAs="span" style={{ color: 'gray' }}>Dashboard</Breadcrumb.Item>
                        <Breadcrumb.Item active style={{ color: PRIMARY_ACTION_COLOR, fontWeight: 'bold' }}>Software</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col xs={12} md={4} className="d-flex justify-content-md-end mt-2 mt-md-0">
                    <Button 
                        onClick={openAddForm} 
                        style={{ backgroundColor: PRIMARY_ACTION_COLOR, borderColor: PRIMARY_ACTION_COLOR, color: 'white' }}
                        className="shadow-sm fw-bold w-100 w-md-auto"
                    >
                        + Add New Software
                    </Button>
                </Col>
            </Row>

            <Card className="shadow-sm" style={{ backgroundColor: 'white', border: 'none' }}>
                <Card.Body>
                    {error && <Alert variant="danger" style={{backgroundColor: DANGER_COLOR, color: 'white', borderColor: DANGER_COLOR}}>{error}</Alert>}

                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" style={{ color: PRIMARY_ACTION_COLOR }} role="status" />
                            <p className="mt-2" style={{ color: SECONDARY_HEADER_COLOR }}>Loading software...</p>
                        </div>
                    ) : softwareList.length === 0 ? (
                        <Alert style={{ backgroundColor: TABLE_HEAD_COLOR, color: 'black', borderColor: PRIMARY_ACTION_COLOR }} className="text-center">
                            No software defined yet.
                        </Alert>
                    ) : (
                        <>
                            {/* Desktop/Tablet View: Full Table - UPDATED STATUS STYLE */}
                            <div className="table-responsive d-none d-md-block">
                                <Table hover striped className="mb-0">
                                    <thead style={{ backgroundColor: TABLE_HEAD_COLOR, color: 'black' }} className="text-center">
                                        <tr>
                                            <th>ID</th>
                                            <th className="text-start">Software Name</th>
                                            <th>Current V.</th>
                                            <th>Latest V.</th>
                                            <th>Status</th>
                                            <th>Last Checked</th>
                                            <th style={{ minWidth: '160px' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-center">
                                        {softwareList.map(sw => (
                                            <tr key={sw.id}>
                                                <td style={{ fontWeight: 'bold', color: ACCENT_COLOR_TEXT }}>{sw.id}</td>
                                                <td className="text-start fw-bold">{sw.softwareName}</td>
                                                <td>{sw.currentVersion}</td>
                                                <td>{sw.latestVersion}</td>
                                                <td>
                                                    <span style={statusPillStyle}>
                                                        {sw.status}
                                                    </span>
                                                </td>
                                                <td>{sw.lastChecked}</td>
                                                <td className="d-flex gap-2 justify-content-center">
                                                    <Button 
                                                        variant="warning" 
                                                        onClick={() => openEditForm(sw)}
                                                        style={{ 
                                                            backgroundColor: SECONDARY_HEADER_COLOR, 
                                                            borderColor: SECONDARY_HEADER_COLOR, 
                                                            color: 'white',
                                                            width: '75px', 
                                                            textAlign: 'center', 
                                                            fontSize: '0.8rem',
                                                            padding: '3px 0' 
                                                        }}
                                                    >
                                                        ✏️ Edit
                                                    </Button>
                                                    <Button 
                                                        variant="danger" 
                                                        onClick={() => handleDelete(sw.id)}
                                                        style={{ 
                                                            backgroundColor: DANGER_COLOR, 
                                                            borderColor: DANGER_COLOR, 
                                                            color: 'white',
                                                            width: '75px', 
                                                            textAlign: 'center', 
                                                            fontSize: '0.8rem',
                                                            padding: '3px 0'
                                                        }}
                                                    >
                                                        🗑️ Del
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                            
                            {/* Mobile View: Stacked Cards (UPDATED STATUS STYLE) */}
                            <div className="d-md-none">
                                {softwareList.map(sw => <SoftwareCard key={sw.id} sw={sw} />)}
                            </div>
                        </>
                    )}
                </Card.Body>
            </Card>

            {/* Software Form Modal */}
            {showForm && (
                <SoftwareForm 
                    software={selectedSoftware} 
                    onSave={handleSave} 
                    onHide={() => { setShowForm(false); setSelectedSoftware(null); }} 
                />
            )}
        </div>
    );
};

export default SoftwareManagement;