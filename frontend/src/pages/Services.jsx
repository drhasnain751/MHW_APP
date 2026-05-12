import './Pages.css';

function Services() {
  const servicesList = [
    {
      title: "Mood Tracking",
      desc: "Daily logging with intensity sliders and note-taking to visualize your emotional trends over time.",
      color: "var(--color-mint-green)"
    },
    {
      title: "Self-Assessments",
      desc: "Clinical-style questionnaires for depression, anxiety, and stress to provide you with insights.",
      color: "var(--color-calm-blue)"
    },
    {
      title: "1-on-1 Therapy",
      desc: "Connect securely with licensed professionals via chat, audio, or video sessions.",
      color: "var(--color-soft-teal)"
    },
    {
      title: "Wellness Library",
      desc: "Curated meditation guides, breathing exercises, and cognitive behavioral therapy (CBT) resources.",
      color: "#E2E8DD"
    }
  ];

  return (
    <div className="page-container fadeIn">
      <header className="page-header">
        <h1>Our Services</h1>
        <p>Comprehensive tools designed to support your mental health journey at every step.</p>
      </header>

      <section className="page-content">
        <div className="services-grid">
          {servicesList.map((service, index) => (
            <div className="service-card" key={index}>
              <div className="service-color-bar" style={{ backgroundColor: service.color }}></div>
              <h3>{service.title}</h3>
              <p>{service.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Services;
