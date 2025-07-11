import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landingpage from "./pages/Landingpage.jsx";
import LOGIN from "./pages/LOGIN.jsx";
import FlightSelect from "./pages/FlightSelect.jsx";
import Addonservices from "./pages/Addonservices.jsx";
import Passengers from "./pages/Passengers.jsx";
import Promotionandpayment from "./pages/Promotionandpayment.jsx";
import Paymentconfirm from "./pages/Paymentconfirm.jsx";
import About from "./pages/About.jsx";
import Signup from "./pages/signup.jsx";
import Admin from "./pages/Admin.jsx";
import Explore from "./pages/Explore.jsx";
import ContactUs from "./pages/ContactUs.jsx";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/LOGIN" element={<LOGIN />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/FlightSelect" element={<FlightSelect />} />
        <Route path="/Addonservices" element={<Addonservices />} />
        <Route path="/Passengers" element={<Passengers />} />
        <Route path="/Promotionandpayment" element={<Promotionandpayment />} />
        <Route path="/Paymentconfirm" element={<Paymentconfirm />} />
        <Route path="/About" element={<About />} />
        <Route path="/Explore" element={<Explore />} />
        <Route path="/Contact" element={<ContactUs />} />
        <Route path="/Admin" element={<Admin/>} />
      </Routes>
    </Router>
  );
};

export default App;
