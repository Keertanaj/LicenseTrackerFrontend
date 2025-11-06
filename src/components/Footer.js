import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const PRIMARY_COLOR = '#070707ff'; 
const ACCENT_COLOR = '#ffffffff';  
const TEXT_COLOR = '#ffffffff';   
const BORDER_COLOR = '#212529';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer 
            className="mt-auto py-3 shadow-lg"
            style={{ backgroundColor: PRIMARY_COLOR, color: TEXT_COLOR, borderTop: `2px solid ${ACCENT_COLOR}` }}
        >
            <Container fluid>
                <Row className="align-items-center">
                    <Col xs={12} md={6} className="text-center text-md-start mb-2 mb-md-0">
                        <p className="mb-0" style={{ fontSize: '0.9rem' }}>
                            &copy; {currentYear} LicenseTracker Pro. All rights reserved.
                        </p>
                    </Col>
                    <Col xs={12} md={6} className="text-center text-md-end">
                        <small>
                            <span style={{ color: ACCENT_COLOR }}>Compliance & Inventory Management Solution</span>
                        </small>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;