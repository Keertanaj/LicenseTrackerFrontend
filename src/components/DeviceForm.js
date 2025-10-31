import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import { deviceService } from "../services/api";

const PRIMARY_COLOR = '#6596F3'; // Define the main blue color

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
        style={{ backgroundColor: PRIMARY_COLOR, color: 'white', borderBottom: 'none' }} 
        closeButton 
        closeVariant="white"
      >
        <div style={{ width: '100%', textAlign: 'center' }}>
          <Modal.Title>{isEdit ? "Edit Device Details" : "Add New Device"}</Modal.Title>
        </div>
      </Modal.Header>
      
      <Modal.Body style={{ backgroundColor: '#FFFFFF' }}>
        <Form onSubmit={handleSubmit}>
          
          <Row>
            <Col xs={12} md={isEdit ? 12 : 6}>
                {!isEdit && (
                    <Form.Group className="mb-3">
                        <Form.Label style={{ fontWeight: 'bold', color: 'black' }}>Device ID</Form.Label>
                        <Form.Control
                            name="deviceId"
                            value={form.deviceId}
                            onChange={handleChange}
                            style={{ borderColor: PRIMARY_COLOR }}
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
                  style={{ borderColor: PRIMARY_COLOR }}
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
                  style={{ borderColor: PRIMARY_COLOR }}
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
                  style={{ borderColor: PRIMARY_COLOR }}
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
                  style={{ borderColor: PRIMARY_COLOR }}
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
                  style={{ borderColor: PRIMARY_COLOR }}
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
              style={{ borderColor: PRIMARY_COLOR }}
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
          style={{ backgroundColor: '#F3000E', borderColor: '#F3000E', color: 'white', fontWeight: 'bold' }}
        >
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSubmit}
          style={{ backgroundColor: PRIMARY_COLOR, borderColor: PRIMARY_COLOR, color: 'white', fontWeight: 'bold' }}
        >
          {isEdit ? "Update Device" : " Add Device"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeviceForm;