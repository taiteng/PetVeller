import { useEffect, useState } from "react";
import axios from "axios";
import AdminHeader from "../components/AdminHeader";
import { jwtDecode } from "jwt-decode";
import "../components/css/Admin.css";

function Admin() {
  const [logMessage, setLogMessage] = useState("");
  const [userCount, setUserCount] = useState(0);
  const [catFactsCount, setCatFactsCount] = useState(0);
  const [contactCount, setContactCount] = useState(0);

  const token = sessionStorage.token;

  let userRole = "";
  let userName = "";
  let userEmail = "";

  if (token) {
    const decodedToken = jwtDecode(token);
    const { user: decodedUser } = decodedToken;

    if (decodedUser) {
      userRole = decodedUser.role ?? "";
      userName = decodedUser.name ?? "";
      userEmail = decodedUser.email ?? "";
    }
  }
  const currentTime = new Date().toLocaleString();
  //Test
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          "http://localhost:3001/get-user-count"
        );
        setUserCount(response.data.count);
      } catch (error) {
        console.error("Error fetching user count:", error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          "http://localhost:3001/get-catFacts-count"
        );
        setCatFactsCount(response.data.count);
      } catch (error) {
        console.error("Error fetching cat facts count:", error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          "http://localhost:3001/get-contact-count"
        );
        setContactCount(response.data.count);
      } catch (error) {
        console.error("Error fetching feedback count:", error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function sendLogMessage() {
      if (userRole !== "admin") {
        let message = "";
        if (userRole === "") {
          message = `An anonymous is trying to access the admin page at ${currentTime}. Access denied.`;
        } else {
          message = `${userName} (${userEmail}) is trying to access the admin page at ${currentTime}. Access denied.`;
        }

        setLogMessage(message);

        try {
          const response = await axios.post("http://localhost:3001/save-log", {
            logContent: message,
          });
          console.log("Log message saved to the database:", response.data);
        } catch (error) {
          console.error("Error saving log message to the database:", error);
        }
      }
    }

    sendLogMessage();
  }, []);

  if (userRole !== "admin") {
    return (
      <div
        style={{
          background: "#FFCCCC",
          padding: "20px",
          margin: "20px",
          borderRadius: "5px",
          textAlign: "center",
          color: "#FF0000",
          fontWeight: "bold",
        }}
      >
        Access denied
        <br />
        <a href="/" style={{ color: "blue", textDecoration: "underline" }}>
          Back to Home Page
        </a>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "linear-gradient(to bottom right, #A6BCE8, #FFC0C0)",
      }}
    >
      <AdminHeader />
      <main className="main-container">
        <div className="main-title">
          <h3>DASHBOARD</h3>
        </div>

        <br></br>

        <div className="main-cards">
          <div className="card" style={{ background: "#2962ff" }}>
            <div className="card-inner">
              <h3>CUSTOMERS</h3>
            </div>
            <h1>{userCount}</h1>
          </div>
          <div className="card" style={{ background: "#ff6d00" }}>
            <div className="card-inner">
              <h3>Cat Facts</h3>
            </div>
            <h1>{catFactsCount}</h1>
          </div>
          <div className="card" style={{ background: "#2e7d32" }}>
            <div className="card-inner">
              <h3>Feedback</h3>
            </div>
            <h1>{contactCount}</h1>
          </div>
        </div>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </main>
    </div>
  );
}

export default Admin;
