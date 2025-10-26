import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
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

  return (
    <Modal show centered onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{isEdit ? "Edit License" : "Add License"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {!isEdit && (
            <Form.Group className="mb-3">
              <Form.Label>License Key</Form.Label>
              <Form.Control
                name="licenseKey"
                value={form.licenseKey}
                onChange={handleChange}
                required
              />
            </Form.Group>
          )}
          <Form.Group className="mb-3">
            <Form.Label>Vendor</Form.Label>
            <Form.Control
              name="vendor"
              value={form.vendor}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Software Name</Form.Label>
            <Form.Control
              name="softwareName"
              value={form.softwareName}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>License Type</Form.Label>
            <Form.Select
              name="licenseType"
              value={form.licenseType}
              onChange={handleChange}
            >
              <option value="PER_DEVICE">PER_DEVICE</option>
              <option value="PER_USER">PER_USER</option>
              <option value="PER_SERVER">PER_SERVER</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Valid From</Form.Label>
            <Form.Control
              type="date"
              name="validFrom"
              value={form.validFrom}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Valid To</Form.Label>
            <Form.Control
              type="date"
              name="validTo"
              value={form.validTo}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Max Usage</Form.Label>
            <Form.Control
              type="number"
              name="maxUsage"
              value={form.maxUsage}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Notes</Form.Label>
            <Form.Control
              as="textarea"
              name="notes"
              value={form.notes}
              onChange={handleChange}
            />
          </Form.Group>

          <div className="text-end">
            <Button variant="primary" type="submit">
              {isEdit ? "Update" : "Add"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default LicenseForm;
