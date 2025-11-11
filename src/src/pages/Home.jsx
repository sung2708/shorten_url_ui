import React from "react";
import Hero from "../components/Hero";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";

const Home = () => {
  const isDashboardPath = useLocation().pathname.includes("dashboard");

  return (
    <div>
      {!isDashboardPath && <Navbar />}
      <Hero />;
    </div>
  );
};

export default Home;
