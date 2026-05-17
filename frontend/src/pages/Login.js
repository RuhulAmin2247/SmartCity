import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../api';

export default function Login() {
  const navigate = useNavigate();

  // Form data state
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  // Input change handle 
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Form submit handle
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/auth/login', form);

      // Token ও citizen info save 
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('citizen', JSON.stringify(res.data.citizen));

      toast.success('Login সফল! 👋');
      navigate('/dashboard');

    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>🏙️ Smart City</h1>
          <p style={styles.subtitle}>নাগরিক সেবা পোর্টাল</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              name="email"
              placeholder="আপনার email দিন"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              name="password"
              placeholder="আপনার password দিন"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
            type="submit"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Login করুন'}
          </button>
        </form>

        {/* Register link */}
        <p style={styles.link}>
          Account নেই?{' '}
          <Link to="/register" style={{ color: '#028090' }}>
            Register করুন
          </Link>
        </p>

      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #021526 0%, #0A2342 100%)',
  },
  card: {
    background: '#fff',
    borderRadius: '16px',
    padding: '40px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#0A2342',
  },
  subtitle: {
    fontSize: '14px',
    color: '#8BAFC4',
    marginTop: '4px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#0A2342',
  },
  input: {
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1.5px solid #D0E8F0',
    fontSize: '14px',
    outline: 'none',
    transition: 'border 0.2s',
  },
  btn: {
    padding: '14px',
    background: 'linear-gradient(135deg, #028090, #00B4D8)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px',
  },
  link: {
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '13px',
    color: '#8BAFC4',
  },
};