import heroImage from "../assets/hero.png";
import "./Home.css";
import Navbar from "./Navbar";

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="home-container">
        <div className="hero" style={{ backgroundImage: `url(${heroImage})` }}>
          <div className="overlay">
            <h1>Welcome to Student Attendance System</h1>
            <p>Your bridge between students, parents, and schools.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
