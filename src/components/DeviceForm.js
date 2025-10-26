import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { deviceService } from "../services/api";

const DeviceForm = ({ existingDevice }) => {
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
    console.log("Submitting form:", form); // 👈 check this in browser console

    try {
      if (isEdit) {
        await deviceService.updateDevice(form.deviceId, form);
        alert("Device updated successfully!");
      } else {
        await deviceService.addDevice(form);
        alert("Device added successfully!");
      }
      window.location.reload(); // refreshes page to show changes
    } catch (err) {
      console.error(err);
      alert("Failed to save device");
    }
  };

  return (
    <Modal show centered>
      <Modal.Header>
        <Modal.Title>{isEdit ? "Edit Device" : "Add Device"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {!isEdit && (
            <Form.Group className="mb-3">
              <Form.Label>Device ID</Form.Label>
              <Form.Control
                name="deviceId"
                value={form.deviceId}
                onChange={handleChange}
                required
              />
            </Form.Group>
          )}
          <Form.Group className="mb-3">
            <Form.Label>Device Name</Form.Label>
            <Form.Control
              name="deviceName"
              value={form.deviceName}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>IP Address</Form.Label>
            <Form.Control
              name="ipAddress"
              value={form.ipAddress}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Type</Form.Label>
            <Form.Control
              name="deviceType"
              value={form.deviceType}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Location</Form.Label>
            <Form.Control
              name="location"
              value={form.location}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Model</Form.Label>
            <Form.Control
              name="model"
              value={form.model}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="ACTIVE">Select</option>
              <option value="MAINTENANCE">ACTIVE</option>
              <option value="OBSOLETE">OBSOLETE</option>
              <option value="DECOMMISSIONED">DECOMMISSIONED</option>
            </Form.Select>
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

export default DeviceForm;
