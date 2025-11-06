import React, { useState, useEffect } from 'react';
import { Button, Modal, Spinner, Alert, ListGroup, Card } from 'react-bootstrap';
import { assignmentService } from '../services/api'; 

const ViewAssignedDevicesModal = ({ licenseKey, softwareName, onClose }) => {
    const [assignedDevices, setAssignedDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadAssignedDevices = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await assignmentService.getAssignmentsByLicenseKey(licenseKey);
            setAssignedDevices(res.data || []); 
        } catch (err) {
            console.error("Failed to fetch assigned devices:", err);
            setError('Failed to fetch assigned devices. Please check API service.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAssignedDevices();
    }, [licenseKey]);

    return (
        <Modal show onHide={onClose} centered size="lg">
            <Modal.Header closeButton style={{ backgroundColor: '#B2DCE2', borderBottom: 'none' }} closeVariant="dark">
                <Modal.Title style={{ fontWeight: 'bold', color: '#6596F3' }}>
                    💻 Devices Assigned to: {softwareName}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p className="text-muted">License Key: **{licenseKey}**</p>
                <hr />

                {error && <Alert variant="danger">{error}</Alert>}
                
                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" style={{ color: '#6596F3' }} />
                        <p className="mt-2">Loading assigned devices...</p>
                    </div>
                ) : assignedDevices.length === 0 ? (
                    <Alert variant="info" className="text-center">
                        ✅ This license is currently **not assigned** to any devices.
                    </Alert>
                ) : (
                    <ListGroup variant="flush">
                        {assignedDevices.map((device) => (
                            <ListGroup.Item key={device.deviceId} className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="mb-0 fw-bold" style={{ color: '#83B366' }}>{device.deviceName}</h6>
                                    <small className="text-muted">IP: {device.ipAddress} | Location: {device.location}</small>
                                </div>
                                <Card.Text className="mb-0">
                                    <span className="badge" style={{ backgroundColor: '#B2DCE2', color: 'black' }}>
                                        ID: {device.deviceId}
                                    </span>
                                </Card.Text>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ViewAssignedDevicesModal;