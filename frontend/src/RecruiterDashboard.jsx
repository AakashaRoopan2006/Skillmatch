import { useEffect, useState } from "react";

function RecruiterDashboard({ onLogout }) {
  const [students, setStudents] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [activeSection, setActiveSection] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [shortlisted, setShortlisted] = useState([]);
  const [showJobForm, setShowJobForm] = useState(false);

const [newJob, setNewJob] = useState({
  title: "",
  company: "",
  location: "",
  skills: "",
});

  useEffect(() => {
    const loadData = async () => {
      try {
        const studentResponse = await fetch(
          "https://skillmatch-s7cj.onrender.com/students"
        );

        const jobResponse = await fetch(
          "https://skillmatch-s7cj.onrender.com/jobs"
        );

        if (studentResponse.ok) {
          const studentData = await studentResponse.json();
          setStudents(studentData.students || []);
        }

        if (jobResponse.ok) {
          const jobData = await jobResponse.json();
          setJobs(Array.isArray(jobData) ? jobData : []);
        }
      } catch (error) {
        console.error("Error loading recruiter data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const menuItems = [
    { id: "overview", label: "Overview", icon: "🏠" },
    { id: "candidates", label: "Candidates", icon: "👥" },
    { id: "jobs", label: "Job Listings", icon: "💼" },
  ];
  const toggleShortlist = (student) => {
  const studentName =
    student.name || student.fullName || "Student";

  const alreadyShortlisted = shortlisted.some(
    (item) =>
      (item.name || item.fullName || "Student") === studentName
  );

  if (alreadyShortlisted) {
    setShortlisted(
      shortlisted.filter(
        (item) =>
          (item.name || item.fullName || "Student") !== studentName
      )
    );
  } else {
    setShortlisted([...shortlisted, student]);
  }
};

const isShortlisted = (student) => {
  const studentName =
    student.name || student.fullName || "Student";

  return shortlisted.some(
    (item) =>
      (item.name || item.fullName || "Student") === studentName
  );
};

  const renderOverview = () => (
    <div>
      <div style={styles.heading}>
        <p style={styles.smallLabel}>RECRUITER PORTAL</p>

        <h1 style={styles.title}>
          Welcome to Skillmatch 👋
        </h1>

        <p style={styles.subtitle}>
          Discover skilled candidates and manage your opportunities.
        </p>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <span style={styles.statIcon}>👥</span>
          <div>
            <p style={styles.statLabel}>Candidates</p>
            <h2>{students.length}</h2>
          </div>
        </div>

        <div style={styles.statCard}>
          <span style={styles.statIcon}>💼</span>
          <div>
            <p style={styles.statLabel}>Job Listings</p>
            <h2>{jobs.length}</h2>
          </div>
        </div>

        <div style={styles.statCard}>
          <span style={styles.statIcon}>🎯</span>
          <div>
            <p style={styles.statLabel}>Skill Matching</p>
            <h2>Active</h2>
          </div>
        </div>
        <div style={styles.statCard}>
  <span style={styles.statIcon}>⭐</span>

  <div>
    <p style={styles.statLabel}>Shortlisted</p>
    <h2>{shortlisted.length}</h2>
  </div>
</div>
      </div>

      <div style={styles.card}>
        <p style={styles.smallLabel}>QUICK ACCESS</p>

        <h2 style={styles.cardTitle}>
          Find the right talent
        </h2>

        <p style={styles.subtitle}>
          Review student profiles and explore the skills
          they have developed.
        </p>

        <button
          style={styles.primaryButton}
          onClick={() => setActiveSection("candidates")}
        >
          View Candidates →
        </button>
      </div>
    </div>
  );

  const renderCandidates = () => (
    <div>
      <div style={styles.heading}>
        <p style={styles.smallLabel}>TALENT POOL</p>

        <h1 style={styles.title}>
          Student Candidates 👥
        </h1>

        <p style={styles.subtitle}>
          Explore students based on their skills and interests.
        </p>
      </div>

      {loading ? (
        <div style={styles.card}>
          <h3>Loading candidates...</h3>
        </div>
      ) : students.length === 0 ? (
        <div style={styles.card}>
          <div style={styles.emptyIcon}>👥</div>

          <h2>No candidates yet</h2>

          <p style={styles.subtitle}>
            Student profiles will appear here after they
            complete their profile.
          </p>
        </div>
      ) : (
        <div style={styles.candidateGrid}>
          {students.map((student, index) => (
            <div
              style={styles.candidateCard}
              key={index}
            >
              <div style={styles.avatar}>
                {(
                  student.name ||
                  student.fullName ||
                  "S"
                )
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <h2>
                {student.name ||
                  student.fullName ||
                  "Student"}
              </h2>

              <p style={styles.department}>
                {student.department || "Department not specified"}
              </p>

              <div style={styles.infoBlock}>
                <strong>Technical Skills</strong>

                <div style={styles.tags}>
                  {(Array.isArray(student.skills)
                    ? student.skills
                    : []
                  ).map((skill) => (
                    <span style={styles.tag} key={skill}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div style={styles.infoBlock}>
                <strong>Career Interests</strong>

                <div style={styles.tags}>
                  {(Array.isArray(student.interests)
                    ? student.interests
                    : []
                  ).map((interest) => (
                    <span
                      style={styles.interestTag}
                      key={interest}
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              <div
  style={{
    display: "flex",
    gap: "10px",
    marginTop: "18px",
  }}
>
  <button
    style={{
      ...styles.secondaryButton,
      marginTop: 0,
    }}
    onClick={() =>
      alert(
        `Candidate: ${
          student.name ||
          student.fullName ||
          "Student"
        }\nDepartment: ${
          student.department || "Not specified"
        }`
      )
    }
  >
    View Candidate
  </button>

  <button
    style={{
      ...styles.secondaryButton,
      marginTop: 0,
      background: isShortlisted(student)
        ? "#1f1f1f"
        : "white",
      color: isShortlisted(student)
        ? "white"
        : "#1f1f1f",
    }}
    onClick={() => toggleShortlist(student)}
  >
    {isShortlisted(student)
      ? "⭐ Shortlisted"
      : "☆ Shortlist"}
  </button>
</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderJobs = () => (
    <div>
        <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
    gap: "15px",
    flexWrap: "wrap",
  }}
>
  <div>
    <p style={styles.smallLabel}>
      RECRUITER TOOLS
    </p>

    <h2 style={{ margin: "5px 0" }}>
      Manage your opportunities
    </h2>
  </div>

  <button
    style={styles.primaryButton}
    onClick={() => setShowJobForm(!showJobForm)}
  >
    {showJobForm ? "✕ Close" : "+ Post a Job"}
  </button>
</div>
{showJobForm && (
  <div style={styles.card}>
    <p style={styles.smallLabel}>
      CREATE OPPORTUNITY
    </p>

    <h2 style={styles.cardTitle}>
      Post a New Job 💼
    </h2>

    <input
      style={styles.jobInput}
      placeholder="Job title"
      value={newJob.title}
      onChange={(e) =>
        setNewJob({
          ...newJob,
          title: e.target.value,
        })
      }
    />

    <input
      style={styles.jobInput}
      placeholder="Company name"
      value={newJob.company}
      onChange={(e) =>
        setNewJob({
          ...newJob,
          company: e.target.value,
        })
      }
    />

    <input
      style={styles.jobInput}
      placeholder="Location"
      value={newJob.location}
      onChange={(e) =>
        setNewJob({
          ...newJob,
          location: e.target.value,
        })
      }
    />

    <input
      style={styles.jobInput}
      placeholder="Skills separated by commas"
      value={newJob.skills}
      onChange={(e) =>
        setNewJob({
          ...newJob,
          skills: e.target.value,
        })
      }
    />

    <button
      style={styles.primaryButton}
      onClick={async () => {
        if (
          !newJob.title ||
          !newJob.company ||
          !newJob.location ||
          !newJob.skills
        ) {
          alert("Please fill all the fields.");
          return;
        }
     const skillsList = newJob.skills
  .split(",")
  .map((skill) => skill.trim())
  .filter(Boolean);

const jobData = {
  title: newJob.title,
  company: newJob.company,
  location: newJob.location,
  skills: skillsList,
  icon: "💼",
};


try {
  const response = await fetch(
    "https://skillmatch-s7cj.onrender.com/jobs",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jobData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Failed to post job"
    );
  }

  const createdJob = data.job;

  setJobs((previousJobs) => [
    createdJob,
    ...previousJobs,
  ]);

  setNewJob({
    title: "",
    company: "",
    location: "",
    skills: "",
  });

  setShowJobForm(false);

  alert("Job posted successfully! 🎉");

} catch (error) {
  console.error("Error posting job:", error);

  alert(
    "Could not post the job. Please make sure the backend is running."
  );
}


        
      }}
    >
      Publish Job 🚀
    </button>
  </div>
)}
      <div style={styles.heading}>
        <p style={styles.smallLabel}>OPPORTUNITIES</p>

        <h1 style={styles.title}>
          Job Listings 💼
        </h1>

        <p style={styles.subtitle}>
          View the opportunities available on Skillmatch.
        </p>
      </div>

      <div style={styles.jobGrid}>
        {jobs.map((job) => (
          <div style={styles.jobCard} key={job.id}>
            <div style={styles.jobIcon}>
              {job.icon || "💼"}
            </div>

            <h2>{job.title}</h2>

            <p style={styles.company}>
              {job.company}
            </p>

            <p style={styles.location}>
              📍 {job.location}
            </p>

            <div style={styles.infoBlock}>
              <strong>Required Skills</strong>

              <div style={styles.tags}>
                {(Array.isArray(job.skills)
                  ? job.skills
                  : []
                ).map((skill) => (
                  <span style={styles.tag} key={skill}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    );

    const renderContent = () => {
      if (activeSection === "candidates") {
        return renderCandidates();
      }

      if (activeSection === "jobs") {
        return renderJobs();
      }

      return renderOverview();
    };

    return (
      <div style={styles.dashboard}>
        <aside style={styles.sidebar}>
          <div style={styles.logoArea}>
            <div style={styles.logoMark}>S</div>

            <div>
              <h2 style={styles.logoText}>
                Skillmatch
              </h2>

              <span style={styles.portalText}>
                Recruiter Portal
              </span>
            </div>
          </div>

          <nav style={styles.nav}>
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id)
                }}
                style={{
                  ...styles.navButton,
                  ...(activeSection === item.id
                    ? styles.navActive
                    : {}),
                }}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          <div style={styles.sidebarBottom}>
            <div style={styles.recruiterProfile}>
              <div style={styles.miniAvatar}>R</div>

              <div>
                <strong>Recruiter</strong>
                <span>Skillmatch</span>
              </div>
            </div>

            <button
              style={styles.logout}
              onClick={onLogout}
            >
              🚪 Logout
            </button>
          </div>
        </aside>

        <main style={styles.main}>
          <header style={styles.topbar}>
            <div>
              <span style={styles.topLabel}>
                RECRUITER DASHBOARD
              </span>

              <h3>
                {
                  menuItems.find(
                    (item) =>
                      item.id === activeSection
                  )?.label
                }
              </h3>
            </div>

            <div style={styles.topProfile}>
              <div style={styles.miniAvatar}>R</div>

              <div>
                <strong>Recruiter</strong>
                <span>Skillmatch</span>
              </div>
            </div>
          </header>

          <section style={styles.content}>
            {renderContent()}
          </section>
        </main>
      </div>
    );
  }

const styles = {

  dashboard: {
    minHeight: "100vh",
    display: "flex",
    background: "#f5f3ef",
    color: "#1f1f1f",
    fontFamily: "Arial, sans-serif",
  },
  jobInput: {
  width: "100%",
  padding: "13px 15px",
  marginTop: "12px",
  border: "1px solid #ddd",
  borderRadius: "9px",
  boxSizing: "border-box",
  fontSize: "14px",
  outline: "none",
},

  sidebar: {
    width: "260px",
    background: "#1f1f1f",
    color: "white",
    padding: "28px 20px",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
  },

  logoArea: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "45px",
  },

  logoMark: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    background: "#d9c8ad",
    color: "#1f1f1f",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "20px",
  },

  logoText: {
    margin: 0,
    fontSize: "20px",
  },

  portalText: {
    color: "#aaa",
    fontSize: "12px",
  },

  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  navButton: {
    border: "none",
    background: "transparent",
    color: "#bbb",
    padding: "14px",
    borderRadius: "10px",
    textAlign: "left",
    cursor: "pointer",
    fontSize: "15px",
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },

  navActive: {
    background: "#3a3733",
    color: "white",
  },

  sidebarBottom: {
    marginTop: "auto",
  },

  recruiterProfile: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "15px 5px",
  },

  recruiterProfileSpan: {
    color: "#999",
  },

  miniAvatar: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    background: "#d9c8ad",
    color: "#1f1f1f",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },

  logout: {
    width: "100%",
    padding: "12px",
    border: "1px solid #555",
    borderRadius: "10px",
    background: "transparent",
    color: "white",
    cursor: "pointer",
  },

  main: {
    flex: 1,
    minWidth: 0,
  },

  topbar: {
    height: "80px",
    background: "white",
    borderBottom: "1px solid #ddd",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 40px",
    boxSizing: "border-box",
  },

  topLabel: {
    fontSize: "10px",
    letterSpacing: "2px",
    color: "#888",
  },

  topProfile: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  content: {
    padding: "45px",
    maxWidth: "1200px",
    margin: "auto",
  },

  heading: {
  fontSize: "32px",
  fontWeight: "700",
  color: "#1f1f1f",
  margin: "0",
},
  smallLabel: {
    fontSize: "11px",
    letterSpacing: "2px",
    fontWeight: "bold",
    color: "#9a7d55",
  },

  title: {
    fontSize: "36px",
    margin: "8px 0",
  },

  subtitle: {
    color: "#777",
    lineHeight: "1.6",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "18px",
    marginBottom: "25px",
  },

  statCard: {
    background: "white",
    padding: "24px",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    border: "1px solid #e5e1da",
  },

  statIcon: {
    fontSize: "30px",
  },
statLabel: {
  fontSize: "14px",
  color: "#666",
  margin: "0 0 5px 0",
},
  statCardH2: {
    margin: 0,
  },

  card: {
  background: "#fffdf8",
  border: "1px solid #e8e2d8",
  borderRadius: "16px",
  padding: "22px",
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.05)",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
  cursor: "default",
},

  cardTitle: {
  fontSize: "20px",
  fontWeight: "700",
  color: "#1f1f1f",
  marginBottom: "8px",
},

primaryButton: {
  background: "#1f1f1f",
  color: "white",
  border: "none",
  borderRadius: "10px",
  padding: "12px 20px",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.2s ease",
},

secondaryButton: {
  background: "white",
  color: "#1f1f1f",
  border: "1px solid #d8d2c8",
  borderRadius: "10px",
  padding: "11px 17px",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.2s ease",
},

  candidateGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
  },

  candidateCard: {
    background: "white",
    padding: "25px",
    borderRadius: "18px",
    border: "1px solid #e5e1da",
  },

  avatar: {
    width: "55px",
    height: "55px",
    borderRadius: "50%",
    background: "#d9c8ad",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
    fontWeight: "bold",
  },

  department: {
    color: "#9a7d55",
    fontWeight: "bold",
  },

  infoBlock: {
    marginTop: "20px",
  },

  tags: {
    display: "flex",
    flexWrap: "wrap",
    gap: "7px",
    marginTop: "10px",
  },

  tag: {
    background: "#eeeae3",
    padding: "6px 10px",
    borderRadius: "20px",
    fontSize: "12px",
  },

  interestTag: {
    background: "#e5edf0",
    padding: "6px 10px",
    borderRadius: "20px",
    fontSize: "12px",
  },

  jobGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
  },

  jobCard: {
    background: "white",
    padding: "25px",
    borderRadius: "18px",
    border: "1px solid #e5e1da",
  },

  jobIcon: {
    fontSize: "32px",
    marginBottom: "12px",
  },

  company: {
    fontWeight: "bold",
    color: "#777",
  },

  location: {
    color: "#888",
  },

  emptyIcon: {
    fontSize: "45px",
    marginBottom: "15px",
  },
};

export default RecruiterDashboard;