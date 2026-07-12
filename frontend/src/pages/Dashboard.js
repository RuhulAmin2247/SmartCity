import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [citizen, setCitizen] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // LocalStorage থেকে citizen info নিচ্ছি
    const saved = localStorage.getItem('citizen');
    if (saved) setCitizen(JSON.parse(saved));

    // Dashboard stats load করছি
    const loadStats = async () => {
      try {
        const res = await API.get('/dashboard/stats');
        setStats(res.data);
      } catch (err) {
        toast.error('Data load failed');
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('citizen');
    navigate('/login');
    toast.success('Logout সফল!');
  };

  if (loading) return (
    <div style={styles.loading}>
      <p>Loading... ⏳</p>
    </div>
  );

  return (
    <div style={styles.container}>

      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>🏙️ Smart City</h2>
        <nav style={styles.nav}>
          {[
            { label: '🏠  Dashboard', path: '/dashboard' },
            { label: '📝  Complaints', path: '/complaints' },
            { label: '💳  Payments', path: '/payments' },
          ].map((item) => (
            <button
              key={item.path}
              style={{
                ...styles.navBtn,
                background: window.location.pathname === item.path
                  ? 'rgba(0,180,216,0.15)' : 'transparent',
                color: window.location.pathname === item.path
                  ? '#00B4D8' : '#90E0EF',
              }}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <button style={styles.logoutBtn} onClick={logout}>
          🚪 Logout
        </button>
      </div>

      {/* Main Content */}
      <div style={styles.main}>

        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.welcome}>
              স্বাগতম, {citizen?.full_name} 👋
            </h1>
            <p style={styles.wardInfo}>
              Ward {citizen?.ward_no} · {citizen?.email}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={styles.cardGrid}>
          {[
            { label: 'মোট নাগরিক', value: stats?.overview?.totalCitizens, color: '#028090', icon: '👥' },
            { label: 'মোট অভিযোগ', value: stats?.overview?.totalComplaints, color: '#1A3A6B', icon: '📝' },
            { label: 'Pending অভিযোগ', value: stats?.overview?.pendingComplaints, color: '#F4845F', icon: '⏳' },
            { label: 'Resolved', value: stats?.overview?.resolvedComplaints, color: '#06D6A0', icon: '✅' },
            { label: 'মোট Payment', value: stats?.overview?.totalPayments, color: '#7B5EA7', icon: '💳' },
            { label: 'Active Emergency', value: stats?.overview?.activeEmergencies, color: '#EF476F', icon: '🚨' },
          ].map((card, i) => (
            <div key={i} style={{ ...styles.card, borderTop: `3px solid ${card.color}` }}>
              <div style={styles.cardIcon}>{card.icon}</div>
              <p style={{ ...styles.cardValue, color: card.color }}>{card.value ?? 0}</p>
              <p style={styles.cardLabel}>{card.label}</p>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>সাম্প্রতিক অভিযোগ</h3>
          <div style={styles.table}>
            <div style={styles.tableHeader}>
              <span>নাগরিক</span>
              <span>Category</span>
              <span>Location</span>
              <span>Status</span>
            </div>
            {stats?.recentComplaints?.map((c, i) => (
              <div key={i} style={styles.tableRow}>
                <span>{c.citizen_name}</span>
                <span>{c.category}</span>
                <span>{c.location}</span>
                <span style={{
                  color: c.status === 'resolved' ? '#06D6A0' :
                         c.status === 'pending' ? '#F4845F' : '#00B4D8',
                  fontWeight: '600'
                }}>
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

const styles = {
  loading: {
    height: '100vh', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    fontSize: '18px', color: '#0A2342',
  },
  container: {
    display: 'flex', minHeight: '100vh',
    background: '#F0F7FF',
  },
  sidebar: {
    width: '220px', background: '#0A2342',
    display: 'flex', flexDirection: 'column',
    padding: '1.5rem 1rem',
    position: 'fixed', height: '100vh',
  },
  logo: {
    fontSize: '16px', color: '#fff',
    fontWeight: '700', marginBottom: '2rem',
  },
  nav: {
    display: 'flex', flexDirection: 'column', gap: '4px', flex: 1,
  },
  navBtn: {
    padding: '10px 14px', border: 'none',
    borderRadius: '8px', cursor: 'pointer',
    textAlign: 'left', fontSize: '13px',
    fontWeight: '500', transition: 'all 0.2s',
  },
  logoutBtn: {
    padding: '10px 14px', background: 'rgba(239,71,111,0.15)',
    border: '1px solid rgba(239,71,111,0.3)',
    borderRadius: '8px', cursor: 'pointer',
    color: '#EF476F', fontSize: '13px',
    fontWeight: '500', textAlign: 'left',
  },
  main: {
    marginLeft: '220px', flex: 1, padding: '1.5rem',
  },
  header: {
    marginBottom: '1.5rem',
  },
  welcome: {
    fontSize: '22px', fontWeight: '700',
    color: '#0A2342', margin: '0 0 4px',
  },
  wardInfo: {
    fontSize: '13px', color: '#8BAFC4', margin: 0,
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '12px', marginBottom: '1.5rem',
  },
  card: {
    background: '#fff', borderRadius: '12px',
    padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  cardIcon: { fontSize: '24px', marginBottom: '8px' },
  cardValue: {
    fontSize: '28px', fontWeight: '700', margin: '0 0 4px',
  },
  cardLabel: {
    fontSize: '12px', color: '#8BAFC4', margin: 0,
  },
  section: {
    background: '#fff', borderRadius: '12px',
    padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  sectionTitle: {
    fontSize: '15px', fontWeight: '600',
    color: '#0A2342', margin: '0 0 1rem',
  },
  table: { display: 'flex', flexDirection: 'column', gap: '8px' },
  tableHeader: {
    display: 'grid', gridTemplateColumns: '1fr 1fr 2fr 1fr',
    padding: '8px 12px', background: '#F0F7FF',
    borderRadius: '8px', fontSize: '11px',
    fontWeight: '600', color: '#8BAFC4',
    textTransform: 'uppercase',
  },
  tableRow: {
    display: 'grid', gridTemplateColumns: '1fr 1fr 2fr 1fr',
    padding: '10px 12px', borderRadius: '8px',
    fontSize: '13px', color: '#0A2342',
    borderBottom: '0.5px solid #E0F0F8',
  },
};