import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";

const SOFTWARE_ACCENT_COLOR = '#D3A4EA';
const PRIMARY_ACTION_COLOR = '#83B366';
const DANGER_COLOR = '#F3000E';
const TEXT_COLOR = '#000000';

const SoftwareStatus = {
    INSTALLED: 'INSTALLED',
    OUTDATED: 'OUTDATED',
    MAINTENANCE: 'MAINTENANCE',
    UNAVAILABLE: 'UNAVAILABLE'
};

const SoftwareForm = ({ software: existingSoftware, onHide, onSave }) => { 
    const isEdit = !!existingSoftware;
    const onClose = onHide; 
    
    const initialFormState = {
        softwareName: '',
        currentVersion: '',
        latestVersion: '',
        status: SoftwareStatus.INSTALLED, 
        lastChecked: new Date().toISOString().substring(0, 10), 
    };

    const [form, setForm] = useState(initialFormState);

    useEffect(() => {
        if (existingSoftware) {
            setForm({
                ...existingSoftware,
                lastChecked: existingSoftware.lastChecked 
                    ? new Date(existingSoftware.lastChecked).toISOString().substring(0, 10) 
                    : new Date().toISOString().substring(0, 10),
            });
        }
    }, [existingSoftware]);

    const handleChange = (e) => {
        const value = e.target.value;
        setForm({ ...form, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        onSave(form);
    };
    
    const inputStyle = {
        borderColor: SOFTWARE_ACCENT_COLOR, 
        padding: '0.75rem 1rem',
    };
    
    return (
        <Modal 
            show 
            onHide={onHide} 
            centered
            size="lg" 
        >
            <Modal.Header 
                style={{ 
                    backgroundColor: SOFTWARE_ACCENT_COLOR, 
                    color: 'white', 
                    borderBottom: 'none', 
                    padding: '1rem 1.5rem'
                }} 
                closeButton 
                closeVariant="white"
            >
                <div style={{ width: '100%', textAlign: 'center' }}>
                    <Modal.Title style={{ fontWeight: '600' }}>
                        {isEdit ? 'Update Software Entry' : 'Add New Software Type'}
                    </Modal.Title>
                </div>
            </Modal.Header>
            
            <Modal.Body style={{ backgroundColor: '#FFFFFF', padding: '2rem' }}>
                <Form onSubmit={handleSubmit}>
                    
                    <Row className="mb-3">
                        <Col md={12}>
                            <Form.Group>
                                <Form.Label style={{ fontWeight: 'bold', color: TEXT_COLOR, fontSize: '1rem' }}>
                                    Software Name
                                </Form.Label>
                                <Form.Control
                                    name="softwareName"
                                    type="text"
                                    value={form.softwareName}
                                    onChange={handleChange}
                                    placeholder="e.g., Microsoft Office 365, AutoCAD"
                                    style={inputStyle}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label style={{ fontWeight: 'bold', color: TEXT_COLOR, fontSize: '1rem' }}>
                                    Current Version
                                </Form.Label>
                                <Form.Control
                                    name="currentVersion"
                                    type="text"
                                    value={form.currentVersion}
                                    onChange={handleChange}
                                    placeholder="e.g., 16.0.1234.5"
                                    style={inputStyle}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label style={{ fontWeight: 'bold', color: TEXT_COLOR, fontSize: '1rem' }}>
                                    Latest Version
                                </Form.Label>
                                <Form.Control
                                    name="latestVersion"
                                    type="text"
                                    value={form.latestVersion}
                                    onChange={handleChange}
                                    placeholder="e.g., 16.0.5432.1"
                                    style={inputStyle}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    
                    <Row className="mb-4">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label style={{ fontWeight: 'bold', color: TEXT_COLOR, fontSize: '1rem' }}>
                                    Status
                                </Form.Label>
                                <Form.Select
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                    style={inputStyle}
                                    required
                                >
                                    {Object.values(SoftwareStatus).map(status => (
                                        <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label style={{ fontWeight: 'bold', color: TEXT_COLOR, fontSize: '1rem' }}>
                                    Last Checked Date
                                </Form.Label>
                                <Form.Control
                                    name="lastChecked"
                                    type="date"
                                    value={form.lastChecked}
                                    onChange={handleChange}
                                    style={inputStyle}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    
                    <button type="submit" style={{ display: 'none' }}></button>
                </Form>
            </Modal.Body>
            
            <Modal.Footer className="d-flex justify-content-between p-3 border-top" style={{ backgroundColor: '#F9F9F9' }}>
                <Button 
                    variant="secondary" 
                    onClick={onClose} // Using onClose which is now assigned onHide
                    style={{ 
                        backgroundColor: DANGER_COLOR, 
                        borderColor: DANGER_COLOR, 
                        color: 'white', 
                        fontWeight: 'bold',
                        padding: '0.5rem 1.5rem'
                    }}
                >
                    Cancel
                </Button>
                <Button 
                    variant="primary" 
                    onClick={handleSubmit}
                    style={{ 
                        backgroundColor: PRIMARY_ACTION_COLOR,
                        borderColor: PRIMARY_ACTION_COLOR, 
                        color: 'white', 
                        fontWeight: 'bold',
                        padding: '0.5rem 1.5rem'
                    }}
                >
                    {isEdit ? "Update Software" : "Add Software"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default SoftwareForm;