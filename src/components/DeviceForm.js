import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import { deviceService } from "../services/api";

const DeviceForm = ({ existingDevice, onClose }) => {
  const isEdit = !!existingDevice;
  const [form, setForm] = useState({
    deviceId: "",
    deviceName: "",
    ipAddress: "",
    deviceType: "",
    location: "",
    model: "",
    status: ""
  });

  useEffect(() => {
    if (existingDevice) setForm(existingDevice);
  }, [existingDevice]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isEdit) {
        await deviceService.updateDevice(form.deviceId, form);
        alert("Device updated successfully!");
      } else {
        await deviceService.addDevice(form);
        alert("Device added successfully!");
      }
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to save device");
    }
  };

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header 
        // Header uses the Soft Green for a professional, calming focus
        style={{ backgroundColor: '#6596F3', color: 'white', borderBottom: 'none' }} 
        closeButton 
        closeVariant="white"
      >
        <Modal.Title>{isEdit ? "Edit Device Details" : "Add New Device"}</Modal.Title>
      </Modal.Header>
      
      <Modal.Body style={{ backgroundColor: '#FFFFFF' }}>
        <Form onSubmit={handleSubmit}>
          
          {/* Row 1: Device ID (only for Add) and Device Name */}
          <Row>
            <Col xs={12} md={isEdit ? 12 : 6}>
                {!isEdit && (
                    <Form.Group className="mb-3">
                        <Form.Label style={{ fontWeight: 'bold', color: 'black' }}>Device ID</Form.Label>
                        <Form.Control
                            name="deviceId"
                            value={form.deviceId}
                            onChange={handleChange}
                            // Inputs use the Soft Green for a professional look
                            style={{ borderColor: '#83B366' }}
                            required
                        />
                    </Form.Group>
                )}
            </Col>
            <Col xs={12} md={isEdit ? 6 : 6}>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: 'bold', color: 'black' }}>Device Name</Form.Label>
                <Form.Control
                  name="deviceName"
                  value={form.deviceName}
                  onChange={handleChange}
                  style={{ borderColor: '#83B366' }}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Row 2: IP Address and Device Type */}
          <Row>
            <Col xs={12} md={6}>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: 'bold', color: 'black' }}>IP Address</Form.Label>
                <Form.Control
                  name="ipAddress"
                  value={form.ipAddress}
                  onChange={handleChange}
                  style={{ borderColor: '#83B366' }}
                />
              </Form.Group>
            </Col>
            <Col xs={12} md={6}>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: 'bold', color: 'black' }}>Type</Form.Label>
                <Form.Control
                  name="deviceType"
                  value={form.deviceType}
                  onChange={handleChange}
                  style={{ borderColor: '#83B366' }}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Row 3: Location and Model */}
          <Row>
            <Col xs={12} md={6}>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: 'bold', color: 'black' }}>Location</Form.Label>
                <Form.Control
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  style={{ borderColor: '#83B366' }}
                />
              </Form.Group>
            </Col>
            <Col xs={12} md={6}>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: 'bold', color: 'black' }}>Model</Form.Label>
                <Form.Control
                  name="model"
                  value={form.model}
                  onChange={handleChange}
                  style={{ borderColor: '#83B366' }}
                />
              </Form.Group>
            </Col>
          </Row>
          
          {/* Row 4: Status */}
          <Form.Group className="mb-3">
            <Form.Label style={{ fontWeight: 'bold', color: 'black' }}>Status</Form.Label>
            <Form.Select
              name="status"
              value={form.status}
              onChange={handleChange}
              style={{ borderColor: '#83B366' }}
              required
            >
              <option value="">Select Status</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="MAINTENANCE">MAINTENANCE</option>
              <option value="OBSOLETE">OBSOLETE</option>
              <option value="DECOMMISSIONED">DECOMMISSIONED</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      
      <Modal.Footer className="d-flex justify-content-between">
        <Button 
          variant="secondary" 
          onClick={onClose}

          style={{ backgroundColor: '#F3000E', borderColor: '#6596F3', color: 'white', fontWeight: 'bold' }}
        >
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSubmit}
          // Primary action button uses the Soft Green
          style={{ backgroundColor: '#6596F3', borderColor: '#6596F3', color: 'white', fontWeight: 'bold' }}
        >
          {isEdit ? "Update Device" : " Add Device"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeviceForm;