import { useState, useEffect } from "react";
import "./StudentDashboard.css";

function StudentDashboard({ studentData = {}, onLogout }) {
  const [activeSection, setActiveSection] = useState("overview");
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [savedJobs, setSavedJobs] = useState([]);

  const studentName =
    studentData.name ||
    studentData.fullName ||
    studentData.username ||
    "Student";

  const department = studentData.department || "EEE";

  const skills = Array.isArray(studentData.skills)
    ? studentData.skills
    : String(studentData.skills || "")
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

  const interests = Array.isArray(studentData.interests)
    ? studentData.interests
    : String(studentData.interests || "")
        .split(",")
        .map((interest) => interest.trim())
        .filter(Boolean);

  // --------------------------------------------------
  // FETCH JOBS FROM FASTAPI
  // --------------------------------------------------
useEffect(() => {
  const loadDashboardData = async () => {
    try {
      // Load available jobs
      const jobsResponse = await fetch(
        "https://skillmatch-s7cj.onrender.com/jobs"
      );

      const jobsData = await jobsResponse.json();
      setJobs(jobsData);

      // Load saved jobs from PostgreSQL
      const savedResponse = await fetch(
        "https://skillmatch-s7cj.onrender.com/saved-jobs"
      );

      const savedData = await savedResponse.json();
      setSavedJobs(savedData);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoadingJobs(false);
    }
  };

  loadDashboardData();
}, []);
 


  // --------------------------------------------------
  // CAREER DATA
  // --------------------------------------------------

  const careerData = [
    {
      title: "Embedded Systems Engineer",
      icon: "⚙️",
      category: "Electronics & IoT",
      description:
        "Design and develop systems that combine hardware, software, sensors and microcontrollers.",
      requiredSkills: [
        "C Programming",
        "Embedded C",
        "Microcontrollers",
        "Digital Electronics",
        "Sensors",
      ],
      tools: ["Arduino IDE", "ESP32", "STM32", "Keil", "Proteus"],
      roadmap: [
        "Learn C programming",
        "Understand microcontrollers",
        "Practice sensor interfacing",
        "Learn UART, SPI and I2C",
        "Build IoT projects",
      ],
    },
    {
      title: "VLSI Design Engineer",
      icon: "🔬",
      category: "Semiconductor & Chip Design",
      description:
        "Work on digital circuits, RTL design, verification and semiconductor chip development.",
      requiredSkills: [
        "Digital Electronics",
        "Verilog",
        "VHDL",
        "Computer Architecture",
        "Logic Design",
      ],
      tools: ["Vivado", "ModelSim", "Cadence", "Xilinx", "Synopsys"],
      roadmap: [
        "Learn digital logic design",
        "Understand combinational and sequential circuits",
        "Learn Verilog or VHDL",
        "Practice RTL design",
        "Learn simulation and verification",
      ],
    },
    {
      title: "Frontend Developer",
      icon: "💻",
      category: "Software Development",
      description:
        "Create attractive, responsive and interactive websites and web applications.",
      requiredSkills: [
        "HTML",
        "CSS",
        "JavaScript",
        "React",
        "Responsive Design",
      ],
      tools: ["VS Code", "React", "Git", "Chrome DevTools"],
      roadmap: [
        "Learn HTML",
        "Learn CSS and responsive design",
        "Learn JavaScript",
        "Learn React",
        "Build portfolio projects",
      ],
    },
    {
      title: "Backend Developer",
      icon: "🛠️",
      category: "Software Development",
      description:
        "Develop APIs, server-side logic, authentication systems and database connections.",
      requiredSkills: [
        "Python",
        "FastAPI",
        "SQL",
        "REST APIs",
        "Database Basics",
      ],
      tools: ["Python", "FastAPI", "PostgreSQL", "Postman", "Git"],
      roadmap: [
        "Learn Python fundamentals",
        "Understand APIs",
        "Build FastAPI applications",
        "Learn SQL and databases",
        "Create a complete backend project",
      ],
    },
    {
      title: "Data Analyst",
      icon: "📊",
      category: "Data & Analytics",
      description:
        "Collect, clean, analyse and visualise data to identify useful patterns and insights.",
      requiredSkills: [
        "Python",
        "Excel",
        "SQL",
        "Statistics",
        "Data Visualisation",
      ],
      tools: ["Python", "Pandas", "Excel", "Power BI", "Jupyter Notebook"],
      roadmap: [
        "Learn Excel",
        "Learn Python basics",
        "Learn Pandas and NumPy",
        "Learn SQL",
        "Create data analysis projects",
      ],
    },
    {
      title: "AI/ML Engineer",
      icon: "🤖",
      category: "Artificial Intelligence",
      description:
        "Build intelligent systems using machine learning, data processing and predictive models.",
      requiredSkills: [
        "Python",
        "Mathematics",
        "Statistics",
        "Machine Learning",
        "Data Handling",
      ],
      tools: ["Python", "NumPy", "Pandas", "Scikit-learn", "Jupyter"],
      roadmap: [
        "Learn Python",
        "Understand mathematics and statistics",
        "Learn data preprocessing",
        "Study machine learning algorithms",
        "Build ML projects",
      ],
    },
  ];

  // --------------------------------------------------
  // SIDEBAR MENU
  // --------------------------------------------------

  const menuItems = [
    { id: "overview", label: "Overview", icon: "🏠" },
    { id: "profile", label: "My Profile", icon: "👤" },
    { id: "careers", label: "Career Interests", icon: "🎯" },
    { id: "jobs", label: "Job Recommendations", icon: "💼" },
    { id: "learning", label: "Learning Roadmap", icon: "📚" },
    { id: "saved", label: "Saved Jobs", icon: "⭐" },
  ];

  // --------------------------------------------------
  // CAREER FUNCTIONS
  // --------------------------------------------------

  const openCareer = (career) => {
    setSelectedCareer(career);
    setActiveSection("careers");
  };

  // --------------------------------------------------
  // SAVE / REMOVE JOB
  // --------------------------------------------------
const toggleSaveJob = async (job) => {
  const jobId = job.id || job.title;

  const alreadySaved = savedJobs.some(
    (savedJob) =>
      (savedJob.id || savedJob.title) === jobId
  );

  try {
    if (alreadySaved) {
      // Remove from PostgreSQL
      await fetch(
        `https://skillmatch-s7cj.onrender.com/saved-jobs/${job.id}`,
        {
          method: "DELETE",
        }
      );

      setSavedJobs((previousJobs) =>
        previousJobs.filter(
          (savedJob) =>
            (savedJob.id || savedJob.title) !== jobId
        )
      );
    } else {
      // Save to PostgreSQL
      const response = await fetch(
        "https://skillmatch-s7cj.onrender.com/saved-jobs",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(job),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSavedJobs((previousJobs) => [
          ...previousJobs,
          data.job,
        ]);
      }
    }
  } catch (error) {
    console.error("Error updating saved job:", error);
  }
};

  // --------------------------------------------------
  // SKILL MATCHING SYSTEM
  // --------------------------------------------------

  const getMatchingSkills = (jobSkills = []) => {
    const studentSkills = skills.map((skill) =>
      String(skill).toLowerCase().trim()
    );

    return jobSkills.filter((jobSkill) => {
      const jobSkillText = String(jobSkill).toLowerCase().trim();

      return studentSkills.some((studentSkill) => {
        return (
          studentSkill === jobSkillText ||
          studentSkill.includes(jobSkillText) ||
          jobSkillText.includes(studentSkill)
        );
      });
    });
  };

  const calculateMatch = (jobSkills = []) => {
    if (!skills.length || !jobSkills.length) {
      return 0;
    }

    const matchedSkills = getMatchingSkills(jobSkills);

    return Math.round((matchedSkills.length / jobSkills.length) * 100);
  };

  const getMatchLabel = (percentage) => {
    if (percentage >= 75) {
      return "Strong Match";
    }

    if (percentage >= 40) {
      return "Good Match";
    }

    if (percentage > 0) {
      return "Skill Gap";
    }

    return "Explore";
  };

  // --------------------------------------------------
  // OVERVIEW
  // --------------------------------------------------

  const renderOverview = () => (
    <div className="dashboard-content">
      <div className="welcome-card">
        <div>
          <p className="small-label">WELCOME BACK 👋</p>

          <h1>Hello, {studentName}!</h1>

          <p>
            Explore career opportunities and build the skills needed for your
            dream job.
          </p>
        </div>

        <div className="welcome-illustration">🎓</div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-icon">🎯</span>

          <div>
            <h3>{interests.length}</h3>
            <p>Career Interests</p>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">💡</span>

          <div>
            <h3>{skills.length}</h3>
            <p>Skills Added</p>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">🚀</span>

          <div>
            <h3>{careerData.length}</h3>
            <p>Career Paths</p>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">⭐</span>

          <div>
            <h3>{savedJobs.length}</h3>
            <p>Saved Jobs</p>
          </div>
        </div>
      </div>

      <div className="section-heading">
        <div>
          <p className="small-label">START EXPLORING</p>

          <h2>Find Your Career Direction</h2>
        </div>
      </div>

      <div className="quick-actions">
        <button
          className="action-card"
          onClick={() => setActiveSection("careers")}
        >
          <span>🎯</span>

          <h3>Explore Careers</h3>

          <p>Discover career paths based on your interests.</p>

          <strong>Explore →</strong>
        </button>

        <button
          className="action-card"
          onClick={() => setActiveSection("jobs")}
        >
          <span>💼</span>

          <h3>Job Recommendations</h3>

          <p>Understand the skills required for different job roles.</p>

          <strong>View Jobs →</strong>
        </button>

        <button
          className="action-card"
          onClick={() => setActiveSection("learning")}
        >
          <span>📚</span>

          <h3>Learning Roadmap</h3>

          <p>Follow a step-by-step path to improve your skills.</p>

          <strong>Start Learning →</strong>
        </button>
      </div>

      <div className="profile-summary">
        <div className="section-heading">
          <div>
            <p className="small-label">YOUR DETAILS</p>

            <h2>Profile Summary</h2>
          </div>

          <button
            className="text-button"
            onClick={() => setActiveSection("profile")}
          >
            Edit Profile →
          </button>
        </div>

        <div className="profile-details-grid">
          <div>
            <span>Department</span>

            <strong>{department}</strong>
          </div>

          <div>
            <span>Skills</span>

            <strong>
              {skills.length ? skills.join(", ") : "Not added yet"}
            </strong>
          </div>

          <div>
            <span>Interests</span>

            <strong>
              {interests.length ? interests.join(", ") : "Not added yet"}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );

  // --------------------------------------------------
  // PROFILE
  // --------------------------------------------------

  const renderProfile = () => (
    <div className="dashboard-content">
      <div className="page-heading">
        <p className="small-label">YOUR INFORMATION</p>

        <h1>My Profile</h1>

        <p>Review the information you entered during registration.</p>
      </div>

      <div className="profile-card-large">
        <div className="profile-avatar">
          {studentName.charAt(0).toUpperCase()}
        </div>

        <h2>{studentName}</h2>

        <p>{department} Student</p>

        <div className="profile-info-list">
          <div>
            <span>Full Name</span>

            <strong>{studentName}</strong>
          </div>

          <div>
            <span>Department</span>

            <strong>{department}</strong>
          </div>

          <div>
            <span>Skills</span>

            <strong>
              {skills.length ? skills.join(", ") : "No skills added"}
            </strong>
          </div>

          <div>
            <span>Interests</span>

            <strong>
              {interests.length ? interests.join(", ") : "No interests added"}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );

  // --------------------------------------------------
  // CAREERS
  // --------------------------------------------------

  const renderCareers = () => (
    <div className="dashboard-content">
      <div className="page-heading">
        <p className="small-label">DISCOVER YOUR FUTURE</p>

        <h1>Career Interests</h1>

        <p>
          Explore different career paths and understand their requirements.
        </p>
      </div>

      <div className="career-grid">
        {careerData.map((career) => (
          <button
            className={`career-card ${
              selectedCareer?.title === career.title ? "selected" : ""
            }`}
            key={career.title}
            onClick={() => setSelectedCareer(career)}
          >
            <span className="career-icon">{career.icon}</span>

            <span className="career-category">{career.category}</span>

            <h3>{career.title}</h3>

            <p>{career.description}</p>

            <strong>View Details →</strong>
          </button>
        ))}
      </div>

      {selectedCareer && (
        <div className="career-details-card">
          <button
            className="close-details"
            onClick={() => setSelectedCareer(null)}
          >
            ✕
          </button>

          <span className="career-icon">{selectedCareer.icon}</span>

          <p className="small-label">{selectedCareer.category}</p>

          <h2>{selectedCareer.title}</h2>

          <p>{selectedCareer.description}</p>

          <div className="details-columns">
            <div>
              <h3>Required Skills</h3>

              <ul>
                {selectedCareer.requiredSkills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3>Tools & Technologies</h3>

              <ul>
                {selectedCareer.tools.map((tool) => (
                  <li key={tool}>{tool}</li>
                ))}
              </ul>
            </div>
          </div>

          <h3>Learning Roadmap</h3>

          <ol className="roadmap-list">
            {selectedCareer.roadmap.map((step, index) => (
              <li key={step}>
                <span>{index + 1}</span>

                {step}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );

  // --------------------------------------------------
  // JOB RECOMMENDATIONS
  // --------------------------------------------------

  const renderJobs = () => {
    const jobRecommendations =
      jobs.length > 0
        ? jobs
        : [
            {
              id: 1,
              title: "Embedded Software Intern",
              company: "IoT / Electronics Company",
              location: "Chennai / Remote",
              skills: ["C", "Embedded C", "ESP32", "Sensors"],
              icon: "⚙️",
            },
            {
              id: 2,
              title: "Frontend Developer Intern",
              company: "Software Product Company",
              location: "Remote / Chennai",
              skills: ["HTML", "CSS", "JavaScript", "React"],
              icon: "💻",
            },
            {
              id: 3,
              title: "VLSI Design Intern",
              company: "Semiconductor Company",
              location: "Bengaluru / Chennai",
              skills: ["Digital Electronics", "Verilog", "RTL Design"],
              icon: "🔬",
            },
            {
              id: 4,
              title: "Python Backend Intern",
              company: "Technology Company",
              location: "Remote / Chennai",
              skills: ["Python", "FastAPI", "SQL"],
              icon: "🐍",
            },
          ];

    // Calculate matching information
    const jobsWithMatch = jobRecommendations.map((job) => {
      const jobSkills = Array.isArray(job.skills) ? job.skills : [];

      const matchPercentage = calculateMatch(jobSkills);

      const matchingSkills = getMatchingSkills(jobSkills);
      const missingSkills = jobSkills.filter(
  (jobSkill) => !matchingSkills.includes(jobSkill)
);

      return {
        ...job,
        matchPercentage,
        matchingSkills,
        matchLabel: getMatchLabel(matchPercentage),
      };
    });

    // Sort highest match first
    const sortedJobs = [...jobsWithMatch].sort(
      (a, b) => b.matchPercentage - a.matchPercentage
    );

    return (
      <div className="dashboard-content">
        <div className="page-heading">
          <p className="small-label">YOUR OPPORTUNITIES</p>

          <h1>Job Recommendations</h1>

          <p>
            Explore job roles and see how your current skills match each
            opportunity.
          </p>
        </div>

        {loadingJobs ? (
          <div className="empty-state">
            <h3>Loading jobs...</h3>

            <p>Please wait while we fetch job recommendations.</p>
          </div>
        ) : (
          <>
            <div className="matching-summary">
              <div>
                <span className="small-label">SKILLMATCH ANALYSIS</span>

                <h2>Jobs matched to your current skills 🎯</h2>

                <p>
                  Your recommendations are arranged using the skills in your
                  student profile.
                </p>
              </div>

              <div className="skills-summary">
                <span>Your skills</span>

                <strong>{skills.length}</strong>
              </div>
            </div>

            <div className="job-list">
              {sortedJobs.map((job, index) => {
                const jobSkills = Array.isArray(job.skills) ? job.skills : [];

                const matchPercentage = job.matchPercentage;

                const matchingSkills = job.matchingSkills;
                const missingSkills = jobSkills.filter(
  (skill) => !matchingSkills.includes(skill)
);

                const matchLabel = job.matchLabel;
       

                const isSaved = savedJobs.some(
                  (savedJob) =>
                    (savedJob.id || savedJob.title) ===
                    (job.id || job.title)
                );

                return (
                  <div
                    className="job-card"
                    key={job.id || job.title || index}
                  >
                    <div className="job-icon">
                      {job.icon || "💼"}
                    </div>

                    <div className="job-information">
                      <div className="job-title-row">
                        <div>
                          <h3>{job.title || "Job Opportunity"}</h3>

                          <p>
                            {job.company ||
                              job.companyType ||
                              "Company"}
                          </p>
                        </div>

                        {index === 0 && matchPercentage > 0 && (
                          <span className="recommended-badge">
                            ✨ Recommended
                          </span>
                        )}
                      </div>

                      <span>
                        📍 {job.location || "Location not specified"}
                      </span>

                      <div className="job-skills">
                        {jobSkills.map((skill) => (
                          <span className="skill-tag" key={skill}>
                            {skill}
                          </span>
                        ))}
                      </div>

                      <div className="match-percentage">
                        <strong>
                          {matchPercentage}% Match · {matchLabel}
                        </strong>

                        <div className="match-bar">
                          <div
                            className="match-fill"
                            style={{
                              width: `${matchPercentage}%`,
                            }}
                          ></div>
                        </div>

                        {matchingSkills.length > 0 && (
                          <div className="matched-skills">
                            <small>✓ Matched skills:</small>

                            <div>
                              {matchingSkills.map((skill) => (
                                <span
                                  key={skill}
                                  className="matched-skill-tag"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {matchingSkills.length === 0 && (
                          <small>
                            No direct skill matches yet. Check the roadmap to
                            build the required skills.
                          </small>
                        )}
                      </div>
                    </div>
                   <div className="skill-insights">
  {matchingSkills.length > 0 && (
    <div className="skill-match-info">
      <p>
        <strong>✓ Matching Skills:</strong>{" "}
        {matchingSkills.join(", ")}
      </p>
    </div>
  )}

  {missingSkills.length > 0 && (
    <div className="skill-gap-info">
      <p>
        <strong>⚠ Skills to Improve:</strong>{" "}
        {missingSkills.join(", ")}
      </p>
    </div>
  )}
</div>

                    <div className="job-actions">
                      <button
                        className="small-button"
                        onClick={() => {
                          const matchingCareer = careerData.find((career) =>
                            String(job.title || "")
                              .toLowerCase()
                              .includes(
                                career.title
                                  .split(" ")[0]
                                  .toLowerCase()
                              )
                          );

                          if (matchingCareer) {
                            openCareer(matchingCareer);
                          } else {
                            setActiveSection("learning");
                          }
                        }}
                      >
                        View Roadmap
                      </button>

                      <button
                        className="save-button"
                        onClick={() => toggleSaveJob(job)}
                      >
                        {isSaved ? "★ Saved" : "☆ Save Job"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    );
  };

  // --------------------------------------------------
  // LEARNING ROADMAP
  // --------------------------------------------------

  const renderLearning = () => (
    <div className="dashboard-content">
      <div className="page-heading">
        <p className="small-label">BUILD YOUR SKILLS</p>

        <h1>Learning Roadmap</h1>

        <p>
          Select a career to view the suggested learning steps.
        </p>
      </div>

      <div className="learning-grid">
        {careerData.map((career) => (
          <div className="learning-card" key={career.title}>
            <span className="career-icon">{career.icon}</span>

            <h3>{career.title}</h3>

            <ol>
              {career.roadmap.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>

            <button
              className="small-button"
              onClick={() => openCareer(career)}
            >
              Explore Career
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  // --------------------------------------------------
  // SAVED JOBS
  // --------------------------------------------------

 const renderSavedJobs = () => (
  <div className="dashboard-content">
    <div className="page-heading">
      <p className="small-label">YOUR COLLECTION</p>

      <h1>Saved Jobs</h1>

      <p>Jobs that you saved for future reference.</p>
    </div>

    {savedJobs.length === 0 ? (
      <div className="empty-state">
        <h3>No saved jobs yet ⭐</h3>

        <p>
          Go to Job Recommendations and save a job you like.
        </p>

        <button
          className="small-button"
          onClick={() => setActiveSection("jobs")}
        >
          Explore Jobs
        </button>
      </div>
    ) : (
      <div className="job-list">
        {savedJobs.map((job, index) => (
          <div
            className="job-card"
            key={job.id || job.title || index}
          >
            <div className="job-icon">
              {job.icon || "💼"}
            </div>

            <div className="job-information">
              <h3>{job.title}</h3>

              <p>
                {job.company ||
                  job.companyType ||
                  "Company"}
              </p>

              <span>
                📍 {job.location || "Location not specified"}
              </span>

              <div className="job-skills">
                {(Array.isArray(job.skills)
                  ? job.skills
                  : []
                ).map((skill) => (
                  <span
                    className="skill-tag"
                    key={skill}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <button
              className="save-button"
              onClick={() => toggleSaveJob(job)}
            >
              ★ Remove
            </button>
          </div>
        ))}
      </div>
    )}
  </div>
);

  // --------------------------------------------------
  // ACTIVE SECTION
  // --------------------------------------------------

  const renderActiveSection = () => {
    if (activeSection === "profile") {
      return renderProfile();
    }

    if (activeSection === "careers") {
      return renderCareers();
    }

    if (activeSection === "jobs") {
      return renderJobs();
    }

    if (activeSection === "learning") {
      return renderLearning();
    }

    if (activeSection === "saved") {
      return renderSavedJobs();
    }

    return renderOverview();
  };

  // --------------------------------------------------
  // MAIN DASHBOARD
  // --------------------------------------------------

  return (
    <div className="student-dashboard">
      <aside className="dashboard-sidebar">
        <div className="brand-area">
          <div className="brand-logo">S</div>

          <div>
            <h2>Skillmatch</h2>

            <p>Student Portal</p>
          </div>
        </div>

        <nav className="dashboard-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${
                activeSection === item.id ? "active" : ""
              }`}
              onClick={() => {
                setActiveSection(item.id);
                setSelectedCareer(null);
              }}
            >
              <span>{item.icon}</span>

              {item.label}
            </button>
          ))}
        </nav>

        <button className="logout-button" onClick={onLogout}>
          🚪 Logout
        </button>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div>
            <p className="small-label">STUDENT DASHBOARD</p>

            <h2>
              {
                menuItems.find(
                  (item) => item.id === activeSection
                )?.label
              }
            </h2>
          </div>

          <div className="topbar-user">
            <div className="mini-avatar">
              {studentName.charAt(0).toUpperCase()}
            </div>

            <span>{studentName}</span>
          </div>
        </header>

        {renderActiveSection()}
      </main>
    </div>
  );
}

export default StudentDashboard;