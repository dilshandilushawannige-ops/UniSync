import { useState } from 'react';
import AppLayout from '../../layouts/AppLayout';
import PageHeader from '../../components/PageHeader';

function CreateTicketModernPage() {
  const [formData, setFormData] = useState({ title: '', category: '', description: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const next = {};
    if (!formData.title.trim()) next.title = 'Title is required.';
    if (!formData.category.trim()) next.category = 'Category is required.';
    if (!formData.description.trim()) next.description = 'Description is required.';
    setErrors(next);
    setSubmitted(Object.keys(next).length === 0);
  };

  return (
    <AppLayout role="student" title="Create Ticket">
      <PageHeader title="Create Ticket" subtitle="Submit an issue with clear details for faster resolution." />
      <form className="glass-card" style={styles.form} onSubmit={handleSubmit}>
        <label style={styles.label}>Title</label>
        <input className="input" name="title" value={formData.title} onChange={handleChange} />
        {errors.title ? <p className="form-error">{errors.title}</p> : null}

        <label style={styles.label}>Category</label>
        <select className="select" name="category" value={formData.category} onChange={handleChange}>
          <option value="">Select category</option>
          <option value="IT_SUPPORT">IT Support</option>
          <option value="MAINTENANCE">Maintenance</option>
          <option value="ELECTRICAL">Electrical</option>
        </select>
        {errors.category ? <p className="form-error">{errors.category}</p> : null}

        <label style={styles.label}>Description</label>
        <textarea className="textarea" rows="5" name="description" value={formData.description} onChange={handleChange} />
        {errors.description ? <p className="form-error">{errors.description}</p> : null}

        <button type="submit" className="btn btn-primary" style={styles.button}>Submit Ticket</button>
        {submitted ? <p style={styles.success}>Ticket validated successfully. Connect this form to API submission.</p> : null}
      </form>
    </AppLayout>
  );
}

const styles = {
  form: { padding: '1rem', maxWidth: 760 },
  label: { marginTop: '0.7rem', display: 'block', marginBottom: '0.35rem', fontWeight: 600 },
  button: { marginTop: '0.9rem' },
  success: { color: '#166534', marginTop: '0.6rem' },
};

export default CreateTicketModernPage;
