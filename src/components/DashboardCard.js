import React from 'react';
import { Card, Col } from 'react-bootstrap';

const DashboardCard = ({ title, value, icon, color }) => {
  const cardStyle = {
    borderLeft: `5px solid ${color}`,
    color: 'black',
    // Ensures a clean, modern look
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
  };

  const valueStyle = {
    color: color,
    fontWeight: 'bold',
    fontSize: '2rem',
  };

  return (
    <Col xs={12} sm={6} md={3} className="mb-4">
      <Card style={cardStyle} className="h-100">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <Card.Title className="text-uppercase" style={{ fontSize: '0.8rem', color: '#6c757d' }}>
                {title}
              </Card.Title>
              <Card.Text style={valueStyle}>
                {value}
              </Card.Text>
            </div>
            <div style={{ fontSize: '2.5rem' }}>
              {icon}
            </div>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default DashboardCard;