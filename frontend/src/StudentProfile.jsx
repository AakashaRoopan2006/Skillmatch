import { useState } from "react";
import "./StudentProfile.css";

function StudentProfile({ onBack, onProfileSaved }) {
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [skills, setSkills] = useState("");
  const [interests, setInterests] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name.trim() || !department.trim() || !skills.trim() || !interests.trim()) {
      alert("Please fill in all the fields.");
      return;
    }

    // Convert comma-separated text into arrays
    const skillsList = skills
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill !== "");

    const interestsList = interests
      .split(",")
      .map((interest) => interest.trim())
      .filter((interest) => interest !== "");

    const studentData = {
      name: name.trim(),
      department: department.trim(),
      skills: skillsList,
      interests: interestsList,
    };

    setIsSaving(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentData),
      });

      // Read backend error if the response is not successful
      if (!response.ok) {
        const errorDetails = await response.text();

        console.error("Backend error:", errorDetails);

        throw new Error(
          `Backend error: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();

      console.log("Backend response:", result);

      alert("Profile saved successfully! 🎉");

      // Send the saved profile to the parent component
      onProfileSaved(studentData);
    } catch (error) {
      console.error("Error while saving profile:", error);

      alert(
        "Profile could not be saved. Please check the browser console for details."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <button className="back-button" type="button" onClick={onBack}>
          ← Back
        </button>

        <div className="profile-heading">
          <p className="small-heading">WELCOME TO SKILLMATCH</p>

          <h1>Build Your Student Profile ✨</h1>

          <p>
            Tell us about yourself so we can find suitable career opportunities
            for you.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>

            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="department">Department</label>

            <input
              id="department"
              type="text"
              placeholder="Example: EEE, CSE, AIDS, ECE"
              value={department}
              onChange={(event) => setDepartment(event.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="skills">Technical Skills</label>

            <textarea
              id="skills"
              placeholder="Example: Python, HTML, CSS, React, IoT"
              value={skills}
              onChange={(event) => setSkills(event.target.value)}
              rows="4"
            />

            <small>Enter multiple skills separated by commas.</small>
          </div>

          <div className="form-group">
            <label htmlFor="interests">Career Interests</label>

            <textarea
              id="interests"
              placeholder="Example: Web development, embedded systems, data analysis"
              value={interests}
              onChange={(event) => setInterests(event.target.value)}
              rows="4"
            />

            <small>Enter multiple interests separated by commas.</small>
          </div>

          <button
            type="submit"
            className="save-profile-button"
            disabled={isSaving}
          >
            {isSaving ? "Saving Profile..." : "Save Profile 🚀"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default StudentProfile;