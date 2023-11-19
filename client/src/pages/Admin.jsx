import { useEffect, useState } from "react";
import axios from "axios";
import AdminHeader from "../components/AdminHeader";
import { jwtDecode } from "jwt-decode";
import "../components/css/Admin.css";
import ReactApexChart from "react-apexcharts"; // Import ReactApexChart
import LogChart from "./LogChart"; // Adjust the import path based on your project structure

function Admin() {
  const [logMessage, setLogMessage] = useState("");
  const [userCount, setUserCount] = useState(0);
  const [catFactsCount, setCatFactsCount] = useState(0);
  const [contactCount, setContactCount] = useState(0);
  const [userRoleData, setUserRoleData] = useState({
    labels: ["Admin", "Free User", "Premium User"],
    series: [
      {
        name: "User Roles",
        data: [0, 0, 0], // Initialize with zeros
      },
    ],
  });
  const [allLogs, setAllLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

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
    let isMounted = true;

    async function fetchData() {
      try {
        const response = await axios.get(
          "http://localhost:3001/get-user-roles"
        );

        if (isMounted) {
          const userRoles = response.data;

          // Count the number of users based on roles
          const adminCount = userRoles.filter(
            (user) => user.role === "admin"
          ).length;
          const freeUserCount = userRoles.filter(
            (user) => user.role === "freeUser"
          ).length;
          const premiumUserCount = userRoles.filter(
            (user) => user.role === "premiumUser"
          ).length;

          setUserRoleData({
            labels: ["Admin", "Free User", "Premium User"],
            series: [
              {
                name: "User Roles",
                data: [adminCount, freeUserCount, premiumUserCount],
              },
            ],
          });
        }
      } catch (error) {
        console.error("Error fetching user roles:", error);
      }
    }

    fetchData();

    // Cleanup function to set isMounted to false when component unmounts
    return () => {
      isMounted = false;
    };
  }, []);

  const [selectedDate, setSelectedDate] = useState("");
  const [filteredLogs, setFilteredLogs] = useState([]);

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("http://localhost:3001/log");

        if (response.data && Array.isArray(response.data)) {
          const allLogs = response.data;

          const logsForSelectedDate = selectedDate
            ? allLogs.filter(
                (log) =>
                  new Date(log.createdAt).toLocaleDateString() ===
                  new Date(selectedDate).toLocaleDateString()
              )
            : allLogs;

          // Filter logs based on the search query
          const filteredLogs = searchQuery
            ? logsForSelectedDate.filter((log) =>
                log.logContent.toLowerCase().includes(searchQuery.toLowerCase())
              )
            : logsForSelectedDate;

          if (filteredLogs.length > 0) {
            const latestLogs = filteredLogs.slice(0, 5);

            const logEntries = latestLogs.map((log) => {
              return {
                logContent: log.logContent,
                createdAt: log.createdAt,
              };
            });

            const logStrings = logEntries.map(
              (log) =>
                `<strong>${log.logContent}</strong> - ${new Date(
                  log.createdAt
                ).toLocaleString()}`
            );

            setLogMessage(logStrings.join("<br/>"));

            setAllLogs(filteredLogs);
            setFilteredLogs(filteredLogs);
          } else {
            setLogMessage(
              "No logs available for the selected date or search query."
            );
            setAllLogs([]);
            setFilteredLogs([]);
          }
        } else {
          setLogMessage("Logs not found in the response data.");
        }
      } catch (error) {
        console.error("Error fetching logs:", error);
        setLogMessage(
          "Error fetching logs. Please check the console for details."
        );
      }
    }

    fetchData();
  }, [selectedDate, searchQuery]); // Add searchQuery as a dependency

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
    <div className="admin-dashboard">
      <AdminHeader />
      <main className="main-container">
        <div className="dashboard-title"></div>
        <div className="dashboard-cards">
          <div className="dashboard-card" style={{ background: "#2962ff" }}>
            <div className="card-inner">
              <h3>Total Users</h3>
            </div>
            <h1>{userCount}</h1>
          </div>
          <div className="dashboard-card" style={{ background: "#ff6d00" }}>
            <div className="card-inner">
              <h3>Total Cat Facts</h3>
            </div>
            <h1>{catFactsCount}</h1>
          </div>
          <div className="dashboard-card" style={{ background: "#2e7d32" }}>
            <div className="card-inner">
              <h3>Feedback</h3>
            </div>
            <h1>{contactCount}</h1>
          </div>
        </div>
        <div className="user-details">
          <center>
            <br />
            <h1>User Details</h1>
          </center>
          <div className="bar-chart">
            <ReactApexChart
              options={{
                chart: {
                  type: "bar",
                  stacked: true,
                },
                xaxis: {
                  categories: userRoleData.labels,
                },
                yaxis: {
                  type: "linear",
                  stacked: true,
                },
                theme: {
                  mode: "dark", // Use 'dark' for a dark background
                  palette: "palette1", // Change the palette as needed
                },
                colors: ["#2962ff", "#2e7d32", "#ff6d00"],
                plotOptions: {
                  bar: {
                    horizontal: false,
                  },
                },
                dataLabels: {
                  enabled: false,
                },
                legend: {
                  position: "top",
                },
              }}
              series={userRoleData.series}
              type="bar"
              height={350}
            />
          </div>
        </div>
        <div className="user-details">
          <div className="log-chart">
            <center>
              <br />
              <h1>Registered Logs Chart</h1>
              <br />
            </center>
            <LogChart logs={filteredLogs} />
          </div>
        </div>

        <div className="log-container">
          <center>
            <h1>Logging and Analytics Information</h1>
          </center>
          <div className="log-filter">
            <label>Select Date: </label>
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
            />
            <br />
            <br />
            <label>Search: </label>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <div className="all-logs">
            {filteredLogs.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Log Number</th>
                    <th>Log Content</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{log.logContent}</td>
                      <td>{new Date(log.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="error-message">
                <p>No logs available for the selected date.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Admin;
