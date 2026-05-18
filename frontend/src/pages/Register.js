import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../api';

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: '',
    nid: '',
    email: '',
    password: '',
    phone: '',
    date_of_birth: '',
    ward_no: '',
    address: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/auth/register', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('citizen', JSON.stringify(res.data.citizen));
      toast.success('Registration সফল! 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>🏙️ Smart City</h1>
          <p style={styles.subtitle}>নতুন account তৈরি করুন</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>পুরো নাম</label>
              <input style={styles.input} name="full_name"
                placeholder="আপনার নাম" onChange={handleChange} required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>NID নম্বর</label>
              <input style={styles.input} name="nid"
                placeholder="NID নম্বর" onChange={handleChange} required />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Email</label>
              <input style={styles.input} name="email" type="email"
                placeholder="Email" onChange={handleChange} required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input style={styles.input} name="password" type="password"
                placeholder="Password" onChange={handleChange} required />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>ফোন নম্বর</label>
              <input style={styles.input} name="phone"
                placeholder="01XXXXXXXXX" onChange={handleChange} required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>জন্মতারিখ</label>
              <input style={styles.input} name="date_of_birth" type="date"
                onChange={handleChange} required />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Ward নম্বর</label>
              <input style={styles.input} name="ward_no" type="number"
                placeholder="Ward নম্বর" onChange={handleChange} required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>ঠিকানা</label>
              <input style={styles.input} name="address"
                placeholder="পূর্ণ ঠিকানা" onChange={handleChange} required />
            </div>
          </div>

          <button
            style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
            type="submit" disabled={loading}
          >
            {loading ? 'Loading...' : 'Register করুন'}
          </button>
        </form>

        <p style={styles.link}>
          আগেই account আছে?{' '}
          <Link to="/login" style={{ color: '#028090' }}>Login করুন</Link>
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
    padding: '20px',
  },
  card: {
    background: '#fff',
    borderRadius: '16px',
    padding: '40px',
    width: '100%',
    maxWidth: '600px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '28px',
  },
  title: {
    fontSize: '26px',
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
    gap: '14px',
  },
  row: {
    display: 'flex',
    gap: '12px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    flex: 1,
  },
  label: {
    fontSize: '12px',
    fontWeight: '500',
    color: '#0A2342',
  },
  input: {
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1.5px solid #D0E8F0',
    fontSize: '13px',
    outline: 'none',
    width: '100%',
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
    marginTop: '6px',
  },
  link: {
    textAlign: 'center',
    marginTop: '18px',
    fontSize: '13px',
    color: '#8BAFC4',
  },
};