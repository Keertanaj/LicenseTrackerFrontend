import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Table,
  Button,
  Spinner,
  Alert,
  Breadcrumb,
  Form
} from "react-bootstrap";
import LicenseForm from "./LicenseForm";
import { licenseService } from "../services/api";

const LicenseManagement = () => {
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingLicense, setEditingLicense] = useState(null);
  const [searchSoftware, setSearchSoftware] = useState("");
  const [searchVendor, setSearchVendor] = useState("");

  const loadLicenses = async () => {
    setLoading(true);
    try {
      const res = await licenseService.getAllLicenses();
      setLicenses(res.data || []);
    } catch (err) {
      setError("Failed to fetch licenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLicenses();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await licenseService.searchLicenses(searchVendor, searchSoftware);
      setLicenses(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to search licenses");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (licenseKey) => {
    if (!window.confirm("Delete this license?")) return;
    try {
      await licenseService.deleteLicense(licenseKey);
      loadLicenses();
    } catch (err) {
      alert(err.message);
    }
  };

  const openAddForm = () => {
    setEditingLicense(null);
    setShowForm(true);
  };

  const openEditForm = (license) => {
    setEditingLicense(license);
    setShowForm(true);
  };

  return (
    <div className="devices-page p-4">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h2 className="mb-1">Licenses</h2>
          <Breadcrumb>
            <Breadcrumb.Item active>Dashboard</Breadcrumb.Item>
            <Breadcrumb.Item active>License Management</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <Button variant="primary" onClick={openAddForm}>
          Add License
        </Button>
      </div>

      <Row className="mb-3">
        <Col md={4}>
          <Form.Control
            placeholder="Search by Vendor"
            value={searchVendor}
            onChange={(e) => setSearchVendor(e.target.value)}
          />
        </Col>
        <Col md={4}>
          <Form.Control
            placeholder="Search by Software"
            value={searchSoftware}
            onChange={(e) => setSearchSoftware(e.target.value)}
          />
        </Col>
        <Col md={4} className="d-flex gap-2">
          <Button variant="primary" onClick={handleSearch}>
            Search
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setSearchVendor("");
              setSearchSoftware("");
              loadLicenses();
            }}
          >
            Reset
          </Button>
        </Col>
      </Row>

      {loading ? (
        <Spinner animation="border" />
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Table hover responsive className="devices-table">
          <thead>
            <tr>
              <th>License Key</th>
              <th>Vendor</th>
              <th>Software</th>
              <th>Type</th>
              <th>Valid From</th>
              <th>Valid To</th>
              <th>Max Usage</th>
              <th>Notes</th>
              <th>Created</th>
              <th>Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {licenses.map((l) => (
              <tr key={l.licenseKey}>
                <td>{l.licenseKey}</td>
                <td>{l.vendor}</td>
                <td>{l.softwareName}</td>
                <td>{l.licenseType}</td>
                <td>{l.validFrom}</td>
                <td>{l.validTo}</td>
                <td>{l.maxUsage}</td>
                <td>{l.notes}</td>
                <td>{l.createdAt ? new Date(l.createdAt).toLocaleString() : "-"}</td>
                <td>{l.updatedAt ? new Date(l.updatedAt).toLocaleString() : "-"}</td>
                <td>
                  <Button variant="link" onClick={() => openEditForm(l)}>
                    Edit
                  </Button>
                  <Button
                    variant="link"
                    className="text-danger"
                    onClick={() => handleDelete(l.licenseKey)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {showForm && (
        <LicenseForm
          existingLicense={editingLicense}
          onClose={() => {
            setShowForm(false);
            loadLicenses();
          }}
        />
      )}
    </div>
  );
};

export default LicenseManagement;
