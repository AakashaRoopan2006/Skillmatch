import { useState } from "react";
import "./App.css";
import StudentProfile from "./StudentProfile";
import StudentDashboard from "./StudentDashboard";
import RecruiterDashboard from "./RecruiterDashboard";

function App() {
  const [role, setRole] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showRecruiterDashboard, setShowRecruiterDashboard] =
    useState(false);

  const [studentData, setStudentData] = useState(null);

  // STUDENT DASHBOARD
  if (showDashboard) {
    return (
      <StudentDashboard
        studentData={studentData}
        onLogout={() => {
          setStudentData(null);
          setShowDashboard(false);
          setShowProfile(false);
          setRole("");
        }}
      />
    );
  }

  // RECRUITER DASHBOARD
  if (showRecruiterDashboard) {
    return (
      <RecruiterDashboard
        onLogout={() => {
          setShowRecruiterDashboard(false);
          setRole("");
        }}
      />
    );
  }

  // STUDENT PROFILE
  if (showProfile) {
    return (
      <StudentProfile
        onBack={() => setShowProfile(false)}
        onProfileSaved={(data) => {
          setStudentData(data);
          setShowProfile(false);
          setShowDashboard(true);
        }}
      />
    );
  }

  return (
    <div className="app">
      <nav className="navbar">
        <div className="logo">
          Skill<span>match</span>
        </div>

        <div className="nav-links">
          <a href="#features">Features</a>

          <a href="#how-it-works">
            How it works
          </a>

          <button
            type="button"
            className="nav-button"
            onClick={() => setRole("student")}
          >
            Get Started
          </button>
        </div>
      </nav>

      <main>
        <section className="hero-section">
          <div className="hero-content">
            <div className="small-badge">
              <span>✦</span> Smart career matching platform
            </div>

            <h1>
              Turn your skills into
              <span> career opportunities.</span>
            </h1>

            <p className="hero-description">
              Skillmatch connects students with suitable
              job opportunities based on their skills,
              interests and career goals.
            </p>

            <div className="hero-buttons">
              <button
                type="button"
                className="primary-button"
                onClick={() => setRole("student")}
              >
                Find My Career →
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={() => setRole("recruiter")}
              >
                I'm a Recruiter
              </button>
            </div>

            <div className="trust-row">
              <div>
                <strong>01</strong>
                <span>Build your profile</span>
              </div>

              <div>
                <strong>02</strong>
                <span>Discover matching jobs</span>
              </div>

              <div>
                <strong>03</strong>
                <span>Grow your career</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-glow"></div>

            <div className="profile-card">
              <div className="card-top">
                <span className="card-label">
                  Your career profile
                </span>

                <span className="online-dot">
                  ●
                </span>
              </div>

              <div className="profile-main">
                <div className="avatar">S</div>

                <div>
                  <h3>Skill Explorer</h3>
                  <p>Career-ready candidate</p>
                </div>
              </div>

              <div className="progress-heading">
                <span>Profile strength</span>
                <strong>78%</strong>
              </div>

              <div className="progress-bar">
                <div></div>
              </div>

              <div className="skill-tags">
                <span>Python</span>
                <span>Communication</span>
                <span>Problem Solving</span>
              </div>

              <div className="match-box">
                <div className="match-icon">✦</div>

                <div>
                  <strong>
                    Career match found
                  </strong>

                  <p>
                    Based on your skills and interests
                  </p>
                </div>

                <span className="match-percent">
                  92%
                </span>
              </div>
            </div>

            <div className="floating-card floating-one">
              <span>↗</span>

              <div>
                <strong>Skills → Jobs</strong>
                <p>Smart recommendations</p>
              </div>
            </div>

            <div className="floating-card floating-two">
              <span>✓</span>

              <div>
                <strong>Profile completed</strong>
                <p>Ready to explore</p>
              </div>
            </div>
          </div>
        </section>

        <section
          className="features-section"
          id="features"
        >
          <div className="section-heading">
            <p className="section-label">
              WHY SKILLMATCH?
            </p>

            <h2>
              Everything you need to move forward.
            </h2>

            <p>
              A platform designed to help students
              discover opportunities and recruiters
              find emerging talent.
            </p>
          </div>

          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon purple">
                ✦
              </div>

              <h3>Skill-based matching</h3>

              <p>
                Match technical skills with relevant
                job roles.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon blue">
                ⌕
              </div>

              <h3>Explore opportunities</h3>

              <p>
                Discover suitable jobs and career
                pathways.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon green">
                ↗
              </div>

              <h3>Career growth</h3>

              <p>
                Identify skill gaps and understand
                what to learn next.
              </p>
            </div>
          </div>
        </section>

        <section
          className="how-section"
          id="how-it-works"
        >
          <div>
            <p className="section-label">
              HOW IT WORKS
            </p>

            <h2>
              Your next opportunity starts here.
            </h2>
          </div>

          <div className="steps">
            <div className="step">
              <span>01</span>

              <div>
                <h3>Create your profile</h3>
                <p>
                  Add your education, skills and
                  interests.
                </p>
              </div>
            </div>

            <div className="step">
              <span>02</span>

              <div>
                <h3>Get matched</h3>

                <p>
                  Our platform suggests suitable
                  opportunities.
                </p>
              </div>
            </div>

            <div className="step">
              <span>03</span>

              <div>
                <h3>Take your next step</h3>

                <p>
                  Explore jobs and improve your
                  employability.
                </p>
              </div>
            </div>
          </div>
        </section>

        {role && (
          <div className="login-overlay">
            <section className="login-section">
              <div className="login-card">
                <button
                  type="button"
                  className="close-button"
                  onClick={() => setRole("")}
                >
                  ×
                </button>

                <p className="section-label">
                  WELCOME TO SKILLMATCH
                </p>

                <h2>
                  {role === "student"
                    ? "Let's discover your career path."
                    : "Find your next talented candidate."}
                </h2>

                <p>
                  {role === "student"
                    ? "Create your student profile to explore suitable job opportunities."
                    : "Enter your details to access the recruiter portal."}
                </p>

                <input
                  type="text"
                  placeholder={
                    role === "student"
                      ? "Enter your name"
                      : "Company name"
                  }
                />

                <input
                  type="email"
                  placeholder="Enter your email"
                />

                <button
                  type="button"
                  className="primary-button full-button"
                  onClick={() => {
                    if (role === "student") {
                      setRole("");
                      setShowProfile(true);
                    } else {
                      setRole("");
                      setShowRecruiterDashboard(true);
                    }
                  }}
                >
                  Continue →
                </button>
              </div>
            </section>
          </div>
        )}
      </main>

      <footer>
        <div className="logo">
          Skill<span>match</span>
        </div>

        <p>
          Connecting skills with meaningful opportunities.
        </p>
      </footer>
    </div>
  );
}

export default App;