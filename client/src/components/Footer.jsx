import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <div className="container mx-auto py-8">
        <div className="flex flex-col items-center">
          <h2 className="text-white text-lg font-bold mb-4">Contact Us</h2>
          <p className="text-white mb-2">INTI International College Penang, Bayan Lepas, Malaysia</p>
          <p className="text-white mb-2">Phone: (+60) 11-10542466</p>
          <p className="text-white mb-2">Email: zc@example.com</p>
        </div>
        <div className="flex justify-center mt-8">
          <ul className="flex space-x-4">
            <li>
              <a href="#" className="text-white hover:text-gray-300">About Us</a>
            </li>
            <li>
              <a href="#" className="text-white hover:text-gray-300">Privacy Policy</a>
            </li>
            <li>
              <a href="#" className="text-white hover:text-gray-300">Terms of Service</a>
            </li>
          </ul>
        </div>
        <div className="text-center mt-8 text-white">
          &copy; {new Date().getFullYear()} PetVeller. All rights reserved.
        </div>
      </div>
      <style>{`
        .footer {
          background: linear-gradient(to bottom right, #A6BCE8, #FFC0C0);
          animation: rainbow-effect 10s linear infinite;
          padding: 20px;
        }

        .footer h2 {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 10px;
        }

        .footer p {
          font-size: 14px;
          margin-bottom: 5px;
        }

        .footer ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer ul li {
          display: inline-block;
          margin-right: 10px;
        }

        .footer a {
          color: white;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .footer a:hover {
          color: #ccc;
        }

        .footer .text-white {
          color: white;
        }

        @keyframes rainbow-effect {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </footer>
  );
}

export default Footer;
