import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import { licenseService } from "../services/api";

const LicenseForm = ({ existingLicense, onClose }) => {
  const isEdit = !!existingLicense;
  const [form, setForm] = useState({
    licenseKey: "",
    vendor: "",
    softwareName: "",
    licenseType: "PER_DEVICE",
    validFrom: "",
    validTo: "",
    maxUsage: "",
    notes: ""
  });

  useEffect(() => {
    if (existingLicense) setForm(existingLicense);
  }, [existingLicense]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form:", form);

    try {
      if (isEdit) {
        await licenseService.updateLicense(form.licenseKey, form);
        alert("License updated successfully!");
      } else {
        await licenseService.addLicense(form);
        alert("License added successfully!");
      }
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to save license");
    }
  };

  const ACCENT_COLOR = "#B2DCE2"; 
  const PRIMARY_BUTTON_COLOR = "#6596F3"; 
  const CANCEL_BUTTON_COLOR = "#F3000E"; 
  const LABEL_COLOR = "black";

  return (
    <Modal show centered onHide={onClose}>
      <Modal.Header closeButton 
        style={{ backgroundColor: ACCENT_COLOR, color: LABEL_COLOR, borderBottom: "none" }}
        closeVariant="dark" 
      >
        <Modal.Title style={{ color: LABEL_COLOR, fontWeight: "bold" }}>
          {isEdit ? " Edit License Details" : " Add New License"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: "#FFFFFF" }}>
        <Form onSubmit={handleSubmit}>
   
          <Row>
            <Col xs={12} md={isEdit ? 12 : 6}>
                {!isEdit && (
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold" style={{ color: LABEL_COLOR }}>License Key</Form.Label>
                        <Form.Control
                            name="licenseKey"
                            value={form.licenseKey}
                            onChange={handleChange}
                            style={{ borderColor: ACCENT_COLOR }}
                            required
                        />
                    </Form.Group>
                )}
            </Col>
            <Col xs={12} md={isEdit ? 6 : 6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold" style={{ color: LABEL_COLOR }}>Vendor</Form.Label>
                <Form.Control
                  name="vendor"
                  value={form.vendor}
                  onChange={handleChange}
                  style={{ borderColor: ACCENT_COLOR }}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                    <Form.Label className="fw-bold" style={{ color: LABEL_COLOR }}>Software Name</Form.Label>
                    <Form.Control
                        name="softwareName"
                        value={form.softwareName}
                        onChange={handleChange}
                        style={{ borderColor: ACCENT_COLOR }}
                        required
                    />
                </Form.Group>
            </Col>
            <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                    <Form.Label className="fw-bold" style={{ color: LABEL_COLOR }}>License Type</Form.Label>
                    <Form.Select
                        name="licenseType"
                        value={form.licenseType}
                        onChange={handleChange}
                        style={{ borderColor: ACCENT_COLOR }}
                    >
                        <option value="PER_DEVICE">PER_DEVICE</option>
                        <option value="PER_USER">PER_USER</option>
                        <option value="PER_SERVER">PER_SERVER</option>
                    </Form.Select>
                </Form.Group>
            </Col>
          </Row>
  
          <Row>
            <Col xs={12} md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold" style={{ color: LABEL_COLOR }}>Valid From</Form.Label>
                <Form.Control
                  type="date"
                  name="validFrom"
                  value={form.validFrom}
                  onChange={handleChange}
                  style={{ borderColor: ACCENT_COLOR }}
                  required
                />
              </Form.Group>
            </Col>
            <Col xs={12} md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold" style={{ color: LABEL_COLOR }}>Valid To</Form.Label>
                <Form.Control
                  type="date"
                  name="validTo"
                  value={form.validTo}
                  onChange={handleChange}
                  style={{ borderColor: ACCENT_COLOR }}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col xs={12} md={4}>
                <Form.Group className="mb-3">
                    <Form.Label className="fw-bold" style={{ color: LABEL_COLOR }}>Max Usage</Form.Label>
                    <Form.Control
                        type="number"
                        name="maxUsage"
                        value={form.maxUsage}
                        onChange={handleChange}
                        style={{ borderColor: ACCENT_COLOR }}
                        required
                    />
                </Form.Group>
            </Col>
            <Col xs={12} md={8}>
                <Form.Group className="mb-3">
                    <Form.Label className="fw-bold" style={{ color: LABEL_COLOR }}>Notes</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="notes"
                        value={form.notes}
                        onChange={handleChange}
                        style={{ borderColor: ACCENT_COLOR }}
                    />
                </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      
      <Modal.Footer className="d-flex justify-content-between">
        <Button 
            variant="secondary" 
            onClick={onClose}
            style={{ backgroundColor: CANCEL_BUTTON_COLOR, borderColor: CANCEL_BUTTON_COLOR, color: 'white', fontWeight: 'bold' }}
        >
            Cancel
        </Button>
        <Button 
            variant="primary" 
            onClick={handleSubmit}
            style={{ backgroundColor: PRIMARY_BUTTON_COLOR, borderColor: PRIMARY_BUTTON_COLOR, color: "white", fontWeight: "bold" }}
        >
            {isEdit ? "Update License" : "Add License"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LicenseForm;