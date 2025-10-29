import React, { useState } from 'react';
import { Modal, Button, Form, Alert, Row, Col, Spinner } from 'react-bootstrap';
import { licenseService } from '../services/api';

const calculateNewValidTo = (currentValidTo, duration) => {
    let baseDate = new Date(currentValidTo);
    const today = new Date();
    
    if (baseDate.getTime() < today.getTime()) {
        baseDate = today;
    } else {
        baseDate.setDate(baseDate.getDate() + 1);
    }

    let newDate = new Date(baseDate);
    newDate.setMonth(newDate.getMonth() + duration);

    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, '0');
    const day = String(newDate.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

const RenewalModal = ({ license, onClose }) => {
    const [durationMonths, setDurationMonths] = useState(12);
    const [newValidTo, setNewValidTo] = useState(
        calculateNewValidTo(license.validTo, 12)
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const handleDurationChange = (e) => {
        const months = parseInt(e.target.value);
        setDurationMonths(months);
        setNewValidTo(calculateNewValidTo(license.validTo, months));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            const updateData = {
                validTo: newValidTo,
            };

            await licenseService.updateLicense(license.licenseKey, updateData);
            
            onClose(true); 
        } catch (err) {
            setError(`Renewal failed: ${err.response?.data?.message || err.message}.`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show onHide={() => onClose(false)} size="md" centered>
            <Modal.Header closeButton style={{ backgroundColor: "#F25016", color: "white" }}>
                <Modal.Title>Renew License: {license.licenseKey}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    
                    <Alert variant="info" className="mb-3">
                        Software: {license.softwareName} ({license.vendor})
                        <br/>
                        Current Expiry: {license.validTo}
                    </Alert>

                    <Form.Group as={Row} className="mb-3" controlId="formRenewalDuration">
                        <Form.Label column sm={5}>Renewal Period</Form.Label>
                        <Col sm={7}>
                            <Form.Select value={durationMonths} onChange={handleDurationChange} required>
                                <option value={3}>3 Months</option>
                                <option value={6}>6 Months</option>
                                <option value={12}>1 Year</option>
                                <option value={24}>2 Years</option>
                            </Form.Select>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formNewValidTo">
                        <Form.Label column sm={5}>**New Expiration Date**</Form.Label>
                        <Col sm={7}>
                            <Form.Control 
                                type="date" 
                                value={newValidTo} 
                                readOnly
                                required
                                style={{ backgroundColor: '#e9ecef', fontWeight: 'bold' }}
                            />
                        </Col>
                    </Form.Group>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => onClose(false)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button 
                        type="submit" 
                        style={{ backgroundColor: "#F25016", borderColor: "#F25016" }} 
                        disabled={loading}
                    >
                        {loading ? <Spinner animation="border" size="sm" /> : 'Confirm Renewal'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default RenewalModal;