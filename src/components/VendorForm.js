import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";

const PRIMARY_ACTION_COLOR = '#EAD094';
const DANGER_COLOR = '#F3000E';         
const TEXT_COLOR = '#000000';

const VendorForm = ({ vendor: existingVendor, onHide, onSave, accentColor }) => { 
    const isEdit = !!existingVendor;
    const onClose = onHide; 

    const initialFormState = {
        vendorName: '',
        supportEmail: '',
    };

    const [form, setForm] = useState(initialFormState);

    useEffect(() => {
        if (existingVendor) {
            setForm({
                vendorId: existingVendor.vendorId, 
                vendorName: existingVendor.vendorName || '',
                supportEmail: existingVendor.supportEmail || '',
            });
        }
    }, [existingVendor]);

    const handleChange = (e) => {
        const value = e.target.value;
        setForm({ ...form, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        onSave(form);
    };
   
    const inputStyle = {
        borderColor: accentColor || '#D3A4EA', 
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
                    backgroundColor: accentColor || '#D3A4EA', 
                    color: 'white', 
                    borderBottom: 'none', 
                    padding: '1rem 1.5rem'
                }} 
                closeButton 
                closeVariant="white"
            >
                <div style={{ width: '100%', textAlign: 'center' }}>
                    <Modal.Title style={{ fontWeight: '600' }}>
                        {isEdit ? 'Update Vendor' : 'Add New Vendor'}
                    </Modal.Title>
                </div>
            </Modal.Header>
            
            <Modal.Body style={{ backgroundColor: '#FFFFFF', padding: '2rem' }}>
                <Form onSubmit={handleSubmit}>
                    
                    <Row className="mb-3">
                        <Col md={12}>
                            <Form.Group>
                                <Form.Label style={{ fontWeight: 'bold', color: TEXT_COLOR, fontSize: '1rem' }}>
                                    Vendor Name
                                </Form.Label>
                                <Form.Control
                                    name="vendorName"
                                    type="text"
                                    value={form.vendorName}
                                    onChange={handleChange}
                                    placeholder="e.g., Cisco, Microsoft, Palo Alto"
                                    style={inputStyle}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-4">
                        <Col md={12}>
                            <Form.Group>
                                <Form.Label style={{ fontWeight: 'bold', color: TEXT_COLOR, fontSize: '1rem' }}>
                                    Support Email
                                </Form.Label>
                                <Form.Control
                                    name="supportEmail"
                                    type="email"
                                    value={form.supportEmail}
                                    onChange={handleChange}
                                    placeholder="support@vendor.com"
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
                    onClick={onClose} 
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
                        backgroundColor: PRIMARY_ACTION_COLOR, // Green for Save
                        borderColor: PRIMARY_ACTION_COLOR, 
                        color: 'white', 
                        fontWeight: 'bold',
                        padding: '0.5rem 1.5rem'
                    }}
                >
                    {isEdit ? "Update Vendor" : "Add Vendor"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default VendorForm;