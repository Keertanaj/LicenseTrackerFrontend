import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Form, Spinner, Alert, Breadcrumb } from 'react-bootstrap';
import { aiService } from '../services/api';

const PRIMARY_TEXT_COLOR = '#333333';          
const SECONDARY_TEXT_COLOR = '#6c757d';       
const PRIMARY_ACCENT_COLOR = '#6596F3';       
const CARD_BG_COLOR = '#FFFFFF';              
const MAIN_BG_COLOR = '#F8F9FA';              
const DANGER_COLOR = '#DC3545';               

const CODE_BLOCK_BG = '#F0F0F0'; 

const botBubbleStyle = {
    backgroundColor: '#E6F0FF', 
    color: PRIMARY_TEXT_COLOR,
    border: `1px solid ${PRIMARY_ACCENT_COLOR}`,
    maxWidth: '80%',
    marginRight: 'auto',
    borderRadius: '15px 15px 15px 5px',
};

const userBubbleStyle = {
    backgroundColor: PRIMARY_ACCENT_COLOR, 
    color: CARD_BG_COLOR, 
    maxWidth: '80%',
    marginLeft: 'auto',
    borderRadius: '15px 15px 5px 15px',
};

const FormattedResponse = ({ text }) => {
    const formattedText = text.replace(/\*\s/g, '<li>').replace(/\n\*/g, '<ul>*');
    const finalTextColor = PRIMARY_TEXT_COLOR;

    const withCodeBlocks = formattedText.replace(/```(.*?)\n([\s\S]*?)```/g, 
        (match, p1, p2) => `<div style="background:${CODE_BLOCK_BG}; border: 1px solid #ddd; padding:10px; border-radius:5px; margin:5px 0; overflow-x:auto;"><pre style="margin:0; color:${finalTextColor}; font-size:0.9em;">${p2.trim()}</pre></div>`
    );

    const finalHtml = withCodeBlocks.replace(/\n/g, '<br/>');
    
    return <div dangerouslySetInnerHTML={{ __html: finalHtml }} />;
};


const AIAssistant = () => {
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sessionId, setSessionId] = useState(null);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const storedSessionId = localStorage.getItem('complianceBotSessionId');
        
        if (storedSessionId) {
            setSessionId(storedSessionId);
        } else {
            const newId = 'bot-session-' + Date.now() + Math.random().toString(36).substring(2, 8);
            localStorage.setItem('complianceBotSessionId', newId);
            setSessionId(newId);
            setHistory([{ type: 'bot', content: "Hello! I am ComplianceBot, your expert license and device manager. How can I assist you today?" }]);
        }
    }, []);

    const handleQuery = async (e) => {
        e.preventDefault();
        
        const currentQuery = query.trim();
        if (!currentQuery || !sessionId) {
            setError("Session not ready or query is empty.");
            return;
        }
        
        setHistory(prev => [...prev, { type: 'user', content: currentQuery }]);
        setQuery(''); 
        setLoading(true);
        setError(null);
        setResponse(null);

        try {
            const res = await aiService.sendMessage(query); 
            const botResponse = res.data.botResponse;
            setResponse(botResponse); 
            setHistory(prev => [...prev, { type: 'bot', content: botResponse }]);

        } catch (err) {
            const errorMessage = `ComplianceBot error: ${err.response?.data?.botResponse || err.message || 'Failed to connect to AI service.'}`;
            setError(errorMessage);
            setHistory(prev => [...prev, { type: 'error', content: "Error processing request. See console for details." }]);
        } finally {
            setLoading(false);
        }
    };
    
    const handleCopy = () => {
        const lastResponse = history.length > 0 && history[history.length - 1].type === 'bot' 
                             ? history[history.length - 1].content : response;

        if (lastResponse) {
            navigator.clipboard.writeText(lastResponse);
            alert('Copied to clipboard!');
        }
    };

    if (!sessionId) {
        return <div className="text-center py-5" style={{backgroundColor: MAIN_BG_COLOR}}><Spinner animation="border" style={{ color: PRIMARY_ACCENT_COLOR }} role="status" /> <p style={{color: PRIMARY_TEXT_COLOR}}>Initializing Chat Session...</p></div>;
    }

    return (
        <div className="container-fluid p-2 p-sm-4" style={{ backgroundColor: MAIN_BG_COLOR, minHeight: '100vh' }}>
            <Row className="mb-4">
                <Col>
                    <h2 style={{ color: PRIMARY_TEXT_COLOR, fontWeight: 'bold' }}>ComplianceBot AI Assistant</h2>
                    <Breadcrumb>
                        <Breadcrumb.Item linkAs="span" style={{ color: SECONDARY_TEXT_COLOR }}>Dashboard</Breadcrumb.Item>
                        <Breadcrumb.Item active style={{ color: PRIMARY_ACCENT_COLOR, fontWeight: 'bold' }}>AI Assistant</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
            </Row>

            <Row>
                <Col md={8} className="mb-4">
                    <Card className="shadow-lg" style={{ backgroundColor: CARD_BG_COLOR, border: `1px solid ${SECONDARY_TEXT_COLOR}` }}>
                        <Card.Header style={{ backgroundColor: PRIMARY_ACCENT_COLOR, color: CARD_BG_COLOR, fontWeight: 'bold' }}>
                            Conversation Log
                        </Card.Header>
                        <Card.Body className="d-flex flex-column" style={{ minHeight: '60vh', maxHeight: '60vh', overflowY: 'auto', padding: '20px' }}>
                            
                            {history.length === 0 ? (
                                <p className="text-center mt-auto" style={{color: SECONDARY_TEXT_COLOR}}>Enter a query to start the compliance analysis...</p>
                            ) : (
                                history.map((msg, index) => (
                                    <div key={index} className="p-3 mb-3" 
                                         style={msg.type === 'user' ? userBubbleStyle : botBubbleStyle}>
                                        
                                        <small className="d-block fw-bold mb-1" style={{ fontSize: '0.7rem', color: msg.type === 'user' ? 'rgba(255,255,255,0.8)' : PRIMARY_ACCENT_COLOR }}>
                                            {msg.type === 'user' ? 'You' : 'ComplianceBot'}
                                        </small>
                                        
                                        <FormattedResponse text={msg.content} />

                                        <small className="d-block text-end mt-1" style={{ fontSize: '0.7rem', color: msg.type === 'user' ? 'rgba(255,255,255,0.5)' : SECONDARY_TEXT_COLOR }}>
                                            {new Date().toLocaleTimeString()}
                                        </small>
                                    </div>
                                ))
                            )}

                        </Card.Body>
                        <Card.Footer className="d-flex justify-content-end" style={{ backgroundColor: MAIN_BG_COLOR, borderTop: `1px solid ${SECONDARY_TEXT_COLOR}` }}>
                            <Button 
                                variant="outline-primary" 
                                onClick={handleCopy} 
                                style={{ borderColor: PRIMARY_ACCENT_COLOR, color: PRIMARY_ACCENT_COLOR }}
                                disabled={!history.some(msg => msg.type === 'bot')}
                            >
                                📋 Copy Last Response
                            </Button>
                        </Card.Footer>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card className="shadow-lg p-3" style={{ backgroundColor: CARD_BG_COLOR, border: `1px solid ${PRIMARY_ACCENT_COLOR}` }}>
                        <h5 className="mb-3" style={{ color: PRIMARY_TEXT_COLOR }}>Ask ComplianceBot</h5>
                        
                        <Form onSubmit={handleQuery}>
                            <Form.Group className="mb-3">
                                <Form.Control
                                    as="textarea"
                                    rows={6}
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder='Enter your compliance question...'
                                    disabled={loading}
                                    style={{ backgroundColor: MAIN_BG_COLOR, color: PRIMARY_TEXT_COLOR, borderColor: SECONDARY_TEXT_COLOR, resize: 'none' }}
                                />
                            </Form.Group>
                            
                            {loading && <p style={{color: SECONDARY_TEXT_COLOR}}>Analyzing data...</p>}
                            {error && <Alert variant="danger" style={{backgroundColor: DANGER_COLOR, color: CARD_BG_COLOR}}>{error}</Alert>}

                            <Button 
                                type="submit" 
                                style={{ backgroundColor: PRIMARY_ACCENT_COLOR, borderColor: PRIMARY_ACCENT_COLOR, color: CARD_BG_COLOR }} 
                                className="w-100 fw-bold shadow-sm mt-2"
                                disabled={loading || !query.trim()}
                            >
                                {loading ? <Spinner animation="border" size="sm" /> : 'Ask ComplianceBot'}
                            </Button>
                        </Form>
                    </Card>
                    
                    <Card className="shadow-lg p-3 mt-4" style={{ backgroundColor: CARD_BG_COLOR, border: `1px solid ${SECONDARY_TEXT_COLOR}` }}>
                        <h5 style={{ color: PRIMARY_TEXT_COLOR }}>Session Info</h5>
                        <p style={{ color: SECONDARY_TEXT_COLOR, fontSize: '0.9rem' }}>
                            Session ID: <code style={{color: PRIMARY_ACCENT_COLOR, fontWeight: 'bold'}}>{sessionId}</code>
                        </p>
                        <Button 
                            variant="outline-danger" 
                            onClick={() => setHistory([])}
                            disabled={history.length === 0}
                        >
                            🗑️ Clear Conversation
                        </Button>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default AIAssistant;