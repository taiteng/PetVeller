import Header from '../components/Header';
import React, { useState, useEffect } from 'react';
import BackToTop from '../components/BackToTop';
import Footer from '../components/Footer';
import Button from '@mui/material/Button';
import axios from 'axios';

function Dog() {
  const [data, setData] = useState([]);
  const [text, setText] = useState("")
  const [searched, setSearched] = useState(false)
  const [userEmail, setUserEmail] = useState("");
  const [data2, setData2] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  const fetchDogData = async () => {
    try {
      setDataLoading(true)
      const dogRes = await fetch("https://api.thedogapi.com/v1/breeds");
      const dogData = await dogRes.json();
      

      if (userEmail) {
        const favouriteRes = await axios.post(
          "http://localhost:3001/favouriteDogs",
          { userEmail: sessionStorage.uEmail }
        );
        const favouriteData = favouriteRes.data;
        console.log(favouriteData);
  
        const updatedData = await dogData.map((dog) => {
          const isFavourited = favouriteData.some(
            (favouriteDogData) => favouriteDogData.id === dog.id
          );
          return { ...dog, isFavourited };
        });
  
        setData(updatedData);
        console.log("Updated data" + updatedData)
      }else{
        setData(dogData);
        console.log("Dog Data:", dogData);
      }
      
    } catch (error) {
      console.log(error);
    } finally {
      setDataLoading(false)
    }
  };

  const fetchFavouriteDogData = async () => {
    try {
      setDataLoading(true)
      if (userEmail) {
        const favouriteRes = await axios.post(
          "http://localhost:3001/favouriteDogs",
          { userEmail: sessionStorage.uEmail }
        );
        const favouriteData = favouriteRes.data;
        setData2(favouriteData);
        setDataLoading(false);
        console.log("Favourite Dog Data:", favouriteData);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setDataLoading(false)
    }
  };

  useEffect(() => {
    if (sessionStorage != null && sessionStorage != "") {
      setUserEmail(sessionStorage.uEmail);
    }
  
    setSearched(false);
  
    fetchDogData();
    fetchFavouriteDogData();
  }, [userEmail]);
  

  const searchForDog = async () => {
    try {
      setDataLoading(true)
      const res = await fetch(
        `https://api.thedogapi.com/v1/breeds/search?q=${text}`
      )

      const data = await res.json()
      setData(data)
    } catch (error) {
      console.error(error)
    } finally {
      setDataLoading(true)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    searchForDog()

    if (text == "") {
      setSearched(false)
      e.target.reset();
      await new Promise(resolve => setTimeout(resolve, 50));

      await fetchFavouriteDogData()
      await fetchDogData();
    } else {
      setSearched(true)
    }
  }

  const handleDogFavourite = async (e, dog) => {
    e.preventDefault();
    const { id, name, bred_for, life_span, temperament, origin, image } = dog;
    let imageURL = "";

    if (!searched) {
      imageURL = image.url
    } else {
      imageURL = `https://cdn2.thedogapi.com/images/${dog.reference_image_id}.jpg`
    }

    const dogData = {
      userEmail: sessionStorage.uEmail,
      id,
      name,
      bred_for,
      life_span,
      temperament,
      origin,
      imageURL
    };

    if (userEmail) {
      axios.post('http://localhost:3001/addFavouriteDog', { dogData })
        .then((result) => {
          console.log(result);
          if (result.data === "Dog Favourited") {
            console.log('Dog is added to favourite collection');

            setData((prevData) => {
              const updatedData = prevData.map((dog) =>
                dog.id === id ? { ...dog, isFavourited: true } : dog
              );
              return updatedData;
            });
          }
          else {
            console.log('Dog Unfavourited')

            setData((prevData) => {
              const updatedData = prevData.map((dog) =>
                dog.id === id ? { ...dog, isFavourited: false } : dog
              );
              return updatedData;
            });
          }
        })
        .catch((err) => console.log(err));
    }
    else {
      console.log('User not logged in.')
    }
    await new Promise(resolve => setTimeout(resolve, 50));

    if (searched) {
      await fetchFavouriteDogData()
    } else {
      await fetchFavouriteDogData()
      await fetchDogData()
    }
  }

  const handleDogUnfavourite = async (e, dog) => {
    e.preventDefault();
    const { id, name, bred_for, life_span, temperament, origin, imageURL } = dog;

    const dogData = {
      userEmail: sessionStorage.uEmail,
      id,
      name,
      bred_for,
      life_span,
      temperament,
      origin,
      imageURL
    };

    if (userEmail) {
      axios.post('http://localhost:3001/deleteFavouriteDogs', { dogData })
        .then((result) => {
          console.log(result);
          if (result.data === "Dog Unfavourited") {
            console.log('Dog is removed from favourite collection');

            setData((prevData) => {
              const updatedData = prevData.map((dog) =>
                dog.id === id ? { ...dog, isFavourited: false } : dog
              );
              return updatedData;
            });
          }
        })
        .catch((err) => console.log(err));
    }
    else {
      console.log('User not logged in.')
    }

    await new Promise(resolve => setTimeout(resolve, 50));

    if (searched) {
      await fetchFavouriteDogData()
    } else {
      await fetchFavouriteDogData()
      await fetchDogData()
    }
  }

  return (
    <>
      {!data ? (
        <h1 className="flex items-center justify-center text-white text-center px-5 text-3xl h-screen font-bold uppercase">
          Loading...
        </h1>
      ) : (
        <>
          <div style={{ background: 'linear-gradient(to bottom right, #A6BCE8, #FFC0C0)' }}>
            <style>
              {`
        .welcome-container {
          background: linear-gradient(to bottom right, #FBE8E8, #FCC2C2);
          text-align: center;
          padding: 40px;
          border-radius: 10px;
        }

        .welcome-heading {
          font-size: 36px;
          font-weight: bold;
          margin-bottom: 20px;
          background-image: linear-gradient(to right, violet, indigo, blue, green, yellow, orange, red);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-size: 200% auto; /* Adjust the background size as per your preference */
          animation: rainbow-effect 10s linear infinite;
        }
        .dog-card {
          background: linear-gradient(to bottom right, #FBE8E8, #FCC2C2);
          border-radius: 20px;
        }
        `}
            </style>
            <Header />
            <BackToTop />
            <section className="p-8 max-w-8xl mx-auto">
              <div className='container mx-auto mt-5 mb-5'>
                <div className="welcome-container">
                  <h1 className="text-center welcome-heading">Favourite Dogs</h1>
                </div>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3 xl:grid-cols-4 my-10 lg:my-20">
                  {!dataLoading || data2.length != 0 ? (data2.map((dog) => (
                    <article key={dog.id} className='dog-card p-4 rounded relative'>
                      <div className="flex flex-col h-full">
                        <img src={dog.imageURL} alt={dog.name} className='rounded md:h-72 w-full object-cover' />
                        <div className="flex-grow">
                          <h3 className='text-lg font-bold mt-4'>{dog.name || 'N/A'}</h3>
                          <p>Life Span: {dog.life_span || 'N/A'}</p>
                          <p>Origin: {dog.origin || 'N/A'}</p>
                          <p>Bred: {dog.bred_for || 'N/A'}</p>
                          <p>Temperament: {dog.temperament || 'N/A'}</p>
                        </div>
                        <div className='flex justify-center mt-2'>
                          <form onSubmit={(e) => handleDogUnfavourite(e, dog)}>
                            {sessionStorage.uEmail == null || sessionStorage.uEmail == "" ? null : <Button type='submit' size="small">Remove from Favourites</Button>}
                          </form>
                        </div>
                      </div>
                    </article>
                  ))
                  ) : (
                    <>
                      {console.log("Data Loading: " + dataLoading)}
                    </>
                  )
                  }
                </div>


                <div className="welcome-container">
                  <h1 className="text-center welcome-heading">Dog Breeds</h1>
                  <form
                    onSubmit={handleSubmit}
                    className="max-w-xl mx-auto"
                    autoComplete="off"
                  >
                    <input
                      type="text"
                      name="search"
                      id="search"
                      placeholder="Search for a dog / breed"
                      className="py-2 px-4 rounded shadow w-full bg-slate-400 text-white placeholder-white"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                    />
                  </form>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-3 xl:grid-cols-4 my-10 lg:my-20">
                  {!searched ? (
                    data.map((dog) => (
                      <article key={dog.id} className='dog-card p-4 rounded relative'>
                        <div className="flex flex-col h-full">
                          {dog.image && dog.image.url ? (
                            <img src={dog.image.url} alt={dog.name} className='rounded md:h-72 w-full object-cover' />
                          ) : (
                            <div className='rounded md:h-72 w-full bg-gray-300' /> // Placeholder image or styling
                          )}
                          <div className="flex-grow">
                            <h3 className='text-lg font-bold mt-4'>{dog.name || 'N/A'}</h3>
                            <p>Life Span: {dog.life_span || 'N/A'}</p>
                            <p>Origin: {dog.origin || 'N/A'}</p>
                            <p>Bred: {dog.bred_for || 'N/A'}</p>
                            <p>Temperament: {dog.temperament || 'N/A'}</p>
                          </div>
                          <div className='flex justify-center mt-2'>
                            <form onSubmit={(e) => handleDogFavourite(e, dog)}>
                              {sessionStorage.uEmail == null || sessionStorage.uEmail == "" ? null : <Button type='submit' size="small">{dog.isFavourited ? "Remove from Favourites" : "Add to Favourites"}</Button>}
                            </form>
                          </div>
                        </div>
                      </article>
                    ))
                  ) : (
                    <>
                      {!dataLoading || text != "" ? (
                        data.map((dog) => (
                          <>
                            {
                              dog.reference_image_id == null ? (
                                console.log("Invalid data for dog id: " + dog.id + " and name: " + dog.name)
                              ) : (
                                <>
                                  <article key={dog.id} className='dog-card p-4 rounded relative'>
                                    <div className="flex flex-col h-full">
                                      <img
                                        src={`https://cdn2.thedogapi.com/images/${dog.reference_image_id}.jpg`}
                                        alt={dog.name}
                                        className="rounded md:h-72 w-full object-cover"
                                      />
                                      <div className="flex-grow">
                                        <h3 className='text-lg font-bold mt-4'>{dog.name}</h3>
                                        <p>Life Span: {dog.life_span}</p>
                                        <p>Origin: {dog.origin}</p>
                                        <p>Bred: {dog.bred_for}</p>
                                        <p>Temperament: {dog.temperament}</p>
                                      </div>
                                      <div className='flex justify-center mt-2'>
                                        <form onSubmit={(e) => handleDogFavourite(e, dog, userEmail)}>
                                          {sessionStorage.uEmail == null || sessionStorage.uEmail == "" ? null : <Button type='submit' size="small">{dog.isFavourited ? "Remove from Favourites" : "Add to Favourites"}</Button>}
                                        </form>
                                      </div>
                                    </div>
                                  </article>
                                </>
                              )
                            }
                          </>
                        ))
                      ) : (
                        <>
                          <p>You search for nothing! Press ENTER to search</p>
                        </>
                      )
                      }
                    </>
                  )}
                </div>
              </div>
            </section>
            <Footer />
          </div>
        </>
      )}
    </>
  )
}
export default Dog
