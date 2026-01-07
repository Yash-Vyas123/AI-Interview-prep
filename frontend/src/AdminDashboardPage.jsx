import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Shield, Edit, Save, Trash2, Check, X } from 'lucide-react';
import { getAnalytics } from './api';

const AdminDashboardPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editRole, setEditRole] = useState('user');

    const token = localStorage.getItem('token');
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch(`${API_URL}/api/admin/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to fetch users');
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            const res = await fetch(`${API_URL}/api/admin/users/${userId}/role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ role: newRole })
            });

            if (!res.ok) throw new Error('Failed to update role');

            setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
            setEditingId(null);
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading) return <div className="spinner-center"><div className="spinner"></div></div>;

    return (
        <div className="app-container">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section">

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
                    <div style={{ padding: '12px', background: '#f87171', borderRadius: '16px', color: 'white' }}>
                        <Shield size={32} />
                    </div>
                    <div>
                        <h1 className="text-gradient" style={{ margin: 0 }}>Admin Console</h1>
                        <p style={{ margin: 0 }}>Manage users and permissions.</p>
                    </div>
                </div>

                {error && <div className="glass-panel" style={{ color: '#f87171', marginBottom: '1rem', padding: '1rem' }}>{error}</div>}

                <div className="glass-panel" style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
                                <th style={{ padding: '1rem' }}>User</th>
                                <th style={{ padding: '1rem' }}>Email</th>
                                <th style={{ padding: '1rem' }}>Role</th>
                                <th style={{ padding: '1rem' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div className="user-avatar-small" style={{ background: 'var(--primary)' }}>
                                            {user.avatarUrl ? <img src={user.avatarUrl} alt="" className="avatar-img" /> : user.name.charAt(0)}
                                        </div>
                                        {user.name}
                                    </td>
                                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{user.email}</td>
                                    <td style={{ padding: '1rem' }}>
                                        {editingId === user._id ? (
                                            <select
                                                value={editRole}
                                                onChange={(e) => setEditRole(e.target.value)}
                                                style={{
                                                    background: 'var(--bg-dark)',
                                                    color: 'white',
                                                    border: '1px solid var(--glass-border)',
                                                    padding: '4px 8px',
                                                    borderRadius: '4px'
                                                }}
                                            >
                                                <option value="user">User</option>
                                                <option value="admin">Admin</option>
                                                <option value="mentor">Mentor</option>
                                            </select>
                                        ) : (
                                            <span className={`role-badge role-${user.role}`}>
                                                {user.role}
                                            </span>
                                        )}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {editingId === user._id ? (
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button
                                                    onClick={() => handleRoleChange(user._id, editRole)}
                                                    className="icon-btn"
                                                    style={{ color: '#4ade80' }}
                                                    title="Save"
                                                >
                                                    <Check size={18} />
                                                </button>
                                                <button
                                                    onClick={() => setEditingId(null)}
                                                    className="icon-btn"
                                                    style={{ color: '#f87171' }}
                                                    title="Cancel"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => { setEditingId(user._id); setEditRole(user.role); }}
                                                className="icon-btn"
                                                title="Edit Role"
                                            >
                                                <Edit size={18} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </motion.div>
        </div>
    );
};

export default AdminDashboardPage;
