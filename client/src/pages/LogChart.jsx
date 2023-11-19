import ReactApexChart from "react-apexcharts";

const LogChart = ({ logs }) => {
  // Filter logs containing the keyword "registered"
  const registerLogs = logs.filter((log) =>
    log.logContent.toLowerCase().includes("registered")
  );

  // Count the occurrences of registered logs for each date
  const logCounts = registerLogs.reduce((acc, log) => {
    const dateKey = new Date(log.createdAt).toLocaleDateString();
    acc[dateKey] = (acc[dateKey] || 0) + 1;
    return acc;
  }, {});

  // Create data for the chart
  const chartData = Object.entries(logCounts).map(([date, count]) => ({
    x: new Date(date).getTime(),
    y: count,
  }));

  // Configure chart options
  const options = {
    chart: {
      type: "line",
      height: 350,
    },
    xaxis: {
      type: "datetime",
      labels: {
        formatter: function (val) {
          // Format timestamp to display only the date
          return new Date(val).toLocaleDateString();
        },
      },
    },
    yaxis: {
      title: {
        text: "Number of Registered Logs",
      },
    },
  };

  // Define series for the chart
  const series = [
    {
      name: "Registered Logs",
      data: chartData,
    },
  ];

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="line"
      height={350}
    />
  );
};

export default LogChart;
