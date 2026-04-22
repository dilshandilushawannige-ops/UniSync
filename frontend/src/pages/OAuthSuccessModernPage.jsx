import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function OAuthSuccessModernPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/dashboard', { replace: true });
    }, 1000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="public-shell page-shell" style={styles.wrap}>
      <article className="glass-card" style={styles.card}>
        <h2 style={styles.title}>Authentication Success</h2>
        <p style={styles.copy}>You are being redirected to your dashboard...</p>
      </article>
    </div>
  );
}

const styles = {
  wrap: { display: 'grid', placeItems: 'center', padding: '1rem' },
  card: { padding: '1.4rem', width: 'min(100%, 420px)', textAlign: 'center' },
  title: { margin: 0 },
  copy: { marginTop: '0.5rem', color: '#475569' },
};

export default OAuthSuccessModernPage;
