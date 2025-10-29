// Alerts.js

import React, { useState, useEffect, useCallback } from "react";
import {
    Row,
    Col,
    Table,
    Button,
    Spinner,
    Alert,
    Breadcrumb,
    Card,
    Form,
} from "react-bootstrap";

import { alertService } from "../services/api"; 
import RenewalModal from "./RenewalModal"; 

const getExpirationStatus = (validTo) => {
    const today = new Date();
    const expiryDate = new Date(validTo);
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: `EXPIRED ${Math.abs(diffDays)} days ago`, variant: "danger", background: "#F3000E", color: "white" };
    if (diffDays <= 30) return { text: `Expires in ${diffDays} days`, variant: "warning", background: "#F25016", color: "white" };
    if (diffDays <= 90) return { text: `Expires in ${diffDays} days`, variant: "info", background: "#FFC107", color: "black" }; 
    return { text: "ACTIVE", variant: "success", background: "#6596F3", color: "white" }; 
};


const Alerts = () => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lookAheadDays, setLookAheadDays] = useState(30); 
    
    const [showRenewalModal, setShowRenewalModal] = useState(false);
    const [selectedLicense, setSelectedLicense] = useState(null);

    const loadAlerts = useCallback(async (days) => {
        setLoading(true);
        setError(null);
        try {
            const res = await alertService.getExpiringAlerts(days);
            setAlerts(res.data || []); 
        } catch (err) {
            setError("Failed to fetch license alerts. Please ensure the backend is running and the /alerts endpoint is available.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadAlerts(lookAheadDays);
    }, [loadAlerts, lookAheadDays]);

    const handleDaysChange = (e) => {
        const days = parseInt(e.target.value);
        if (!isNaN(days) && days > 0) {
            setLookAheadDays(days);
        }
    };
    
    const handleRenewClick = (license) => {
        setSelectedLicense(license);
        setShowRenewalModal(true);
    };

    const handleModalClose = (wasRenewed = false) => {
        setShowRenewalModal(false);
        setSelectedLicense(null);
        if (wasRenewed) {
            loadAlerts(lookAheadDays);
        }
    };

    return (
        <div className="container-fluid p-2 p-sm-4" style={{ backgroundColor: "#FFFFFF", minHeight: "100vh" }}>
            
            <Row className="mb-4 align-items-center">
                <Col>
                    <h2 style={{ color: "black", fontWeight: "bold" }}>Alerts & Notifications 🔔</h2>
                    <Breadcrumb>
                        <Breadcrumb.Item linkAs="span" style={{ color: "gray" }}>Dashboard</Breadcrumb.Item>
                        <Breadcrumb.Item active style={{ color: "#F3000E", fontWeight: "bold" }}>Alerts</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
            </Row>

            <Card className="mb-4 shadow-sm" style={{ backgroundColor: "#F25016", border: "none" }}>
                <Card.Body>
                    <Row className="align-items-center">
                        <Col xs={12} md={6}>
                            <h5 style={{ color: "white", margin: 0 }}>Expiring Licenses Check</h5>
                            <p style={{ color: "white", fontSize: "0.85rem", margin: 0 }}>Showing alerts for licenses expiring or already expired within the selected period.</p>
                        </Col>
                        <Col xs={12} md={6} className="mt-3 mt-md-0">
                            <Form.Group as={Row}>
                                <Form.Label column xs={5} style={{ color: "white", textAlign: 'right' }}>
                                    Look Ahead Days:
                                </Form.Label>
                                <Col xs={7}>
                                    <Form.Control 
                                        as="select" 
                                        value={lookAheadDays}
                                        onChange={handleDaysChange}
                                        style={{ borderColor: "white" }}
                                    >
                                        <option value={30}>30 Days (Default)</option>
                                        <option value={60}>60 Days</option>
                                        <option value={90}>90 Days</option>
                                        <option value={365}>1 Year</option>
                                    </Form.Control>
                                </Col>
                            </Form.Group>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <Card className="shadow-sm">
                <Card.Body>
                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" style={{ color: "#F25016" }} role="status" />
                            <p className="mt-2" style={{ color: "black" }}>Fetching alerts...</p>
                        </div>
                    ) : error ? (
                        <Alert variant="danger" className="text-center">{error}</Alert>
                    ) : alerts.length === 0 ? (
                        <Alert variant="success" className="text-center">
                            All Clear! No expiring or expired licenses found within the next {lookAheadDays} days.
                        </Alert>
                    ) : (
                        <div className="table-responsive">
                            <Table hover striped className="mb-0 text-center">
                                <thead style={{ backgroundColor: "#F3000E", color: "white" }}>
                                    <tr>
                                        <th>License Key</th>
                                        <th>Software</th>
                                        <th>Vendor</th>
                                        <th>Expires On</th>
                                        <th>Status/Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {alerts.map((alert) => {
                                        const status = getExpirationStatus(alert.validTo);
                                        return (
                                            <tr key={alert.licenseKey}>
                                                <td style={{ fontWeight: "bold" }}>{alert.licenseKey}</td>
                                                <td>{alert.softwareName}</td>
                                                <td>{alert.vendor}</td>
                                                <td style={{ fontWeight: "bold" }}>{alert.validTo}</td>
                                                <td>
                                                    <span style={{ 
                                                        backgroundColor: status.background, 
                                                        color: status.color,
                                                        padding: '5px 10px', 
                                                        borderRadius: '4px', 
                                                        fontWeight: 'bold',
                                                        fontSize: '0.85rem'
                                                    }}>
                                                        {status.text}
                                                    </span>
                                                    {(status.variant === 'warning' || status.variant === 'danger') && (
                                                        <Button 
                                                            variant="light" 
                                                            size="sm" 
                                                            className="ms-2" 
                                                            style={{ border: `1px solid ${status.background}`, color: status.background, fontWeight: 'bold' }}
                                                            onClick={() => handleRenewClick(alert)} 
                                                        >
                                                            Renew
                                                        </Button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </Table>
                        </div>
                    )}
                </Card.Body>
            </Card>

            {showRenewalModal && selectedLicense && (
                <RenewalModal 
                    license={selectedLicense} 
                    onClose={handleModalClose} 
                />
            )}
        </div>
    );
};

export default Alerts;