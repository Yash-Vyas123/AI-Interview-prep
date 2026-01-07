import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile } from './api';

function HeaderUserMenu() {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    (async () => {
      try {
        const data = await getProfile(token);
        setUser(data.user);
      } catch (err) {
        console.error('Header profile load error:', err);
      }
    })();
  }, []);

  // close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  function handleLogout() {
    localStorage.removeItem('token');
    navigate('/');
  }

  if (!user) {
    // no user yet; show nothing on login page
    return null;
  }

  const initials = (user.name || 'U')
    .split(' ')
    .map(p => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      ref={menuRef}
      style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
    >
      {/* name (optional small text) */}
      <span
        style={{
          marginRight: 12,
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 600,
          fontSize: 16,
          color: '#ffffff',
          letterSpacing: '0.02em',
          textShadow: '0 1px 2px rgba(0,0,0,0.1)',
        }}
      >
        {user.name}
      </span>

      {/* avatar pill */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          borderRadius: 999,
          padding: 2,
          border: '2px solid rgba(248, 250, 252, 0.9)',
          background:
            'radial-gradient(circle at 30% 0%, #38bdf8, #0f172a 60%, #22c55e)',
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: '999px',
            overflow: 'hidden',
            backgroundColor: '#020617',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#e5e7eb',
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#020617' }}
            />
          ) : (
            initials
          )}
        </div>
      </button>

      {/* dropdown */}
      {open && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 52,
            width: 190,
            background: 'rgba(2, 6, 23, 0.96)',
            borderRadius: 14,
            boxShadow: '0 20px 45px rgba(15,23,42,0.9)',
            border: '1px solid rgba(148,163,184,0.4)',
            padding: '8px 0',
            zIndex: 50,
            backdropFilter: 'blur(10px)',
          }}
        >
          <div
            style={{
              padding: '8px 14px',
              borderBottom: '1px solid rgba(51,65,85,0.8)',
            }}
          >
            <div
              style={{
                fontSize: 13,
                color: '#e5e7eb',
                fontWeight: 600,
                marginBottom: 2,
              }}
            >
              {user.name}
            </div>
            <div style={{ fontSize: 11, color: '#9ca3af' }}>{user.email}</div>
          </div>

          {user.role === 'admin' && (
            <button
              type="button"
              onClick={() => {
                navigate('/admin');
                setOpen(false);
              }}
              style={{ ...menuItemStyle, color: '#f87171' }}
            >
              Admin Console
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              navigate('/profile');
              setOpen(false);
            }}
            style={menuItemStyle}
          >
            View profile
          </button>

          <button
            type="button"
            onClick={() => {
              // later you can use /settings
              navigate('/profile');
              setOpen(false);
            }}
            style={menuItemStyle}
          >
            Settings
          </button>

          <button
            type="button"
            onClick={() => {
              navigate('/feedback');
              setOpen(false);
            }}
            style={menuItemStyle}
          >
            Feedback
          </button>

          <button
            type="button"
            onClick={handleLogout}
            style={{ ...menuItemStyle, color: '#ff4d4d', fontWeight: 'bold' }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

const menuItemStyle = {
  width: '100%',
  textAlign: 'left',
  padding: '8px 14px',
  background: 'transparent',
  border: 'none',
  color: '#e5e7eb',
  fontSize: 13,
  cursor: 'pointer',
};

export default HeaderUserMenu;
