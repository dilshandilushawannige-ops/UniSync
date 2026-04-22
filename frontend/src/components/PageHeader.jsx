function PageHeader({ title, subtitle, action }) {
  return (
    <div style={styles.wrap}>
      <div>
        <h2 style={styles.title}>{title}</h2>
        {subtitle ? <p style={styles.subtitle}>{subtitle}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}

const styles = {
  wrap: {
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '0.8rem',
    flexWrap: 'wrap',
  },
  title: {
    margin: 0,
    fontSize: '1.35rem',
    color: '#0f172a',
  },
  subtitle: {
    margin: '0.3rem 0 0',
    color: '#475569',
  },
};

export default PageHeader;
