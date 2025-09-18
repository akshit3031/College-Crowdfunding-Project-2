import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

import { useStateContext } from '../context';
import { CustomButton } from './';
import { logo, menu, search, thirdweb, nitLogo } from '../assets';
import { navlinks } from '../constants';

const Navbar = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState('dashboard');
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const { connect, address } = useStateContext();

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden">
        {/* Top Bar */}
        <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <Link to="/" className="flex items-center space-x-3">
            <img src={nitLogo} alt="NIT Logo" className="w-8 h-8 object-contain" />
            <h1 className="text-lg font-bold text-[#8b0000]">NIT Crowdfunding</h1>
          </Link>
          
          <button
            onClick={() => setToggleDrawer(!toggleDrawer)}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <img src={menu} alt="menu" className="w-6 h-6" />
          </button>
        </div>

        {/* Search Bar - Mobile */}
        <div className="p-4 bg-white border-b border-gray-200">
          <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
            <input 
              type="text" 
              placeholder="Search campaigns..." 
              className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-500"
            />
            <button className="ml-2 p-2 bg-[#1E93AB] rounded-full">
              <img src={search} alt="search" className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${toggleDrawer ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setToggleDrawer(false)}
          />
          
          {/* Drawer */}
          <div className={`absolute top-0 right-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ${toggleDrawer ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
                <button 
                  onClick={() => setToggleDrawer(false)}
                  className="p-2 hover:bg-gray-100 rounded-md"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <nav className="p-4">
              {navlinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => {
                    if (!link.disabled) {
                      setIsActive(link.name);
                      setToggleDrawer(false);
                      navigate(link.link);
                    }
                  }}
                  disabled={link.disabled}
                  className={`w-full flex items-center p-4 mb-2 rounded-lg transition-colors ${
                    isActive === link.name 
                      ? 'bg-[#1E93AB] text-white' 
                      : link.disabled 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <img 
                    src={link.imgUrl}
                    alt={link.name}
                    className={`w-5 h-5 mr-3 ${
                      isActive === link.name ? 'filter-none' : 'grayscale'
                    }`}
                  />
                  <span className="capitalize font-medium">{link.name}</span>
                </button>
              ))}
            </nav>

            <div className="p-4 border-t border-gray-200">
              <CustomButton 
                btnType="button"
                title={address ? 'Create Campaign' : 'Connect Wallet'}
                styles={`w-full ${address ? 'bg-[#E62727] hover:bg-[#c91f1f]' : 'bg-[#1E93AB] hover:bg-[#176a82]'}`}
                handleClick={() => {
                  if(address) {
                    navigate('/create-campaign');
                  } else {
                    connect();
                  }
                  setToggleDrawer(false);
                }}
              />
              
              {address && (
                <Link to="/profile" onClick={() => setToggleDrawer(false)}>
                  <div className="mt-3 flex items-center p-3 bg-gray-100 rounded-lg">
                    <img src={thirdweb} alt="profile" className="w-8 h-8 mr-3" />
                    <span className="text-sm text-gray-700">View Profile</span>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
        {/* Logo and Search Bar - Desktop */}
        <div className="flex items-center space-x-6 flex-1">
          <Link to="/" className="flex items-center space-x-3">
            <img src={nitLogo} alt="NIT Logo" className="w-8 h-8 object-contain" />
            <h1 className="text-lg font-bold text-[#E62727] hidden lg:block">NIT Crowdfunding</h1>
          </Link>
          
          <div className="flex-1 max-w-md">
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
              <input 
                type="text" 
                placeholder="Search for campaigns..." 
                className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-500"
              />
              <button className="ml-2 p-1.5 bg-[#1E93AB] rounded-full hover:bg-[#176a82] transition-colors">
                <img src={search} alt="search" className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Actions */}
        <div className="flex items-center space-x-4">
          <CustomButton 
            btnType="button"
            title={address ? 'Create Campaign' : 'Connect Wallet'}
            styles={address ? 'bg-[#E62727] hover:bg-[#c91f1f]' : 'bg-[#1E93AB] hover:bg-[#176a82]'}
            handleClick={() => {
              if(address) navigate('/create-campaign')
              else connect()
            }}
          />

          {address && (
            <Link to="/profile">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex justify-center items-center hover:bg-gray-200 transition-colors">
                <img src={thirdweb} alt="profile" className="w-6 h-6" />
              </div>
            </Link>
          )}
        </div>
      </div>
    </>
  )
}

export default Navbar