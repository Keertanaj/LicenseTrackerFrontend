import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Form, Spinner, Alert, Breadcrumb } from 'react-bootstrap';
import { aiService } from '../services/api';

const PRIMARY_ACCENT_COLOR = '#D3A4EA';
const SECONDARY_HEADER_COLOR = '#83B366';
const DANGER_COLOR = '#F3000E';
const BG_COLOR = '#F8F8F8';

const AIAssistant = () => {
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({});
    const [sessionId, setSessionId] = useState(null);

    useEffect(() => {
        const storedSessionId = localStorage.getItem('complianceBotSessionId');
        
        if (storedSessionId) {
            // Use existing session ID
            setSessionId(storedSessionId);
        } else {
            // Generate and store new ID
            const newId = 'bot-session-' + Date.now() + Math.random().toString(36).substring(2, 8);
            localStorage.setItem('complianceBotSessionId', newId);
            setSessionId(newId);
        }
    }, []);

    const handleQuery = async (e) => {
        e.preventDefault();
        
        setLoading(true);
        setError(null);
        setResponse(null);

        if (!query.trim() || !sessionId) {
            setError("Session not ready or query is empty.");
            setLoading(false);
            return;
        }

        try {
            // Pass the automatically managed sessionId
            const res = await aiService.getSummary(sessionId, query, filters);
            setResponse(res.data.botResponse);
        } catch (err) {
            setError(`ComplianceBot error: ${err.response?.data?.message || err.message || 'Failed to connect to AI service.'}`);
        } finally {
            setLoading(false);
        }
    };
    
    const handleFilterChange = (e) => {
        setFilters({...filters, [e.target.name]: e.target.value});
    };

    const handleCopy = () => {
        if (response) {
            navigator.clipboard.writeText(response);
            alert('Copied to clipboard!');
        }
    };
    
    if (!sessionId) {
        return <div className="text-center py-5"><Spinner animation="border" style={{ color: PRIMARY_ACCENT_COLOR }} /> <p>Initializing Chat Session...</p></div>;
    }

    return (
        <div className="container-fluid p-2 p-sm-4" style={{ backgroundColor: BG_COLOR, minHeight: '100vh' }}>
            <Row className="mb-4">
                <Col>
                    <h2 style={{ color: PRIMARY_ACCENT_COLOR, fontWeight: 'bold' }}>ComplianceBot AI Assistant</h2>
                    <Breadcrumb>
                        <Breadcrumb.Item linkAs="span" style={{ color: 'gray' }}>Dashboard</Breadcrumb.Item>
                        <Breadcrumb.Item active style={{ color: PRIMARY_ACCENT_COLOR, fontWeight: 'bold' }}>AI Assistant</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
            </Row>

            <Card className="shadow-sm p-4 mb-4" style={{ borderLeft: `5px solid ${PRIMARY_ACCENT_COLOR}` }}>
                <h5 className="mb-3" style={{ color: SECONDARY_HEADER_COLOR }}>Ask ComplianceBot</h5>
                
                <Form onSubmit={handleQuery}>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder='e.g., "Summarize licenses expiring in the next 30 days by location"'
                            disabled={loading}
                        />
                    </Form.Group>
                    
                    <Row className="mb-3">
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label className="small text-muted">Scope</Form.Label>
                                <Form.Select name="scope" onChange={handleFilterChange} disabled={loading}>
                                    <option value="">All</option>
                                    <option value="LICENSE">License</option>
                                    <option value="DEVICE">Device</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label className="small text-muted">Location (Optional)</Form.Label>
                                <Form.Control name="location" type="text" onChange={handleFilterChange} disabled={loading} placeholder="e.g., BLR" />
                            </Form.Group>
                        </Col>
                        <Col md={4} className="d-flex align-items-end">
                            <Button 
                                type="submit" 
                                style={{ backgroundColor: PRIMARY_ACCENT_COLOR, borderColor: PRIMARY_ACCENT_COLOR }} 
                                className="w-100 fw-bold"
                                disabled={loading}
                            >
                                {loading ? <Spinner animation="border" size="sm" /> : 'Ask Bot'}
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Card>

            <Card className="shadow-sm p-4" style={{ borderLeft: `5px solid ${SECONDARY_HEADER_COLOR}` }}>
                <h5 className="mb-3" style={{ color: PRIMARY_ACCENT_COLOR }}>Bot Response</h5>
                {error && <Alert variant="danger" style={{backgroundColor: DANGER_COLOR, color: 'white'}}>{error}</Alert>}
                
                {loading && <p className="text-muted">Analyzing data...</p>}

                {response ? (
                    <div>
                        <pre style={{ whiteSpace: 'pre-wrap', backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '5px', border: '1px solid #eee' }}>
                            {response}
                        </pre>
                        <div className="d-flex gap-2 justify-content-end">
                            <Button variant="outline-secondary" onClick={() => setQuery('')}>
                                🗑️ Clear
                            </Button>
                            <Button variant="success" onClick={handleCopy} style={{backgroundColor: SECONDARY_HEADER_COLOR, borderColor: SECONDARY_HEADER_COLOR}}>
                                📋 Copy to Report
                            </Button>
                        </div>
                    </div>
                ) : !loading && <p className="text-muted">Waiting for query...</p>}
            </Card>
        </div>
    );
};

export default AIAssistant;