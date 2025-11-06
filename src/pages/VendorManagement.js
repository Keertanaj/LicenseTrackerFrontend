import React, { useState, useEffect } from "react";
import { Row, Col, Table, Button, Spinner, Alert, Breadcrumb, Card } from "react-bootstrap";
import { vendorService } from "../services/api";
import VendorForm from "../components/VendorForm"; 

const PRIMARY_ACCENT_COLOR = '#EAD094'; 
const SECONDARY_HEADER_COLOR = '#B2DCE2'; 
const EDIT_ACCENT_COLOR = '#83B366'; 
const DANGER_COLOR = '#F3000E'; 
const TEXT_COLOR = '#333333'; 
const BG_COLOR = '#F8F8F8'; 

const statusPillStyle = {
    border: `1px solid ${PRIMARY_ACCENT_COLOR}`,
    color: PRIMARY_ACCENT_COLOR,
    backgroundColor: 'white',
    fontSize: '0.75rem',
    padding: '4px 8px',
    borderRadius: '15px', 
    display: 'inline-block',
    minWidth: '90px', 
    height: '25px',
    textAlign: 'center',
    lineHeight: '16px',
    fontWeight: '600'
};

const VendorManagement = () => {
    const [vendorList, setVendorList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState(null);

    const fetchVendors = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await vendorService.getAllVendors();
            setVendorList(res.data || []);
        } catch (err) {
            setError(`Failed to fetch vendors: ${err.message || 'Check connection.'}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVendors();
    }, []);

    const openAddForm = () => {
        setSelectedVendor(null);
        setShowForm(true);
    };

    const openEditForm = (vendor) => {
        setSelectedVendor(vendor);
        setShowForm(true);
    };

    const handleSave = async (vendor) => {
        setShowForm(false);
        setSelectedVendor(null);
        try {
            if (vendor.vendorId) {
                await vendorService.updateVendor(vendor.vendorId, vendor);
            } else {
                await vendorService.addVendor(vendor);
            }
            await fetchVendors();
        } catch (err) {
            setError(`Failed to save vendor: ${err.response?.data?.message || err.message || 'Check network connection.'}`);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this vendor? This action cannot be undone.')) {
            try {
                await vendorService.deleteVendor(id);
                fetchVendors();
            } catch (err) {
                setError(`Failed to delete vendor: ${err.response?.data?.message || 'Check server permissions.'}`);
            }
        }
    };

    const VendorCard = ({ vendor }) => (
        <Card className="mb-3 shadow-sm" style={{ borderLeft: `5px solid ${PRIMARY_ACCENT_COLOR}`, borderRadius: '8px' }}>
            <Card.Body className="p-3">
                <div className="d-flex justify-content-between align-items-start">
                    <h5 className="mb-1" style={{ fontWeight: 'bold', color: TEXT_COLOR }}>{vendor.vendorName}</h5>
                    <span style={{...statusPillStyle}}>
                        ID: {vendor.vendorId}
                    </span>
                </div>
                <p className="mb-0 mt-2 text-muted" style={{ fontSize: '0.9rem'}}>
                    📧 {vendor.supportEmail}
                </p>
            </Card.Body>
            <div className="d-flex border-top">
                <Button 
                    onClick={() => openEditForm(vendor)}
                    variant="link"
                    className="p-2 fw-bold"
                    style={{ 
                        fontSize: '0.9rem',
                        width: '50%', 
                        color: EDIT_ACCENT_COLOR, 
                        borderRight: '1px solid #eee'
                    }}
                >
                    ✏️ Edit
                </Button>
                <Button 
                    onClick={() => handleDelete(vendor.vendorId)}
                    variant="link"
                    className="p-2 fw-bold"
                    style={{ 
                        fontSize: '0.9rem',
                        width: '50%', 
                        color: DANGER_COLOR, 
                    }}
                >
                    🗑️ Delete
                </Button>
            </div>
        </Card>
    );
    
    return (
        <div className="container-fluid p-2 p-sm-4" style={{ backgroundColor: BG_COLOR, minHeight: '100vh' }}>

            <Row className="mb-4 align-items-center">
                <Col xs={12} md={8}>
                    <h2 style={{ color: TEXT_COLOR, fontWeight: 'bold' }}>Vendor Management</h2>
                    <Breadcrumb>
                        <Breadcrumb.Item linkAs="span" style={{ color: 'gray' }}>Dashboard</Breadcrumb.Item>
                        <Breadcrumb.Item active style={{ color: PRIMARY_ACCENT_COLOR, fontWeight: 'bold' }}>Vendors</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col xs={12} md={4} className="d-flex justify-content-md-end mt-2 mt-md-0">
                    <Button 
                        onClick={openAddForm} 
                        style={{ backgroundColor: PRIMARY_ACCENT_COLOR, borderColor: PRIMARY_ACCENT_COLOR, color: 'white' }}
                        className="shadow-sm fw-bold w-100 w-md-auto"
                    >
                        + Add New Vendor
                    </Button>
                </Col>
            </Row>

            <Card className="shadow-sm" style={{ backgroundColor: 'white', border: 'none', borderRadius: '8px' }}>
                <Card.Body className="p-0 p-md-3">
                    {error && <Alert variant="danger" className="m-3" style={{backgroundColor: DANGER_COLOR, color: 'white', borderColor: DANGER_COLOR}}>{error}</Alert>}

                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" style={{ color: PRIMARY_ACCENT_COLOR }} role="status" />
                            <p className="mt-2" style={{ color: TEXT_COLOR }}>Loading vendors...</p>
                        </div>
                    ) : vendorList.length === 0 ? (
                        <Alert className="m-3 text-center" variant="info">
                            No vendors defined yet.
                        </Alert>
                    ) : (
                        <>
                            <div className="table-responsive d-none d-md-block">
                                <Table hover className="mb-0">
                                    <thead style={{ backgroundColor: SECONDARY_HEADER_COLOR, color: 'black' }} className="text-center">
                                        <tr>
                                            <th style={{borderTopLeftRadius: '8px'}}>ID</th>
                                            <th className="text-start">Vendor Name</th>
                                            <th>Support Email</th>
                                            <th style={{borderTopRightRadius: '8px', minWidth: '160px'}}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-center">
                                        {vendorList.map(vendor => (
                                            <tr key={vendor.vendorId}>
                                                <td style={{ fontWeight: 'bold', color: PRIMARY_ACCENT_COLOR }}>{vendor.vendorId}</td>
                                                <td className="text-start fw-bold" style={{color: TEXT_COLOR}}>{vendor.vendorName}</td>
                                                <td>{vendor.supportEmail}</td>
                                                <td className="d-flex gap-2 justify-content-center">
                                                    <Button 
                                                        onClick={() => openEditForm(vendor)}
                                                        className="p-1"
                                                        style={{ 
                                                            backgroundColor: EDIT_ACCENT_COLOR, 
                                                            borderColor: EDIT_ACCENT_COLOR, 
                                                            color: 'white',
                                                            width: '75px', 
                                                            fontSize: '0.8rem',
                                                        }}
                                                    >
                                                        ✏️ Edit
                                                    </Button>
                                                    <Button 
                                                        onClick={() => handleDelete(vendor.vendorId)}
                                                        className="p-1"
                                                        style={{ 
                                                            backgroundColor: DANGER_COLOR, 
                                                            borderColor: DANGER_COLOR, 
                                                            color: 'white',
                                                            width: '75px', 
                                                            fontSize: '0.8rem',
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
                            
                            <div className="d-md-none p-3">
                                {vendorList.map(vendor => <VendorCard key={vendor.vendorId} vendor={vendor} />)}
                            </div>
                        </>
                    )}
                </Card.Body>
            </Card>

            {showForm && (
                <VendorForm 
                    vendor={selectedVendor} 
                    onSave={handleSave} 
                    onHide={() => { setShowForm(false); setSelectedVendor(null); }} 
                    accentColor={PRIMARY_ACCENT_COLOR} 
                />
            )}
        </div>
    );
};

export default VendorManagement;