import './Pages.css';

function About() {
  return (
    <div className="page-container fadeIn">
      <header className="page-header">
        <h1>About Us</h1>
        <p>Our mission is to make mental wellness accessible, personalized, and effective for everyone.</p>
      </header>

      <section className="page-content">
        <div className="content-block">
          <h2>Our Vision</h2>
          <p>We envision a world where mental health is prioritized as much as physical health. By blending intuitive technology with professional care, we're breaking down the barriers to therapy, guided wellness, and self-understanding.</p>
        </div>

        <div className="content-block">
          <h2>Why Mental Health Matters</h2>
          <p>Mental well-being is the foundation of a fulfilling life. We believe that by checking in with yourself every day—whether through mood tracking or dedicated meditation—you can build resilience against stress and anxiety.</p>
        </div>

        <div className="team-section">
          <h2>Our Platform Approach</h2>
          <div className="team-grid">
            <div className="team-card">
              <div className="team-avatar" style={{ backgroundColor: 'var(--color-mint-green)' }}>E</div>
              <h3>Empathetic Design</h3>
              <p>Every feature is built with compassion and care, ensuring a gentle user experience.</p>
            </div>
            <div className="team-card">
              <div className="team-avatar" style={{ backgroundColor: 'var(--color-calm-blue)' }}>P</div>
              <h3>Professional Care</h3>
              <p>We connect users to certified and vetted therapists for high-quality care.</p>
            </div>
            <div className="team-card">
              <div className="team-avatar" style={{ backgroundColor: 'var(--color-soft-teal)' }}>S</div>
              <h3>Secure & Private</h3>
              <p>Your data, sessions, and journals are strictly protected with enterprise-grade security.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
