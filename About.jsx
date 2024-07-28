import React from "react";
// import NavBarr from "./components/NavBarr";
import NavBarr from '../components/NavBarr'
import "../pages/CSS/About.css";

const About = () => {
  return (
    <div className="about-container">
      <NavBarr />
      <div className="header-section">
        <img
          src={require("../images/6.jpeg")}
          alt="Top Image"
          className="top-image"
        />
      </div>
      <div className="main-content">
        <div className="left-section">
          <h2>About Our Project: Chatbot for FICT</h2>
          <p>
            Welcome to the forefront of educational innovation within the
            Faculty of Information and Communication Technologies (FICT). Our
            project introduces a revolutionary Chatbot designed to redefine the
            way students interact with information, fostering a more informed
            and engaged academic community.
          </p>

          <h3>Our Vision</h3>
          <p>
            At the heart of our endeavor lies a vision to transform the student
            experience by providing an accessible, comprehensive, and intuitive
            information resource. We envision a digital assistant that
            seamlessly guides both current and prospective students through the
            labyrinth of academic queries, streamlining their educational
            journeys.
          </p>

          <h3>Empowering Student Information Access</h3>
          <p>
            Our Chatbot is more than just a digital assistant; it's an
            intelligent, all-encompassing resource hub. From admission processes
            to course details, faculty profiles to departmental insights, degree
            requirements to fee structures, university policies to schedules and
            scholarships—our Chatbot consolidates this wealth of information
            into an easily navigable interface.
          </p>

          <h3>Innovation Meets Accessibility</h3>
          <p>
            We are committed to blending innovation with accessibility. Through
            cutting-edge technology and user-centric design, our Chatbot
            empowers students with accurate and readily available information,
            fostering an environment where knowledge is just a conversation
            away.
          </p>

          <h3>Student-Centric Approach</h3>
          <p>
            Our project is rooted in the ethos of putting students at the
            forefront. We understand the challenges students face in seeking
            accurate and centralized information. Therefore, our Chatbot serves
            as a guiding beacon, ensuring that students are equipped with the
            information they need to thrive academically.
          </p>

          <h3>Join us on this Journey</h3>
          <p>
            We invite you to be part of this transformative journey within FICT.
            Our project doesn't just aim to provide information; it aims to
            enhance the way students engage with education. Together, let's pave
            the way for a more informed, connected, and empowered university
            community.
          </p>
        </div>
        <div className="right-section">
          <img
            src={require("../images/3.jpg")}
            alt="Right Image"
            className="right-image"
          />
        </div>
      </div>
    </div>
  );
};

export default About;
