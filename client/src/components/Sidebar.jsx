import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { logo, sun, nitLogo } from '../assets';
import { navlinks } from '../constants';

const Icon = ({ styles, name, imgUrl, isActive, disabled, handleClick }) => (
  <div className={`w-[48px] h-[48px] rounded-[10px] ${isActive && isActive === name && 'bg-[#1E93AB]'} flex justify-center items-center ${!disabled && 'cursor-pointer'} ${styles}`} onClick={handleClick}>
    {!isActive ? (
      <img src={imgUrl} alt="fund_logo" className="w-1/2 h-1/2" />
    ) : (
      <img src={imgUrl} alt="fund_logo" className={`w-1/2 h-1/2 ${isActive !== name && 'grayscale'}`} />
    )}
  </div>
)

const Sidebar = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState('dashboard');

  return (
    <div className="h-full w-full flex justify-center items-start flex-col bg-[#F3F2EC] pt-5 px-2">
      <Link to="/" className="mb-8 mx-auto">
        <div className="w-[52px] h-[52px] bg-white border-2 border-[#E62727] rounded-[10px] flex justify-center items-center hover:border-[#1E93AB] transition-colors shadow-sm">
          <img src={nitLogo} alt="NIT Kurukshetra" className="w-[80%] h-[80%] object-contain" />
        </div>
      </Link>

      <div className="flex-1 flex flex-col justify-between items-center bg-[#DCDCDC] rounded-[20px] w-[76px] py-4 mx-auto min-h-[500px]">
        <div className="flex flex-col justify-center items-center gap-3">
          {navlinks.map((link) => (
            <Icon 
              key={link.name}
              {...link}
              isActive={isActive}
              handleClick={() => {
                if(!link.disabled) {
                  setIsActive(link.name);
                  navigate(link.link);
                }
              }}
            />
          ))}
        </div>

        <Icon styles="bg-[#DCDCDC] shadow-secondary" imgUrl={sun} />
      </div>
    </div>
  )
}

export default Sidebar