import React, { useState, useEffect } from 'react';
import { Button, Table, Form, Modal, Card, Spinner, Alert, Badge, Row, Col } from 'react-bootstrap';
import { userService, roleService } from '../services/api';

const UserPage = () => {

    const [users, setUsers] = useState([]);
    const [availableRoles, setAvailableRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentEditUser, setCurrentEditUser] = useState(null);
    const [error, setError] = useState(null);

    const DEFAULT_ROLE = 'ROLE_USER';

    const [createFormData, setCreateFormData] = useState({
        name: '', email: '', password: '', role: DEFAULT_ROLE
    });
    const [editFormData, setEditFormData] = useState({
        userId: null, name: '', email: '', role: ''
    });

    const fetchRoles = async () => {
        try {
            const rolesRes = await roleService.getRoles();
            setAvailableRoles(rolesRes.data || []);

            if (rolesRes.data && rolesRes.data.length > 0) {
                const initialRole = rolesRes.data.includes(DEFAULT_ROLE) ? DEFAULT_ROLE : rolesRes.data[0];
                setCreateFormData(prev => ({ ...prev, role: initialRole }));
            }
        } catch (err) {
            console.error("Failed to fetch roles:", err);
            setError("Failed to load user roles.");
            setAvailableRoles([]);
        }
    }

    const fetchUsers = async () => {
        try {
            const res = await userService.getUsers();
            setUsers(res.data || []);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch users:", err);
            setError("Failed to load user data.");
            setUsers([]);
        }
    };

    useEffect(() => {
        setLoading(true);
        Promise.all([fetchRoles(), fetchUsers()])
            .finally(() => setLoading(false));
    }, []);

    const handleCreateFormChange = (e) => {
        setCreateFormData({ ...createFormData, [e.target.name]: e.target.value });
    };

    const handleEditFormChange = (e) => {
        setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    };

    const openEditModal = (user) => {
        setCurrentEditUser(user);
        setEditFormData({
            userId: user.userId,
            name: user.name,
            email: user.email,
            role: user.role
        });
        setShowEditModal(true);
    };

    const closeEditModal = () => {
        setShowEditModal(false);
        setCurrentEditUser(null);
        setError(null);
    }

    const handleAddUser = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await userService.createUser(createFormData);
            await fetchUsers();
            setShowCreateModal(false);
            setCreateFormData({ name: '', email: '', password: '', role: DEFAULT_ROLE });
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create user. Email may already exist.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            // Send only the raw role string as the request body
            await userService.assignRole(editFormData.userId, editFormData.role);
            await fetchUsers();
            closeEditModal();
        } catch (err) {
            setError("Failed to update user role. Please ensure the user exists and data is valid.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            return;
        }
        setLoading(true);
        try {
            await userService.deleteUser(userId);
            await fetchUsers();
        } catch (err) {
            setError("Failed to delete user. They might be tied to active operations.");
        } finally {
             setLoading(false);
        }
    };

    const getRoleBadge = (role) => {
        let variant;
        if (role.includes('ADMIN') || role.includes('HEAD')) {
            variant = 'danger';
        } else if (role.includes('LEAD') || role.includes('MANAGER')) {
            variant = 'warning';
        } else if (role.includes('AUDITOR')) {
            variant = 'info';
        } else {
            variant = 'primary';
        }
        return <Badge bg={variant}>{role.replace('ROLE_', '').replace('_', ' ')}</Badge>;
    };

    return (
        <div className="container-fluid mt-4">
            <div className="d-flex justify-content-between align-items-center mb-5 border-bottom pb-3">
                <h1 className="text-secondary fw-light">
                    <i className="bi bi-people-fill me-2"></i> **User Management**
                </h1>
                <Button variant="primary" onClick={() => setShowCreateModal(true)} disabled={loading || availableRoles.length === 0}>
                    <i className="bi bi-person-plus-fill me-1"></i> Add New User
                </Button>
            </div>

            {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

            <Card className="shadow-lg border-0">
                <Card.Header className="bg-dark text-white fw-bold">
                    <i className="bi bi-list me-2"></i> System Users ({users.length})
                </Card.Header>
                <div className="table-responsive">
                    {loading ? (
                        <Alert variant="light" className="text-center p-4 m-0">
                            <Spinner animation="border" className="me-2 text-primary" />
                            Loading user data and roles...
                        </Alert>
                    ) : (
                        <Table striped hover className="mb-0">
                            <thead>
                                <tr className="table-secondary">
                                    <th>#ID</th>
                                    <th>Name</th>
                                    <th>Email (Login ID)</th>
                                    <th>Role</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.userId}>
                                        <td>{user.userId}</td>
                                        <td>**{user.name}**</td>
                                        <td>{user.email}</td>
                                        <td>{getRoleBadge(user.role)}</td>
                                        <td className="text-end d-flex justify-content-end gap-2">
                                            <Button
                                                variant="outline-info"
                                                size="sm"
                                                onClick={() => openEditModal(user)}
                                                disabled={user.role === 'ROLE_ADMIN'}
                                            >
                                                <i className="bi bi-pencil-square"></i> Edit Role
                                            </Button>
                                            
                                            <Button 
                                                variant="outline-danger" 
                                                size="sm"
                                                onClick={() => handleDeleteUser(user.userId)}
                                                disabled={user.role === 'ROLE_ADMIN'} 
                                            >
                                                <i className="bi bi-trash"></i> Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="text-center text-muted py-3">No users found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    )}
                </div>
            </Card>

            {/* 1. ADD User Modal (Creation) */}
            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} centered>
                <Modal.Header closeButton className="bg-primary text-white">
                    <Modal.Title>Add New System User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleAddUser}>
                        <Form.Group className="mb-3"><Form.Label>Display Name</Form.Label>
                            <Form.Control type="text" name="name" value={createFormData.name} onChange={handleCreateFormChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3"><Form.Label>Email Address (Login ID)</Form.Label>
                            <Form.Control type="email" name="email" value={createFormData.email} onChange={handleCreateFormChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3"><Form.Label>Initial Password</Form.Label>
                            <Form.Control type="password" name="password" value={createFormData.password} onChange={handleCreateFormChange} required />
                        </Form.Group>
                        
                        {/* Role Selection (Uses dynamic availableRoles state) */}
                        <Form.Group className="mb-4">
                            <Form.Label>User Role</Form.Label>
                            <Form.Select name="role" value={createFormData.role} onChange={handleCreateFormChange} required>
                                {availableRoles.map(role => (<option key={role} value={role}>{role}</option>))}
                            </Form.Select>
                            <Form.Text muted>Select the functional role for the new user.</Form.Text>
                        </Form.Group>
                        <div className="d-grid">
                            <Button variant="primary" type="submit" disabled={loading}>
                                {loading ? <Spinner as="span" size="sm" /> : 'Save User'}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
            
            {/* 2. EDIT User Modal (Role Assignment) */}
            <Modal show={showEditModal} onHide={closeEditModal} centered>
                <Modal.Header closeButton className="bg-info text-white">
                    <Modal.Title>Edit User Role: **{editFormData.name}**</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Alert variant="warning">
                        Changing role for **{editFormData.email}**. Current Role: **{currentEditUser?.role}**
                    </Alert>
                    <Form onSubmit={handleUpdateUser}>
                        <Form.Group className="mb-4">
                            <Form.Label>Assign New Role</Form.Label>
                            {/* Role Selection (Uses dynamic availableRoles state) */}
                            <Form.Select name="role" value={editFormData.role} onChange={handleEditFormChange}>
                                {availableRoles.map(role => (<option key={role} value={role}>{role}</option>))}
                            </Form.Select>
                        </Form.Group>
                        
                        <div className="d-grid">
                            <Button variant="info" type="submit" disabled={loading}>
                                {loading ? <Spinner as="span" size="sm" /> : <><i className="bi bi-save me-1"></i> Update Role</>}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default UserPage;