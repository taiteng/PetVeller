import { useState } from 'react'
import logo from './../assets/catndog.jpeg'
import { IoPersonCircleOutline } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'

function Header() {

  const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        navigate('/login');
    }

  return (
    <>
    <div className='p-2 flex justify-around gap-4 md:gap-14 align-items-center'>
      <img src={logo} className='w-[80px]'/>
      <ul className='flex gap-4 md:gap-14'>
        <li className='hover:font-bold cursor-pointer'>
            Home
        </li>
        <li className='hover:font-bold cursor-pointer'>
            Dogs
        </li>
        <li className='hover:font-bold cursor-pointer'>
            Dog Facts
        </li>
        <li className='hover:font-bold cursor-pointer'>
            <a href='/cat'>Cats</a>
        </li>
        <li className='hover:font-bold cursor-pointer'>
            Cat Facts
        </li>
      </ul>
      <form onSubmit={handleSubmit} className='align-items-center'>
        <button className='bg-blue-500 hover:bg-blue-700 rounded-full text-white flex align-items-center gap-1'>
          <IoPersonCircleOutline className='ml-3 text-[20px]'/> Login <span></span>
        </button>
      </form>
    </div>
    <hr></hr>
    </>
  )
}

export default Header
