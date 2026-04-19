import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();
  const fallbackApiBaseUrl = `${window.location.protocol}//${window.location.hostname}:8081`;
  const backendBaseUrl = (import.meta.env.VITE_API_BASE_URL || fallbackApiBaseUrl).replace(/\/$/, '');
  const googleOAuthUrl = `${backendBaseUrl}/oauth2/authorization/google`;
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isRedirectingGoogle, setIsRedirectingGoogle] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!formData.email.trim()) nextErrors.email = 'Email is required.';
    if (!formData.password.trim()) nextErrors.password = 'Password is required.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      navigate('/dashboard');
    }
  };

  const handleGoogleLogin = () => {
    setIsRedirectingGoogle(true);
    if (window.self !== window.top) {
      window.open(googleOAuthUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    window.location.assign(googleOAuthUrl);
  };

  return (
    <div className="public-shell page-shell" style={styles.wrap}>
      <form onSubmit={handleSubmit} className="glass-card" style={styles.form}>
        <h2 style={styles.title}>Sign in to UniSync</h2>
        <p style={styles.copy}>Use your university account to continue.</p>

        <label style={styles.label} htmlFor="email">Email</label>
        <input className="input" id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
        {errors.email ? <p className="form-error">{errors.email}</p> : null}

        <label style={styles.label} htmlFor="password">Password</label>
        <input className="input" id="password" name="password" type="password" value={formData.password} onChange={handleChange} />
        {errors.password ? <p className="form-error">{errors.password}</p> : null}

        <button className="btn btn-primary" style={styles.submit} type="submit">Sign In</button>
        <button
          className="btn"
          style={styles.oauthButton}
          type="button"
          onClick={handleGoogleLogin}
          disabled={isRedirectingGoogle}
        >
          {isRedirectingGoogle ? 'Redirecting...' : 'Continue with Google'}
        </button>
        <Link style={styles.backLink} to="/">Back to Home</Link>
      </form>
    </div>
  );
}

const styles = {
  wrap: {
    display: 'grid',
    placeItems: 'center',
    padding: '1rem',
  },
  form: {
    width: 'min(100%, 420px)',
    padding: '1.45rem',
  },
  title: {
    margin: 0,
    color: '#0f172a',
  },
  copy: {
    color: '#475569',
    margin: '0.35rem 0 1rem',
  },
  label: {
    display: 'block',
    marginTop: '0.8rem',
    marginBottom: '0.35rem',
    fontWeight: 600,
    color: '#334155',
  },
  submit: {
    width: '100%',
    marginTop: '1rem',
  },
  oauthButton: {
    width: '100%',
    marginTop: '0.6rem',
    border: '1px solid #cbd5e1',
    backgroundColor: '#ffffff',
    color: '#0f172a',
    borderRadius: '10px',
    padding: '0.65rem 0.9rem',
    cursor: 'pointer',
  },
  backLink: {
    display: 'inline-block',
    marginTop: '0.7rem',
    color: '#334155',
    textDecoration: 'none',
  },
};

export default LoginPage;
