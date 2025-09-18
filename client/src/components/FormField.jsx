import React from 'react'

const FormField = ({ labelName, placeholder, inputType, isTextArea, value, handleChange }) => {
  return (
    <label className="flex-1 w-full flex flex-col">
      {labelName && (
        <span className="font-epilogue font-medium text-[14px] leading-[22px] text-gray-700 mb-[10px]">{labelName}</span>
      )}
      {isTextArea ? (
        <textarea 
          required
          value={value}
          onChange={handleChange}
          rows={10}
          placeholder={placeholder}
          className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#DCDCDC] bg-[#F3F2EC] focus:border-[#1E93AB] font-epilogue text-gray-800 text-[14px] placeholder:text-gray-500 rounded-[10px] sm:min-w-[300px] transition-colors duration-300"
        />
      ) : (
        <input 
          required
          value={value}
          onChange={handleChange}
          type={inputType}
          step="0.1"
          placeholder={placeholder}
          className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#DCDCDC] bg-[#F3F2EC] focus:border-[#1E93AB] font-epilogue text-gray-800 text-[14px] placeholder:text-gray-500 rounded-[10px] sm:min-w-[300px] transition-colors duration-300"
        />
      )}
    </label>
  )
}

export default FormField