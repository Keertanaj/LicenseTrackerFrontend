import React, { useState, useEffect } from "react";
import { Row, Col, Card, Table, Spinner, Alert } from "react-bootstrap";
import DashboardCard from "./DashboardCard"; 
import { dashboardService } from "../services/api"; 

const Dashboard = () => {
    const [metrics, setMetrics] = useState({
        totalDevices: 0,
        totalLicenses: 0,
        licensesExpiringSoon: 0, // Updated to match backend DTO
        devicesAtRisk: 0,
        expiringLicenses: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const COLORS = {
        primary: "#6596F3", 
        warning: "#F25016", 
        success: "#83B366", 
    };

    useEffect(() => {
        const loadDashboardData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [metricsDataRes, expiringLicensesRes, devicesAtRiskCountRes] = await Promise.all([
                    dashboardService.getMetrics(),
                    dashboardService.getExpiringLicenses(30),
                    dashboardService.getDevicesAtRisk(30), 
                ]);

                setMetrics({
                    totalDevices: metricsDataRes.data.totalDevices,
                    totalLicenses: metricsDataRes.data.totalLicenses,
                    licensesExpiringSoon: metricsDataRes.data.licensesExpiringSoon,
                    devicesAtRisk: devicesAtRiskCountRes.data, 
                    expiringLicenses: expiringLicensesRes.data || [], 
                });

            } catch (err) {
                console.error("Dashboard Fetch Error:", err);
                setError("Failed to load dashboard data. Please check the backend connection.");
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []); 

    if (loading) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" style={{ color: "#6596F3" }} />
                <p className="mt-2">Loading Dashboard Data from Backend...</p>
            </div>
        );
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    return (
        <div className="container-fluid p-4">
            
            {/* --- TOP METRIC CARDS --- */}
            <Row className="g-3">
                <DashboardCard
                    title="Total Devices"
                    value={metrics.totalDevices}
                    icon="💻"
                    color={COLORS.success}
                />
                <DashboardCard
                    title="Total Licenses"
                    value={metrics.totalLicenses}
                    icon="🔑"
                    color={COLORS.primary}
                />
                <DashboardCard
                    title="Licenses Expiring"
                    value={metrics.licensesExpiringSoon}
                    icon="⚠️"
                    color={COLORS.warning}
                />
                <DashboardCard
                    title="Devices at Risk"
                    value={metrics.devicesAtRisk}
                    icon="🚨"
                    color={COLORS.warning}
                />
            </Row>

            <hr />

            {/* --- EXPIRING LICENSES TABLE --- */}
            <Row>
                <Col>
                    <Card className="shadow-sm">
                        <Card.Header 
                          style={{ backgroundColor: "#B2DCE2", color: "black", fontWeight: 'bold' }}>
                            ▼ Expiring Licenses This Month 
                        </Card.Header>
                        <Card.Body className="p-0">
                            <Table striped bordered hover className="mb-0 text-center">
                                <thead style={{ backgroundColor: "#6596F3", color: "white" }}>
                                    <tr>
                                        <th>Software</th>
                                        <th>Vendor</th>
                                        <th>Devices Used</th>
                                        <th>Expiry Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {metrics.expiringLicenses.length > 0 ? (
                                        metrics.expiringLicenses.map((item, index) => (
                                            <tr key={index}>
                                                <td style={{ fontWeight: 'bold' }}>{item.softwareName}</td>
                                                <td>{item.vendor}</td>
                                                <td>{item.devicesUsed}</td> {/* Assuming devicesUsed is available in LicenseAlertDTO or calculated here */}
                                                <td style={{ color: COLORS.warning, fontWeight: 'bold' }}>{item.validTo}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="text-center text-muted">No licenses expiring this month. 🎉</td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;