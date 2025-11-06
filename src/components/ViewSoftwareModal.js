import React, { useState, useEffect } from 'react';
import { Modal, Button, Spinner, Alert, Row, Col, Badge } from 'react-bootstrap';
import { deviceService } from '../services/api';

const PRIMARY_BLUE = '#6596F3';
const ACCENT_GREEN = '#83B366';
const ERROR_RED = '#F3000E';
const WARNING_ORANGE = '#F25016';

const ViewSoftwareModal = ({ deviceId, deviceName, show, onClose }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [renewalStatus, setRenewalStatus] = useState(null);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await deviceService.getSoftwareStatus(deviceId);
            setData(res.data);
            setRenewalStatus(null);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load software details.");
            setData(null);
        } finally {
            setLoading(false);
        }
    };

    const handleRenew = async () => {
        setLoading(true);
        setRenewalStatus(null);
        try {
            await deviceService.renewSoftwareVersion(deviceId);
            setRenewalStatus({ message: "Version successfully renewed!", variant: 'success' });
            loadData(); 
        } catch (err) {
            setRenewalStatus({ message: err.response?.data?.message || "Renewal failed.", variant: 'danger' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (show) {
            loadData();
        }
    }, [show, deviceId]);

    const renderDetails = () => {
        if (loading) return <div className="text-center py-4"><Spinner animation="border" style={{ color: PRIMARY_BLUE }} /></div>;
        if (error) return <Alert variant="danger">{error}</Alert>;
        if (!data) return <p className="text-muted">No primary software installation found for this device.</p>;

        // 🎯 FINAL FIX: Use the specific variable names 'currentVersion' and 'latestVersion'
        // The software is outdated if the installed version is NOT strictly equal to the latest version.
        const isOutdated = data.currentVersion !== data.latestVersion;
        
        return (
            <>
                <Alert variant={isOutdated ? 'danger' : 'success'} style={{ backgroundColor: isOutdated ? WARNING_ORANGE : ACCENT_GREEN, color: 'white', borderColor: 'transparent' }}>
                    Status: <strong>{isOutdated ? 'OUTDATED - UPDATE RECOMMENDED' : 'CURRENT'}</strong>
                </Alert>
                
                <Row className="mb-3">
                    <Col md={6}><strong>Software:</strong> {data.softwareName}</Col>
                    <Col md={6}><strong>Vendor Status:</strong> {data.status}</Col>
                </Row>
                
                <Row className="mb-4">
                    <Col md={6}>
                        <strong>Installed Version:</strong> 
                        <Badge bg={isOutdated ? 'danger' : 'success'} className="ms-2" style={{ backgroundColor: isOutdated ? ERROR_RED : ACCENT_GREEN }}>
                            {data.currentVersion} 
                        </Badge>
                    </Col>
                    <Col md={6}>
                        <strong>Latest Version:</strong> 
                        <Badge bg="info" className="ms-2" style={{ backgroundColor: PRIMARY_BLUE }}>
                            {data.latestVersion}
                        </Badge>
                    </Col>
                </Row>
                
                {renewalStatus && <Alert variant={renewalStatus.variant} dismissible onClose={() => setRenewalStatus(null)}>{renewalStatus.message}</Alert>}
                
                {/* Renew Button is correctly visible only when isOutdated is true */}
                {isOutdated && (
                    <Button 
                        onClick={handleRenew} 
                        style={{ backgroundColor: WARNING_ORANGE, borderColor: WARNING_ORANGE }}
                        disabled={loading}
                    >
                        {loading ? <Spinner animation="border" size="sm" /> : 'Force Renew/Update Version'}
                    </Button>
                )}
            </>
        );
    };

    return (
        <Modal show={show} onHide={onClose} centered size="lg">
            <Modal.Header closeButton style={{ backgroundColor: PRIMARY_BLUE, color: 'white' }}>
                <Modal.Title>Software Status: {deviceName || deviceId}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{renderDetails()}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose} disabled={loading}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ViewSoftwareModal;