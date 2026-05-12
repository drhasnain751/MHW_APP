import './Home.css';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Find Your Inner Peace</h1>
          <p>Professional therapy, mood tracking, and wellness tools designed to calm your mind and improve your well-being.</p>
          <div className="hero-actions">
            <Link to="/signup" className="btn-primary" style={{ padding: '0.75rem 2rem' }}>Get Started</Link>
            <Link to="/services" className="btn-secondary" style={{ padding: '0.75rem 2rem' }}>Learn More</Link>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="features-section">
        <div className="section-container">
          <h2 className="section-title">Everything you need for your mental wellness</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon bg-mint">Tracking</div>
              <h3>Mood Tracking</h3>
              <p>Log your daily emotions, recognize patterns, and learn what triggers your mental states.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon bg-blue">Therapy</div>
              <h3>Professional Therapy</h3>
              <p>Connect with licensed therapists through video or chat, tailored to your schedule.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon bg-teal">Assessments</div>
              <h3>Self-Assessments</h3>
              <p>Take clinically-validated tests to understand your stress, anxiety, and depression levels.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon bg-sage">Wellness</div>
              <h3>Wellness Content</h3>
              <p>Access meditation guides, breathing exercises, and soothing articles library.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="how-it-works">
        <div className="section-container">
          <h2 className="section-title">Your Journey to Wellness</h2>
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <h4>Create Your Profile</h4>
              <p>Sign up in minutes and complete a short assessment to personalize your experience.</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h4>Track & Learn</h4>
              <p>Use our tools daily to monitor your mood and access guided meditation resources.</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h4>Connect & Grow</h4>
              <p>Book sessions with our certified therapists and track your long-term progress.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action Banner */}
      <section className="cta-banner">
        <h2>Start prioritizing your mental health today.</h2>
        <p>Join thousands of members who have found balance, resilience, and personal growth.</p>
        <Link to="/signup" className="btn-primary" style={{ backgroundColor: 'var(--color-white)', color: 'var(--color-deep-teal)' }}>Join for Free</Link>
      </section>
    </div>
  );
}

export default Home;
