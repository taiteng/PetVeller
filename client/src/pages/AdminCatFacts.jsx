import { useEffect, useState } from 'react';
import AdminHeader from '../components/AdminHeader';
import NumberPicker from 'react-widgets/NumberPicker';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

function AdminCatFacts() {
  const [value, setValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState('');
  const [facts, setFacts] = useState([]);
  const [catFacts, setCatFacts] = useState([]);
  
  const [logMessage, setLogMessage] = useState('');
  const token= sessionStorage.token;
  const decodedToken = jwtDecode(token);
  const { user } = decodedToken;
  const userRole = user.role;
  const userName = user.name;
    const userEmail = user.email;
    const currentTime = new Date().toLocaleString();
  
    useEffect(() => {
      async function sendLogMessage() {
        if (userRole !== 'admin') {
          let message = '';
          if (userRole === '') {
            message = `An anonymous is trying to access the adminCatFact page at ${currentTime}. Access denied.`;
          } else {
            message = `${userName} (${userEmail}) is trying to access the adminCatFact page at ${currentTime}. Access denied.`;
          }
  
          setLogMessage(message);
  
          try {
            const response = await axios.post('http://localhost:3001/save-log', { logContent: message });
            console.log('Log message saved to the database:', response.data);
          } catch (error) {
            console.error('Error saving log message to the database:', error);
          }
        }
      }
  
      sendLogMessage();
    }, []);

  useEffect(() => {
    fetchCatFacts();
  }, []);

  const fetchCatFacts = () => {
    axios
      .get('http://localhost:3001/catFacts')
      .then((response) => {
        setCatFacts(response.data);
      })
      .catch((error) => {
        console.log('Error retrieving cat facts:', error);
      });
  };

  const handleDeleteFact = (id) => {
    axios
      .post(`http://localhost:3001/deleteCatFacts/${id}`)
      .then((response) => {
        console.log('Fact deleted:', response.data);
        fetchCatFacts();
      })
      .catch((error) => {
        console.log('Error deleting cat fact:', error);
      });
  };
  

  const url = `https://catfact.ninja/fact`;

  const fetchInfo = async () => {
    setIsLoading(true);

    try {
      const fetchedFacts = [];

      for (let i = 0; i < value; i++) {
        const response = await fetch(url);
        const data = await response.json();
        fetchedFacts.push({ fact: data.fact, addedToDatabase: false });
      }

      setFacts(fetchedFacts);
    } catch (err) {
      setErr(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeFact = async (index) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      const newFact = data.fact;

      const updatedFacts = [...facts];
      updatedFacts[index].fact = newFact;

      setFacts(updatedFacts);
    } catch (err) {
      setErr(err.message);
    }
  };

  const handleSaveToDatabase = () => {
    const factsToSave = facts.filter((fact) => !fact.addedToDatabase);
    const factStrings = factsToSave.map((fact) => fact.fact);

    axios
      .post('http://localhost:3001/saveCatFactsToDatabase', { facts: factStrings })
      .then((response) => {
        const savedFactsIndices = [];
        response.data.forEach((result, index) => {
          if (result === 'Saved Fact') {
            savedFactsIndices.push(index);
          }
        });

        const updatedFacts = facts.map((fact, index) => {
          if (savedFactsIndices.includes(index)) {
            return {
              ...fact,
              addedToDatabase: true,
            };
          }
          return fact;
        });

        setFacts(updatedFacts);
      })
      .catch((error) => {
        console.error('Error saving cat facts:', error);
      });
  };


  if (userRole !== 'admin') {
   
    return(
      <div style={{ 
        background: '#FFCCCC',
        padding: '20px',
        margin: '20px',
        borderRadius: '5px',
        textAlign: 'center',
        color: '#FF0000',
        fontWeight: 'bold',
      }}>
      Access denied
      <br></br>
      <a href='/' style={{ color: 'blue', textDecoration: 'underline' }}>Back to Home Page</a>
    </div>
    )
  }

  return (
    <div style={{ background: 'linear-gradient(to bottom right, #A6BCE8, #FFC0C0)' }}>
      <AdminHeader />
      {err && <h2>{err}</h2>}

      <br />
      <br />
      <center>
        <h1 style={{ fontSize: 30 }}>
          <strong>Cat Facts Table</strong>
        </h1>
        <br />
        {catFacts.length > 0 ? (
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Fact</th>
                <th className="px-4 py-2">Delete</th>
              </tr>
            </thead>
            <tbody>
              {catFacts.map((fact) => (
                <tr key={fact._id}>
                  <td className="border px-4 py-2">{fact._id}</td>
                  <td className="border px-4 py-2">{fact.fact}</td>
                  <td className="border px-4 py-2">
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => handleDeleteFact(fact._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No cat facts found.</p>
        )}
        <h1 style={{ fontSize: 30 }}>
          <strong>Pick the number of facts that you want to generate</strong>
        </h1>
        <br />
        <br />
        <NumberPicker defaultValue={0} max={10} min={0} value={value} onChange={setValue} />
        <br />
        <button onClick={fetchInfo}>Generate</button>
        {isLoading && <h2>Loading...</h2>}
        {facts.length > 0 && (
          <div className="bg-blue-100 border border-blue-500 rounded p-4 my-4">
            <h2 className="text-2xl font-bold mb-4">Generated Cat Facts</h2>
            <table className="table-auto w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2">Fact</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {facts.map((fact, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{fact.fact}</td>
                    <td className="border px-4 py-2">
                      {!fact.addedToDatabase && (
                        <button
                          className="bg-green-500 text-white px-3 py-1 rounded"
                          onClick={() => handleChangeFact(index)}
                        >
                          Change Fact
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded mt-4"
              onClick={handleSaveToDatabase}
              disabled={!facts.some((fact) => !fact.addedToDatabase)}
            >
              Save to Database
            </button>
          </div>
        )}
        <br />
        <br />
      </center>
    </div>
  );
}

export default AdminCatFacts;
