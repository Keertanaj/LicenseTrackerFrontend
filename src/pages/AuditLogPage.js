import React, { useState, useEffect } from 'react';
import { Table, Form, Button, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { auditLogService, userService } from '../services/api';

const AuditLogPage = () => {
    const [logs, setLogs] = useState([]);
    const [users, setUsers] = useState([]);
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        userId: '',
        entityType: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch both logs and the list of users for the filter dropdown
    const fetchData = async (currentFilters) => {
        setLoading(true);
        setError(null);
        try {
            // Fetch users for the filter dropdown
            const userRes = await userService.getUsers();
            setUsers(userRes.data || []);

            // Fetch logs with the current filters
            const activeFilters = {};
            for (const key in currentFilters) {
                if (currentFilters[key]) {
                    activeFilters[key] = currentFilters[key];
                }
            }
            const logRes = await auditLogService.getLogs(activeFilters);
            setLogs(logRes.data || []);

        } catch (err) {
            console.error("Failed to fetch data:", err);
            setError("Could not load audit logs. Please ensure you have the correct permissions.");
        } finally {
            setLoading(false);
        }
    };

    // Initial data load
    useEffect(() => {
        // Set default date range to the last 7 days
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 7);

        const initialFilters = {
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
            userId: '',
            entityType: ''
        };
        
        setFilters(initialFilters);
        fetchData(initialFilters);
    }, []);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        fetchData(filters);
    };

    return (
        <div className="container-fluid mt-4">
            <h1 className="mb-4">📜 Audit Log</h1>

            <Card className="mb-4">
                <Card.Header>Filter Logs</Card.Header>
                <Card.Body>
                    <Form onSubmit={handleFilterSubmit}>
                        <Row>
                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label>Start Date</Form.Label>
                                    <Form.Control type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label>End Date</Form.Label>
                                    <Form.Control type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label>User</Form.Label>
                                    <Form.Select name="userId" value={filters.userId} onChange={handleFilterChange}>
                                        <option value="">All Users</option>
                                        {users.map(user => (
                                            <option key={user.userId} value={user.userId}>{user.name} ({user.email})</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label>Entity Type</Form.Label>
                                    <Form.Select name="entityType" value={filters.entityType} onChange={handleFilterChange}>
                                        <option value="">All Types</option>
                                        <option value="License">License</option>
                                        <option value="Device">Device</option>
                                        <option value="User">User</option>
                                        <option value="Assignment">Assignment</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Button variant="primary" type="submit" className="mt-3" disabled={loading}>
                            {loading ? <Spinner as="span" size="sm" /> : 'Apply Filters'}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>

            {error && <Alert variant="danger">{error}</Alert>}

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Timestamp</th>
                        <th>User ID</th>
                        <th>Action</th>
                        <th>Entity Type</th>
                        <th>Entity ID</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr><td colSpan="7" className="text-center"><Spinner animation="border" /></td></tr>
                    ) : logs.length === 0 ? (
                        <tr><td colSpan="7" className="text-center">No audit logs found for the selected criteria.</td></tr>
                    ) : (
                        logs.map(log => (
                            <tr key={log.logId}>
                                <td>{new Date(log.timestamp).toLocaleString()}</td>
                                <td>{log.userId}</td>
                                <td>{log.action}</td>
                                <td>{log.entityType}</td>
                                <td>{log.entityId}</td>
                                <td>{log.details}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>
        </div>
    );
};

export default AuditLogPage;