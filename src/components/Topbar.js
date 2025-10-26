import React from "react";
import { Container, Navbar, Form, FormControl } from "react-bootstrap";

const Topbar = ({ toggleSidebar }) => {
  return (
    <Navbar className="topbar shadow-sm" bg="light">
      <Container fluid className="align-items-center">
        <button className="btn btn-outline-primary d-lg-none me-2" onClick={toggleSidebar}>
          ☰
        </button>
        <div className="breadcrumb-area ms-2">
          <small className="text-muted">Dashboard</small>
        </div>
        <div className="ms-auto d-flex align-items-center">
          <Form className="me-3 d-none d-md-block">
            <FormControl placeholder="Search devices, licenses..." size="sm" />
          </Form>
          <div className="profile-pill">Admin</div>
        </div>
      </Container>
    </Navbar>
  );
};

export default Topbar;
