import React, { useState, useEffect } from 'react';
import { useStateContext } from '../context';
import { CustomButton, Loader } from '../components';

const AdminPanel = () => {
  const { factoryContract, address } = useStateContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [newTeacherAddress, setNewTeacherAddress] = useState('');
  const [teachersList, setTeachersList] = useState([]);
  const [removeTeacherAddress, setRemoveTeacherAddress] = useState('');

  // Check if current user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const adminAddress = await factoryContract.admin();
        setIsAdmin(adminAddress.toLowerCase() === address.toLowerCase());
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    };

    if (factoryContract && address) {
      checkAdminStatus();
    }
  }, [factoryContract, address]);

  // Add teacher function
  const handleAddTeacher = async () => {
    if (!newTeacherAddress.startsWith('0x') || newTeacherAddress.length !== 42) {
      alert('Please enter a valid Ethereum address');
      return;
    }

    setIsLoading(true);
    try {
      const tx = await factoryContract.addTeacher(newTeacherAddress);
      await tx.wait();
      
      alert('Teacher added successfully!');
      setNewTeacherAddress('');
      
      // Check if the teacher was added
      const isTeacher = await factoryContract.teachers(newTeacherAddress);
      if (isTeacher) {
        setTeachersList(prev => [...prev, newTeacherAddress]);
      }
    } catch (error) {
      console.error('Error adding teacher:', error);
      alert('Failed to add teacher: ' + error.message);
    }
    setIsLoading(false);
  };

  // Remove teacher function
  const handleRemoveTeacher = async () => {
    if (!removeTeacherAddress.startsWith('0x') || removeTeacherAddress.length !== 42) {
      alert('Please enter a valid Ethereum address');
      return;
    }

    setIsLoading(true);
    try {
      const tx = await factoryContract.removeTeacher(removeTeacherAddress);
      await tx.wait();
      
      alert('Teacher removed successfully!');
      setRemoveTeacherAddress('');
      
      // Remove from local list
      setTeachersList(prev => prev.filter(addr => addr.toLowerCase() !== removeTeacherAddress.toLowerCase()));
    } catch (error) {
      console.error('Error removing teacher:', error);
      alert('Failed to remove teacher: ' + error.message);
    }
    setIsLoading(false);
  };

  // Check if address is teacher
  const checkTeacherStatus = async () => {
    if (!newTeacherAddress.startsWith('0x') || newTeacherAddress.length !== 42) {
      alert('Please enter a valid Ethereum address');
      return;
    }

    try {
      const isTeacher = await factoryContract.teachers(newTeacherAddress);
      alert(`Address ${newTeacherAddress} is ${isTeacher ? 'a teacher' : 'NOT a teacher'}`);
    } catch (error) {
      console.error('Error checking teacher status:', error);
      alert('Failed to check teacher status');
    }
  };

  if (!isAdmin) {
    return (
      <div className="w-full max-w-[1200px] mx-auto px-2 sm:px-0">
        <div className="bg-white border-2 border-[#DCDCDC] rounded-[15px] p-4 sm:p-6 text-center">
          <h1 className="font-epilogue font-semibold text-[20px] sm:text-[24px] text-[#E62727] mb-4">
            Access Denied
          </h1>
          <p className="font-epilogue font-normal text-[14px] sm:text-[16px] text-gray-600 break-all">
            Only the admin can access this panel. Your address: {address}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto px-2 sm:px-0">
      {isLoading && <Loader />}
      
      <div className="flex flex-col gap-4 sm:gap-6">
        <div>
          <h1 className="font-epilogue font-semibold text-[20px] sm:text-[24px] text-[#E62727]">
            Admin Panel - Teacher Management
          </h1>
          <p className="font-epilogue font-normal text-[14px] sm:text-[16px] text-gray-600 mt-2">
            Manage teacher addresses for withdrawal approval
          </p>
        </div>

        {/* Add Teacher Section */}
        <div className="bg-white border-2 border-[#DCDCDC] rounded-[15px] p-4 sm:p-6">
          <h2 className="font-epilogue font-semibold text-[18px] sm:text-[20px] text-gray-800 mb-4">
            Add Teacher
          </h2>
          
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Teacher Wallet Address (0x...)"
              className="w-full py-[10px] px-[15px] outline-none border-[1px] border-[#DCDCDC] bg-[#F3F2EC] focus:border-[#1E93AB] font-epilogue text-gray-800 text-[14px] sm:text-[16px] leading-[28px] sm:leading-[30px] placeholder:text-gray-500 rounded-[10px]"
              value={newTeacherAddress}
              onChange={(e) => setNewTeacherAddress(e.target.value)}
            />
            
            <div className="flex flex-col sm:flex-row gap-3">
              <CustomButton
                btnType="button"
                title="Add Teacher"
                styles="bg-green-600 hover:bg-green-700 text-white px-6 py-2 w-full sm:w-auto"
                handleClick={handleAddTeacher}
              />
              
              <CustomButton
                btnType="button"
                title="Check Status"
                styles="bg-[#1E93AB] hover:bg-[#176a82] text-white px-6 py-2 w-full sm:w-auto"
                handleClick={checkTeacherStatus}
              />
            </div>
          </div>
        </div>

        {/* Remove Teacher Section */}
        <div className="bg-white border-2 border-[#DCDCDC] rounded-[15px] p-4 sm:p-6">
          <h2 className="font-epilogue font-semibold text-[18px] sm:text-[20px] text-gray-800 mb-4">
            Remove Teacher
          </h2>
          
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Teacher Wallet Address to Remove (0x...)"
              className="w-full py-[10px] px-[15px] outline-none border-[1px] border-[#DCDCDC] bg-[#F3F2EC] focus:border-[#1E93AB] font-epilogue text-gray-800 text-[14px] sm:text-[16px] leading-[28px] sm:leading-[30px] placeholder:text-gray-500 rounded-[10px]"
              value={removeTeacherAddress}
              onChange={(e) => setRemoveTeacherAddress(e.target.value)}
            />
            
            <CustomButton
              btnType="button"
              title="Remove Teacher"
              styles="bg-[#E62727] hover:bg-red-700 text-white px-6 py-2 w-full sm:w-auto"
              handleClick={handleRemoveTeacher}
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white border-2 border-[#DCDCDC] rounded-[15px] p-4 sm:p-6">
          <h2 className="font-epilogue font-semibold text-[18px] sm:text-[20px] text-gray-800 mb-4">
            How to Find Teacher Wallet Addresses
          </h2>
          
          <div className="space-y-3 text-gray-600">
            <p className="font-epilogue font-normal text-[12px] sm:text-[14px]">
              <strong>For Ganache (Local Testing):</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 text-[10px] sm:text-[12px] ml-4">
              <li>Open Ganache desktop application</li>
              <li>Copy any account address (they all start with 0x)</li>
              <li>Use different accounts for different teachers</li>
            </ul>
            
            <p className="font-epilogue font-normal text-[12px] sm:text-[14px] mt-4">
              <strong>For Real Teachers:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 text-[10px] sm:text-[12px] ml-4">
              <li>Ask teachers to create MetaMask wallets</li>
              <li>Teachers share their wallet addresses with you</li>
              <li>Add their addresses using this admin panel</li>
              <li>Teachers can then approve withdrawal requests</li>
            </ul>
            
            <div className="mt-4 p-3 bg-[#F3F2EC] border border-[#DCDCDC] rounded-[10px]">
              <p className="font-epilogue font-normal text-[10px] sm:text-[12px] text-[#E62727]">
                <strong>Sample Ganache Addresses for Testing:</strong>
              </p>
              <p className="font-mono text-[8px] sm:text-[10px] text-gray-600 mt-1 break-all">
                0x617F2E2fD72FD9D5503197a0B8A0f9CEff4A4A27<br/>
                0x17F6AD8Ef982297658729fcE6Db46a1ad37e0Ae6<br/>
                0x5c6B0f7Bf3E7ce046039Bd8FABdfD3f9F5021678
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;