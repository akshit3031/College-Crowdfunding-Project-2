import React from 'react'

const CountBox = ({ title, value }) => {
  return (
    <div className="flex flex-col items-center w-full sm:w-[150px]">
      <h4 className="font-epilogue font-bold text-[20px] sm:text-[30px] text-white p-2 sm:p-3 bg-[#1E93AB] rounded-t-[10px] w-full text-center truncate">{value}</h4>
      <p className="font-epilogue font-normal text-[12px] sm:text-[16px] text-gray-700 bg-[#DCDCDC] px-2 sm:px-3 py-2 w-full rounded-b-[10px] text-center">{title}</p>
    </div>
  )
}

export default CountBox