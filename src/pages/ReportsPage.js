import React, { useState, useEffect } from 'react';
import { 
    Button, Table, Form, Row, Col, Card, 
    Spinner, Alert, Badge, InputGroup 
} from 'react-bootstrap';
import { CSVLink } from 'react-csv'; 
import jsPDF from 'jspdf'; 
import autoTable from 'jspdf-autotable';
import { reportService } from '../services/api'; 

const ReportsPage = () => {
    // --- State Initialization ---
    const [reportData, setReportData] = useState([]);
    const [filters, setFilters] = useState({ vendor: '', software: '', location: '' });
    const [loading, setLoading] = useState(false);
    const [vendorOptions, setVendorOptions] = useState([]);
    const [softwareOptions, setSoftwareOptions] = useState([]);
    const [locationOptions, setLocationOptions] = useState([]);

    // --- Functions (Unchanged core logic) ---
    const fetchReport = async (currentFilters) => {
        setLoading(true);
        try {
            const activeFilters = {};
            for (const key in currentFilters) {
                if (currentFilters[key]) {
                    activeFilters[key] = currentFilters[key];
                }
            }
            const queryString = new URLSearchParams(activeFilters).toString();
            const res = await reportService.getReport(queryString); 
            setReportData(res.data || []);
        } catch (error) {
            console.error("Failed to fetch report data:", error);
            setReportData([]);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => { fetchReport(filters); }, []);
    
    useEffect(() => { 
        if (reportData && reportData.length > 0) {
            setVendorOptions([...new Set((reportData || []).map(item => item.vendorName))].filter(Boolean).sort());
            setSoftwareOptions([...new Set((reportData || []).map(item => item.softwareName))].filter(Boolean).sort());
            setLocationOptions([...new Set((reportData || []).map(item => item.location))].filter(Boolean).sort());
        }
    }, [reportData]);

    const handleFilterChange = (e) => { setFilters({ ...filters, [e.target.name]: e.target.value }); };
    const handleFilterSubmit = () => { fetchReport(filters); };

    // UX Improvement: Function to clear all filters
    const handleClearFilters = () => {
        const newFilters = { vendor: '', software: '', location: '' };
        setFilters(newFilters);
        fetchReport(newFilters); // Fetch the full report immediately
    }
    
    const formatDataForExport = () => {
        const data = Array.isArray(reportData) ? reportData : []; // Defensive check
        return data.map(item => ({
            'License Key': item.licenseKey || '', 'Device ID': item.deviceId || '',
            'Software': item.softwareName || '', 'Vendor': item.vendorName || '',
            'Location': item.location || '', 'Expiry': item.expiryDate || '',
        }));
    };
    const csvHeaders = [
        { label: "License Key", key: "License Key" }, { label: "Device ID", key: "Device ID" },
        { label: "Software", key: "Software" }, { label: "Vendor", key: "Vendor" },
        { label: "Location", key: "Location" }, { label: "Expiry", key: "Expiry" },
    ];
    const exportPdf = () => { /* ... existing logic ... */ };
    const getExpiryBadge = (expiryDateStr) => { /* ... existing logic ... */ };

    // FIX: Safely calculate metrics using the defensive check
    const safeReportData = Array.isArray(reportData) ? reportData : [];

    const expiredCount = safeReportData.filter(item => {
        if (!item.expiryDate) return false;
        return new Date(item.expiryDate) <= new Date();
    }).length;

    const dataToExport = formatDataForExport();
    const isExportDisabled = loading || dataToExport.length === 0;


    // --- UI Structure ---
    return (
        <div className="container-fluid mt-4">
            
            {/* --- 1. Header and Export Controls (Top of the Page) --- */}
            <div className="d-flex justify-content-between align-items-center mb-5 border-bottom pb-3">
                <h1 className="text-secondary fw-light">
                    <i className="bi bi-bar-chart-line-fill me-2"></i> **License Report Dashboard**
                </h1>
                <div className="d-flex gap-2">
                    <CSVLink
                        data={dataToExport} 
                        headers={csvHeaders}
                        filename={"license_report.csv"}
                        className={`btn ${isExportDisabled ? 'btn-outline-secondary disabled' : 'btn-outline-primary'}`}
                        aria-disabled={isExportDisabled} 
                        onClick={(event) => { if (isExportDisabled) { event.preventDefault(); } }}
                    >
                        <i className="bi bi-file-earmark-spreadsheet me-1"></i> Export CSV
                    </CSVLink>
                    <Button 
                        onClick={exportPdf} 
                        variant={isExportDisabled ? "outline-secondary" : "outline-danger"}
                        disabled={isExportDisabled}
                    >
                        <i className="bi bi-file-earmark-pdf me-1"></i> Export PDF
                    </Button>
                </div>
            </div>

            {/* --- 2. Key Metrics Cards (Clear separation from filters) --- */}
            <Row className="g-4 mb-5">
                <Col md={6} lg={4}>
                    <Card className="shadow-lg h-100 border-0">
                        <Card.Body className="d-flex flex-column justify-content-between">
                            <h6 className="text-uppercase text-muted">Total Assignments</h6>
                            <h2 className="display-4 fw-bold text-primary">{safeReportData.length}</h2>
                        </Card.Body>
                        <Card.Footer className="text-end text-success fw-bold bg-light">Licenses Tracked</Card.Footer>
                    </Card>
                </Col>
                <Col md={6} lg={4}>
                    <Card className="shadow-lg h-100 border-0">
                        <Card.Body className="d-flex flex-column justify-content-between">
                            <h6 className="text-uppercase text-muted">Expired Licenses</h6>
                            <h2 className="display-4 fw-bold text-danger">{expiredCount}</h2>
                        </Card.Body>
                        <Card.Footer className="text-end text-danger fw-bold bg-light">Immediate Action Required</Card.Footer>
                    </Card>
                </Col>
                {/* Add a spacer column for better spacing on large screens */}
                <Col lg={4} className="d-none d-lg-block"></Col> 
            </Row>
            
            {/* --- 3. Filter Controls (UX: Positioned directly above the Table) --- */}
            <h4 className="mb-3 text-secondary border-bottom pb-2">
                <i className="bi bi-funnel me-2"></i> Filter Log
            </h4>
            <Card className="shadow-sm mb-4 border-0">
                <Card.Body className="py-3">
                    <Form onSubmit={(e) => { e.preventDefault(); handleFilterSubmit(); }}>
                        <Row className="align-items-center g-3">
                            
                            {/* Filter Dropdowns (xs=12, md=3) */}
                            <Col xs={12} sm={6} lg={3}>
                                <InputGroup size="sm">
                                    <InputGroup.Text><i className="bi bi-building"></i></InputGroup.Text>
                                    <Form.Select name="vendor" value={filters.vendor} onChange={handleFilterChange}>
                                        <option value="">All Vendors</option>
                                        {vendorOptions.map(vendor => (<option key={vendor} value={vendor}>{vendor}</option>))}
                                    </Form.Select>
                                </InputGroup>
                            </Col>
                            <Col xs={12} sm={6} lg={3}>
                                <InputGroup size="sm">
                                    <InputGroup.Text><i className="bi bi-hdd-fill"></i></InputGroup.Text>
                                    <Form.Select name="software" value={filters.software} onChange={handleFilterChange}>
                                        <option value="">All Software</option>
                                        {softwareOptions.map(software => (<option key={software} value={software}>{software}</option>))}
                                    </Form.Select>
                                </InputGroup>
                            </Col>
                            <Col xs={12} sm={6} lg={3}>
                                <InputGroup size="sm">
                                    <InputGroup.Text><i className="bi bi-geo-alt-fill"></i></InputGroup.Text>
                                    <Form.Select name="location" value={filters.location} onChange={handleFilterChange}>
                                        <option value="">All Locations</option>
                                        {locationOptions.map(location => (<option key={location} value={location}>{location}</option>))}
                                    </Form.Select>
                                </InputGroup>
                            </Col>
                            
                            {/* Action Buttons (UX: Clear and Apply side-by-side) */}
                            <Col xs={12} sm={6} lg={3}>
                                <div className="d-flex gap-2">
                                    <Button 
                                        variant="primary" 
                                        onClick={handleFilterSubmit} 
                                        disabled={loading}
                                        className="w-50"
                                    >
                                        {loading ? <Spinner as="span" size="sm" /> : 'Apply'}
                                    </Button>
                                    <Button 
                                        variant="outline-secondary" 
                                        onClick={handleClearFilters} 
                                        className="w-50"
                                        disabled={loading}
                                    >
                                        Clear
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>

            {/* --- 4. Data Table --- */}
            <h4 className="mb-3 text-secondary border-bottom pb-2">Full Assignment Log ({dataToExport.length} Results)</h4>
            <div className="table-responsive shadow-lg rounded">
                
                {loading && (
                    <Alert variant="light" className="text-center p-4 m-0">
                        <Spinner animation="border" className="me-2 text-primary" />
                        **Fetching latest report data...**
                    </Alert>
                )}
                
                {!loading && (
                    <Table striped hover className="mb-0">
                        {/* Dark Theme Header for contrast */}
                        <thead className="bg-dark text-white"> 
                            <tr>
                                <th>Key</th>
                                <th>Device ID</th>
                                <th>Software</th>
                                <th className="d-none d-md-table-cell">Vendor</th>
                                <th className="d-none d-lg-table-cell">Location</th>
                                <th className="text-center">Status</th>
                                <th className="d-none d-md-table-cell">Expiry Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataToExport.map((item, index) => (
                                <tr key={index}>
                                    <td>**{item['License Key']}**</td>
                                    <td>{item['Device ID']}</td>
                                    <td>{item['Software']}</td>
                                    <td className="d-none d-md-table-cell">{item['Vendor']}</td>
                                    <td className="d-none d-lg-table-cell">{item['Location']}</td>
                                    <td className="text-center">{getExpiryBadge(item['Expiry'])}</td>
                                    <td className="d-none d-md-table-cell">{item['Expiry']}</td>
                                </tr>
                            ))}
                            {dataToExport.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="text-center text-muted py-3">
                                        No assignments found matching the filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                )}
            </div>
        </div>
    );
};

export default ReportsPage;