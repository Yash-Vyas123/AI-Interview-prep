import React, { useEffect, useState } from 'react';
import { getProfile, updateProfile } from './api';

function ProfilePage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    avatarUrl: '',
    bio: '',
  });
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false); // NEW

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    (async () => {
      try {
        const data = await getProfile(token);
        const u = data.user;
        setForm({
          name: u.name || '',
          email: u.email || '',
          phone: u.phone || '',
          avatarUrl: u.avatarUrl || '',
          bio: u.bio || '',
        });
      } catch (err) {
        setMessage(err.message);
      }
    })();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  // NEW: Cloudinary avatar upload
  async function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setMessage('');
    try {
      const data = new FormData();
      data.append('file', file);
      data.append('upload_preset', 'AI-Interview-prep'); // exactly your preset
      data.append('folder', 'ai-interview-avatars');

      const cloudName = 'ddtdfsn3f'; // your cloud name
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: data,
        }
      );

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || 'Image upload failed');
      }

      const url = json.secure_url;

      // build updated profile object with new avatar
      const updated = { ...form, avatarUrl: url };

      // 1) update local form state so UI shows new image
      setForm(updated);

      // 2) save to your backend profile API
      const token = localStorage.getItem('token');
      await updateProfile(token, updated);

      setMessage('Profile picture updated successfully');
    } catch (err) {
      console.error('Avatar upload error:', err);
      setMessage(err.message || 'Avatar upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }



  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      await updateProfile(token, form);
      setMessage('Profile updated successfully');
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="section">
      <h1>Profile</h1>

      <div
        style={{
          display: 'flex',
          gap: '24px',
          flexWrap: 'wrap',
          marginBottom: '16px',
        }}
      >
        <div>
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: '999px',
              overflow: 'hidden',
              border: '2px solid #38bdf8',
              background: '#020617',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
              fontWeight: 700,
              color: '#38bdf8',
            }}
          >
            {form.avatarUrl ? (
              <img
                src={form.avatarUrl}
                alt={form.name}
                style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#020617' }}
              />
            ) : (
              (form.name || 'U').charAt(0).toUpperCase()
            )}
          </div>

          {/* NEW: upload control */}
          <div style={{ marginTop: 12 }}>
            <label
              style={{
                display: 'inline-block',
                padding: '10px 24px',
                background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                color: 'white',
                borderRadius: '999px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '14px',
                boxShadow: '0 4px 15px rgba(6, 182, 212, 0.4)',
                textAlign: 'center',
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              {uploading ? 'Uploading...' : 'Upload New Photo'}
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                style={{ display: 'none' }}
                disabled={uploading}
              />
            </label>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 220 }}>
          <p style={{ color: '#e5e7eb', marginBottom: 4 }}>
            <strong>{form.name || 'Your name'}</strong>
          </p>
          <p style={{ color: '#9ca3af', fontSize: 14 }}>{form.email}</p>
          <p style={{ color: '#9ca3af', fontSize: 14 }}>
            {form.phone ? `Phone: ${form.phone}` : 'Add your phone number'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="auth-input-group">
          <label className="auth-label">Name</label>
          <input
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        <div className="auth-input-group">
          <label className="auth-label">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className="auth-input-group">
          <label className="auth-label">Mobile number</label>
          <input
            name="phone"
            type="text"
            value={form.phone}
            onChange={handleChange}
            placeholder="+91-XXXXXXXXXX"
          />
        </div>

        <div className="auth-input-group">
          <label className="auth-label">Profile picture URL</label>
          <input
            name="avatarUrl"
            type="text"
            value={form.avatarUrl}
            onChange={handleChange}
            placeholder="https://..."
          />
        </div>

        <div className="auth-input-group">
          <label className="auth-label">Bio</label>
          <textarea
            name="bio"
            rows="3"
            value={form.bio}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '8px 10px',
              borderRadius: '10px',
              border: '1px solid #334155',
              backgroundColor: '#020617',
              color: '#e5e7eb',
            }}
          />
        </div>

        {message && (
          <p
            style={{
              marginTop: 8,
              color: message.includes('success') ? 'limegreen' : '#fecaca',
            }}
          >
            {message}
          </p>
        )}

        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save changes'}
        </button>
      </form>
    </div>
  );
}

export default ProfilePage;
