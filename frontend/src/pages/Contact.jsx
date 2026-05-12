import './Pages.css';

function Contact() {
  return (
    <div className="page-container fadeIn">
      <header className="page-header">
        <h1>Contact Us</h1>
        <p>We're here to help. Reach out to our support team for any questions or assistance.</p>
      </header>

      <section className="page-content split-layout">
        <div className="contact-info">
          <h2>Get in Touch</h2>
          <p>Whether you're looking for help navigating the platform or have technical issues, our team is ready to assist you.</p>
          <div className="info-item">
            <strong>Email:</strong> support@mentalwellness.app
          </div>
          <div className="info-item">
            <strong>Phone:</strong> 1-800-WELLNESS
          </div>
          <div className="info-item">
            <strong>Hours:</strong> Mon-Fri, 9am - 6pm EST
          </div>
          
          <div className="faq-preview" style={{ marginTop: '2rem' }}>
            <h3>Frequent Questions</h3>
            <p><strong>Is therapy covered by insurance?</strong><br/>Many of our therapists accept major insurance plans. Please check details during booking.</p>
          </div>
        </div>

        <div className="contact-form-container">
          <form className="contact-form">
            <div className="form-group">
              <label>Name</label>
              <input type="text" placeholder="Your name" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="Your email address" />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea rows="5" placeholder="How can we help you?"></textarea>
            </div>
            <button type="button" className="btn-primary w-full">Send Message</button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Contact;
