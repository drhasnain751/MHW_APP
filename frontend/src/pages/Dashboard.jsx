import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_BASE } from '../apiConfig';
import './Dashboard.css';

function Dashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Mood Tracker State
  const [moodLogs, setMoodLogs] = useState([]);
  const [newMood, setNewMood] = useState('Happy');
  const [intensity, setIntensity] = useState(5);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Assessments State
  const [assessments, setAssessments] = useState([]);
  const [takingAssessment, setTakingAssessment] = useState(false);
  const [assessmentAnswers, setAssessmentAnswers] = useState({});
  const [assessmentScore, setAssessmentScore] = useState(null);
  
  // Wellness Content State
  const [wellnessContent, setWellnessContent] = useState([]);

  // Therapy State
  const [therapists, setTherapists] = useState([]);
  const [mySessions, setMySessions] = useState([]);
  const [bookingTherapist, setBookingTherapist] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingStatus, setBookingStatus] = useState('');
  
  // For Therapist Dashboard
  const [therapistSessions, setTherapistSessions] = useState([]);
  const [therapistError, setTherapistError] = useState('');

  const sampleTest = {
    type: 'Stress Test',
    questions: [
      { id: 1, text: 'How often have you felt overwhelmed lately?' },
      { id: 2, text: 'How often do you feel you cannot cope with all things you have to do?' },
      { id: 3, text: 'How often have you been angered because of things that happened outside of your control?' }
    ],
    options: [
      { text: 'Never', value: 0 },
      { text: 'Sometimes', value: 1 },
      { text: 'Fairly Often', value: 2 },
      { text: 'Very Often', value: 3 }
    ]
  };

  // Fetch moods
  const fetchMoods = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/moods`);
      if (res.ok) {
        const data = await res.json();
        setMoodLogs(data);
      }
    } catch (err) {
      console.error('Error fetching moods:', err);
    }
  };

  const fetchAssessments = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/assessments`);
      if (res.ok) {
        const data = await res.json();
        setAssessments(data);
      }
    } catch (err) {
      console.error('Error fetching assessments', err);
    }
  };

  const fetchContent = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/content`);
      if (res.ok) {
        const data = await res.json();
        setWellnessContent(data);
      }
    } catch (err) {
      console.error('Error fetching content', err);
    }
  };

  const fetchTherapyData = async () => {
    try {
        const [therapistsRes, sessionsRes] = await Promise.all([
            fetch(`${API_BASE}/api/therapy/therapists`),
            fetch(`${API_BASE}/api/therapy/my-sessions`)
        ]);
        if (therapistsRes.ok) setTherapists(await therapistsRes.json());
        if (sessionsRes.ok) setMySessions(await sessionsRes.json());
    } catch (err) {
        console.error('Error fetching therapy data', err);
    }
  };

  const fetchTherapistSessions = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/therapy/therapist-sessions`);
      if (res.ok) setTherapistSessions(await res.json());
    } catch (err) {
      setTherapistError('Error fetching sessions');
    }
  };

  const handleUpdateSessionStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_BASE}/api/therapy/session/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) fetchTherapistSessions();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user?.role === 'therapist') {
      fetchTherapistSessions();
    } else if (user?.role === 'user') {
      fetchMoods();
      fetchAssessments();
      fetchContent();
      fetchTherapyData();
    }
  }, [user]);

  const handleMoodSubmit = async () => {
    setIsSubmitting(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/moods`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood: newMood, intensity: Number(intensity), notes })
      });
      if (res.ok) {
        fetchMoods();
        setNewMood('Happy');
        setIntensity(5);
        setNotes('');
        setActiveTab('overview');
      } else {
        const errorData = await res.json();
        setError(errorData.message || 'Failed to save mood log.');
      }
    } catch (err) {
      setError('Network error saving mood log.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssessmentSubmit = async () => {
    let score = 0;
    Object.values(assessmentAnswers).forEach(val => score += val);
    
    let severity = 'Low';
    if (score >= 4) severity = 'Moderate';
    if (score >= 7) severity = 'High';

    try {
      const res = await fetch(`${API_BASE}/api/assessments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: sampleTest.type,
          score,
          severity,
          answers: Object.values(assessmentAnswers)
        })
      });
      if (res.ok) {
        setAssessmentScore(score);
        fetchAssessments();
      }
    } catch (err) {
      console.error('Failed to submit assessment', err);
    }
  };

  const handleBookSession = async () => {
    setBookingStatus('Booking...');
    try {
      const res = await fetch(`${API_BASE}/api/therapy/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ therapistId: bookingTherapist, date: bookingDate })
      });
      if (res.ok) {
        setBookingStatus('Success!');
        setBookingTherapist('');
        setBookingDate('');
        fetchTherapyData();
      } else {
        const data = await res.json();
        setBookingStatus(data.message || 'Error booking session.');
      }
    } catch (err) {
      setBookingStatus('Network error.');
    }
    setTimeout(() => setBookingStatus(''), 3000);
  };

  if (user?.role === 'therapist') {
    return (
      <div className="dashboard-layout fadeIn">
        <aside className="dashboard-sidebar">
          <div className="sidebar-profile">
            <div className="avatar" style={{ backgroundColor: '#009688' }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="profile-info">
              <h4>Dr. {user?.name}</h4>
              <span className="role-badge" style={{backgroundColor: '#e0f2f1', color: '#009688'}}>Therapist</span>
            </div>
          </div>
          <nav className="sidebar-nav">
            <button className="nav-item active">My Schedule & Patients</button>
          </nav>
          <div className="sidebar-footer">
            <button onClick={logout} className="logout-btn">Log out</button>
          </div>
        </aside>

        <main className="dashboard-main">
          <header className="dashboard-header">
            <h2>Therapist Portal</h2>
            <p>Manage your appointments and patient sessions.</p>
          </header>
          
          <div className="dashboard-content">
            <div className="feature-section">
              <h3>My Schedule</h3>
              {therapistError && <p style={{color:'red'}}>{therapistError}</p>}
              {therapistSessions.length === 0 ? (
                <p>No upcoming sessions scheduled.</p>
              ) : (
                <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem'}}>
                  {therapistSessions.map(session => (
                    <div key={session._id} style={{backgroundColor: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <div>
                        <h4 style={{marginBottom: '0.5rem'}}>Patient: {session.user?.name} ({session.user?.email})</h4>
                        <p style={{color: '#555'}}>{new Date(session.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</p>
                        <p style={{marginTop: '0.5rem', color: session.status === 'scheduled' ? '#1565c0' : (session.status === 'completed' ? '#2e7d32' : '#c62828')}}><strong>Status:</strong> {session.status ? session.status.toUpperCase() : 'SCHEDULED'}</p>
                      </div>
                      <div style={{display: 'flex', gap: '0.5rem'}}>
                        {(session.status === 'scheduled' || !session.status) && (
                          <>
                            <button onClick={() => handleUpdateSessionStatus(session._id, 'completed')} className="btn-primary" style={{backgroundColor: '#4caf50', borderColor: '#4caf50'}}>Mark Completed</button>
                            <button onClick={() => handleUpdateSessionStatus(session._id, 'cancelled')} className="btn-secondary" style={{color: '#f44336', borderColor: '#f44336'}}>Cancel</button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-layout fadeIn">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-profile">
          <div className="avatar" style={{ backgroundColor: 'var(--color-calm-blue)' }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <h4>{user?.name}</h4>
            <span className="role-badge">{user?.role}</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`nav-item ${activeTab === 'mood' ? 'active' : ''}`}
            onClick={() => setActiveTab('mood')}
          >
            Mood Tracking
          </button>
          <button 
            className={`nav-item ${activeTab === 'assessments' ? 'active' : ''}`}
            onClick={() => setActiveTab('assessments')}
          >
            Assessments
          </button>
          <button 
            className={`nav-item ${activeTab === 'wellness' ? 'active' : ''}`}
            onClick={() => setActiveTab('wellness')}
          >
            Wellness Content
          </button>
          <button 
            className={`nav-item ${activeTab === 'therapy' ? 'active' : ''}`}
            onClick={() => setActiveTab('therapy')}
          >
            Therapy Sessions
          </button>
        </nav>

        <div className="sidebar-footer">
          <button onClick={logout} className="logout-btn">Log out</button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h2>Welcome back, {user?.name?.split(' ')[0]}</h2>
          <p>Here is your daily mental wellness summary.</p>
        </header>

        <div className="dashboard-content">
          {activeTab === 'overview' && (
            <div className="overview-grid">
              <div className="stat-card">
                <h3>Today's Mood</h3>
                <div className="stat-value text-teal">
                  {moodLogs.length > 0 && new Date(moodLogs[0].createdAt).toDateString() === new Date().toDateString() 
                    ? `${moodLogs[0].mood} (${moodLogs[0].intensity}/10)` 
                    : 'Not Logged'}
                </div>
                <button className="btn-secondary" style={{ marginTop: '1rem', width: '100%' }} onClick={() => setActiveTab('mood')}>Log Mood</button>
              </div>
              <div className="stat-card">
                <h3>Next Session</h3>
                <div className="stat-value text-muted">
                  {mySessions.length > 0 && mySessions.filter(s => new Date(s.date) > new Date()).length > 0 
                  ? new Date(mySessions.filter(s => new Date(s.date) > new Date())[0].date).toLocaleDateString() 
                  : 'No Upcoming Sessions'}
                </div>
              </div>
              <div className="stat-card">
                <h3>Recent Assessment</h3>
                <div className="stat-value text-blue">
                  {assessments.length > 0 
                    ? `${assessments[0].type} - ${assessments[0].severity}` 
                    : 'None completed'}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'mood' && (
            <div className="feature-section">
              <h3>Track Your Mood</h3>
              <p>Log how you are feeling today to keep track of your emotional journey.</p>
              <div className="mood-logger-card">
                {error && <div style={{color: 'red', marginBottom: '1rem'}}>{error}</div>}
                {/* Simplified Mood Logger UI */}
                <div className="mood-emojis">
                   {['Happy', 'Calm', 'Sad', 'Anxious'].map((m) => (
                      <div 
                        key={m} 
                        className={`emoji-btn ${newMood === m ? 'active' : ''}`}
                        onClick={() => setNewMood(m)}
                      >
                        {m === 'Happy' && '😊 '}
                        {m === 'Calm' && '😌 '}
                        {m === 'Sad' && '😢 '}
                        {m === 'Anxious' && '😬 '}
                        {m}
                      </div>
                   ))}
                </div>
                <div className="form-group" style={{marginTop: '1.5rem'}}>
                  <label>Intensity (1-10): {intensity}</label>
                  <input 
                    type="range" min="1" max="10" 
                    value={intensity} 
                    onChange={(e) => setIntensity(e.target.value)} 
                    className="w-full" 
                  />
                </div>
                <div className="form-group" style={{marginTop: '1rem'}}>
                  <label>Notes (Optional)</label>
                  <textarea 
                    rows="3" 
                    placeholder="Why do you feel this way?"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  ></textarea>
                </div>
                <button 
                  className="btn-primary" 
                  style={{marginTop: '1rem'}} 
                  onClick={handleMoodSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save Mood Log'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'assessments' && (
            <div className="feature-section">
              <h3>Self Assessments</h3>
              <p>Check in with yourself using clinical standard screening tools.</p>
              
              {!takingAssessment ? (
                <div className="assessment-card" style={{backgroundColor: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)'}}>
                  <h4>{sampleTest.type}</h4>
                  <p style={{color: 'var(--color-muted)', marginBottom: '1rem'}}>A short test to measure your current stress levels.</p>
                  <button className="btn-primary" onClick={() => {
                    setTakingAssessment(true);
                    setAssessmentScore(null);
                    setAssessmentAnswers({});
                  }}>Take Assessment</button>
                  
                  {assessments.length > 0 && (
                    <div style={{marginTop: '2rem'}}>
                      <h4 style={{marginBottom: '0.5rem'}}>Past Results</h4>
                      <ul style={{listStyle: 'none', padding: 0}}>
                        {assessments.map(a => (
                          <li key={a._id} style={{padding: '0.75rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between'}}>
                            <span>{new Date(a.createdAt).toLocaleDateString()}: <strong>{a.type}</strong></span>
                            <span>Score: {a.score} ({a.severity})</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="assessment-quiz-card" style={{backgroundColor: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)'}}>
                  {assessmentScore === null ? (
                    <div>
                      <h4 style={{marginBottom: '1rem'}}>{sampleTest.type}</h4>
                      {sampleTest.questions.map((q, i) => (
                        <div key={q.id} style={{marginBottom: '1.5rem'}}>
                          <p style={{fontWeight: '500', marginBottom: '0.5rem'}}>{i + 1}. {q.text}</p>
                          <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
                            {sampleTest.options.map(opt => (
                              <label key={opt.value} style={{fontWeight: 'normal', display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer'}}>
                                <input 
                                  type="radio" 
                                  name={`question-${q.id}`} 
                                  value={opt.value}
                                  onChange={() => setAssessmentAnswers({...assessmentAnswers, [q.id]: opt.value})}
                                  checked={assessmentAnswers[q.id] === opt.value}
                                />
                                {opt.text}
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                      <div style={{marginTop: '2rem'}}>
                        <button 
                          className="btn-primary" 
                          onClick={handleAssessmentSubmit}
                          disabled={Object.keys(assessmentAnswers).length !== sampleTest.questions.length}
                        >
                          Submit Assessment
                        </button>
                        <button className="btn-secondary" style={{marginLeft: '1rem'}} onClick={() => setTakingAssessment(false)}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{textAlign: 'center', padding: '2rem 0'}}>
                      <h4 style={{fontSize: '1.5rem', marginBottom: '1rem'}}>Assessment Complete</h4>
                      <p style={{fontSize: '1.1rem'}}>Your Score: <strong>{assessmentScore}</strong></p>
                      <p style={{fontSize: '1.1rem', marginBottom: '2rem'}}>Severity Level: <strong>{assessments.length > 0 ? assessments[0].severity : ''}</strong></p>
                      <button className="btn-secondary" onClick={() => setTakingAssessment(false)}>Back to list</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'wellness' && (
            <div className="feature-section">
              <h3>Wellness Content</h3>
              <p>Explore articles, exercises, and audio tracks to support your mental health.</p>
              
              <div className="content-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '1.5rem'}}>
                {wellnessContent.map(item => (
                  <div key={item._id} className="content-card" style={{backgroundColor: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                      <span style={{fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--color-primary)', backgroundColor: 'var(--color-calm-blue)', padding: '0.2rem 0.6rem', borderRadius: '20px'}}>
                        {item.type}
                      </span>
                      <span style={{fontSize: '0.85rem', color: 'var(--color-muted)'}}>{item.duration}</span>
                    </div>
                    <h4 style={{marginBottom: '0.5rem', fontSize: '1.1rem'}}>{item.title}</h4>
                    <p style={{fontSize: '0.95rem', color: '#555', flex: 1, marginBottom: '1.5rem'}}>{item.content}</p>
                    <button className="btn-secondary" style={{width: '100%', alignSelf: 'flex-end'}}>
                      {item.type === 'Article' ? 'Read More' : (item.type === 'Audio' ? 'Listen Now' : 'Start Exercise')}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'therapy' && (
            <div className="feature-section">
              <h3>Therapy Sessions</h3>
              <p>Book and manage appointments with certified mental health professionals.</p>
              
              <div style={{display: 'flex', gap: '2rem', flexWrap: 'wrap', marginTop: '1.5rem'}}>
                <div className="booking-card" style={{flex: '1 1 300px', backgroundColor: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)'}}>
                  <h4 style={{marginBottom: '1rem'}}>Book a Session</h4>
                  {bookingStatus && <div style={{marginBottom: '1rem', color: bookingStatus === 'Success!' ? 'green' : 'red', fontWeight: '500'}}>{bookingStatus}</div>}
                  <div className="form-group" style={{marginBottom: '1rem'}}>
                    <label>Select Therapist</label>
                    <select 
                      className="w-full" 
                      style={{padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc', marginTop: '0.5rem'}}
                      value={bookingTherapist} 
                      onChange={(e) => setBookingTherapist(e.target.value)}
                    >
                      <option value="">-- Choose a Therapist --</option>
                      {therapists.map(t => (
                        <option key={t._id} value={t._id}>Dr. {t.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group" style={{marginBottom: '1rem'}}>
                    <label>Select Date & Time</label>
                    <input 
                      type="datetime-local" 
                      className="w-full" 
                      style={{padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc', marginTop: '0.5rem'}}
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                    />
                  </div>
                  <button 
                    className="btn-primary" 
                    onClick={handleBookSession}
                    disabled={!bookingTherapist || !bookingDate || bookingStatus === 'Booking...'}
                    style={{marginTop: '0.5rem', width: '100%'}}
                  >
                    {bookingStatus === 'Booking...' ? 'Processing...' : 'Confirm Booking'}
                  </button>
                </div>
                
                <div className="my-sessions-card" style={{flex: '1 1 300px', backgroundColor: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)'}}>
                  <h4 style={{marginBottom: '1rem'}}>My Appoinments</h4>
                  {mySessions.length === 0 ? (
                    <p style={{color: '#777'}}>You do not have any sessions currently booked.</p>
                  ) : (
                    <ul style={{listStyle: 'none', padding: 0}}>
                      {mySessions.map((session) => (
                        <li key={session._id} style={{padding: '1rem', borderBottom: '1px solid #eee', marginBottom: '0.5rem', borderRadius: '8px', border: '1px solid #f0f0f0'}}>
                          <div style={{fontWeight: 'bold', marginBottom: '0.2rem', color: 'var(--color-primary)'}}>
                            with Dr. {session.therapist?.name}
                          </div>
                          <div style={{fontSize: '0.9rem', color: '#555'}}>
                            {new Date(session.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                          </div>
                          <div style={{marginTop: '0.5rem', display: 'inline-block', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', backgroundColor: session.status === 'scheduled' ? '#e3f2fd' : (session.status === 'completed' ? '#e8f5e9' : '#ffebee'), color: session.status === 'scheduled' ? '#1565c0' : (session.status === 'completed' ? '#2e7d32' : '#c62828')}}>
                            {session.status ? session.status.toUpperCase() : 'SCHEDULED'}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {(activeTab !== 'overview' && activeTab !== 'mood' && activeTab !== 'assessments' && activeTab !== 'wellness' && activeTab !== 'therapy') && (
            <div className="feature-section">
              <h3>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h3>
              <p>This feature module is under active development.</p>
              <div className="coming-soon-card">
                <p>New tools and content are being added regularly. Check back soon!</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
