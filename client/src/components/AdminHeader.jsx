import { useState } from 'react';
import logo from './../assets/catndog.jpeg';
import { IoPersonCircleOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

function AdminHeader() {
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const logoutUser = () => {
    sessionStorage.uEmail = '';
    sessionStorage.uName = '';
    sessionStorage.uPass = '';
    console.log('User logged out');
  };

  return (
    <>
      <div className='p-2 flex justify-around gap-4 md:gap-14 align-items-center'>
        <img src={logo} className='w-[80px]' alt='Logo' />
        <ul className='flex gap-4 md:gap-14'>
          <li className='hover:font-bold cursor-pointer'>
            <a href='/admin'>Admin Home</a>
          </li>
          <li className='hover:font-bold cursor-pointer'>
            <a href=''>Contact Us Form</a>
          </li>
          <li className='hover:font-bold cursor-pointer'>
            <a href='/admincatfacts'>Cat Facts</a>
          </li>
        </ul>
        <form onSubmit={handleSubmit} className='align-items-center'>
          <button className='bg-blue-500 hover:bg-blue-700 rounded-full text-white flex align-items-center gap-1'>
            <IoPersonCircleOutline className='ml-3 text-[20px]' /> Logout
            <span></span>
          </button>
        </form>
      </div>
      <hr></hr>

      {showConfirmation && (
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded shadow'>
          <p>Are you sure you want to log out?</p>
          <div className='flex justify-end mt-4'>
            <button
              className='px-4 py-2 mr-2 bg-red-500 text-white rounded hover:bg-red-700'
              onClick={handleLogout}
            >
              Logout
            </button>
            <button
              className='px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400'
              onClick={() => setShowConfirmation(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminHeader;
