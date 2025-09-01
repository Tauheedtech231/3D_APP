"use client";
import React from "react";
import { 
  FaGraduationCap, 
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaArrowRight
} from "react-icons/fa";

const Footer = () => {
  const courseLinks = [
    "BOSH – Basic Occupational Safety & Health",
    "IOSH – Institution of Occupational Safety & Health",
    "OSHA – Occupational Safety & Health Administration",
    "PTW – Permit to Work",
    "Fire Safety – FA Training",
    "First Aid – FS Training",
    "Hole Watcher – HW Training",
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 dark:bg-gray-950 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Brand Info */}
          <div>
            <div className="flex items-center mb-6">
              <FaGraduationCap className="text-3xl mr-3 text-yellow-400" />
              <h3 className="text-2xl font-bold text-white">EduMentor</h3>
            </div>
            <p className="text-sm mb-6 leading-relaxed">
              Empowering learners worldwide with high-quality education and innovative learning solutions.
            </p>
          </div>

          {/* Courses / Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6 relative pb-2 after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-12 after:bg-yellow-400">
              Courses
            </h4>
            <ul className="space-y-3">
              {courseLinks.map((name, idx) => (
                <li key={idx}>
                  <a
                    href="/course_for_sell"
                    className="flex items-center text-sm transition-all hover:text-yellow-400 group"
                  >
                    <FaArrowRight className="mr-2 text-yellow-400 text-xs transition-transform group-hover:translate-x-1" />
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6 relative pb-2 after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-12 after:bg-yellow-400">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <FaMapMarkerAlt className="text-yellow-400 mt-1 mr-4 flex-shrink-0" />
                <span className="text-sm">
                  123 Education Street, Learning City<br />
                  ED 12345, United States
                </span>
              </li>
              <li className="flex items-center">
                <FaPhone className="text-yellow-400 mr-4 flex-shrink-0" />
                <span className="text-sm">+92 309 6993535</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="text-yellow-400 mr-4 flex-shrink-0" />
                <span className="text-sm">mansol.largify@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Text */}
        <div className="pt-8 mt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-center md:text-left mb-4 md:mb-0">
            © {new Date().getFullYear()} EduMentor LMS. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 text-sm">
            <a href="#" className="transition-colors hover:text-yellow-400">
              Terms of Service
            </a>
            <a href="#" className="transition-colors hover:text-yellow-400">
              Privacy Policy
            </a>
            <a href="#" className="transition-colors hover:text-yellow-400">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
