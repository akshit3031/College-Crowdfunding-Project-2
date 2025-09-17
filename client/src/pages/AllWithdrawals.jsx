import React, { useState, useEffect } from 'react';
import { useStateContext } from '../context';
import { CustomButton, Loader } from '../components';

const AllWithdrawals = () => {
  const { 
    getAllWithdrawalRequests, 
    approveWithdrawalRequest, 
    isTeacher,
    address 
  } = useStateContext();
  
  const [isLoading, setIsLoading] = useState(true);
  const [withdrawalRequests, setWithdrawalRequests] = useState([]);
  const [isTeacherUser, setIsTeacherUser] = useState(false);
  const [processingRequest, setProcessingRequest] = useState(null);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        // Check if user is teacher
        const teacherStatus = await isTeacher();
        setIsTeacherUser(teacherStatus);
        
        // Fetch all withdrawal requests
        const requests = await getAllWithdrawalRequests();
        setWithdrawalRequests(requests);
      } catch (error) {
        console.error('Error initializing withdrawals page:', error);
      }
      setIsLoading(false);
    };

    init();
  }, []);

  const handleApprove = async (campaignAddress, requestIndex) => {
    setProcessingRequest(`${campaignAddress}-${requestIndex}`);
    try {
      const success = await approveWithdrawalRequest(campaignAddress, requestIndex);
      
      if (success) {
        // Show immediate success feedback
        alert('Request approved and ETH sent to recipient wallet!');
        
        // Refresh the requests list with a short delay for blockchain confirmation
        setTimeout(async () => {
          try {
            const updatedRequests = await getAllWithdrawalRequests();
            setWithdrawalRequests(updatedRequests);
            console.log('Table updated - completed request removed from pending list');
          } catch (refreshError) {
            console.error('Error refreshing data:', refreshError);
            alert('ETH was sent but table refresh failed. Please click Refresh manually.');
          }
        }, 2000); // 2 second delay for blockchain confirmation
      } else {
        alert('Failed to approve and send ETH');
      }
    } catch (error) {
      console.error('Error approving request:', error);
      alert('Failed to approve and send ETH: ' + error.message);
    }
    setProcessingRequest(null);
  };

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const requests = await getAllWithdrawalRequests();
      setWithdrawalRequests(requests);
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-epilogue font-semibold text-[24px] text-white">
              All Withdrawal Requests
            </h1>
            <p className="font-epilogue font-normal text-[16px] text-[#808191] mt-2">
              {isTeacherUser ? 'Approve requests to instantly send ETH to recipients' : 'View all withdrawal requests'}
            </p>
          </div>
          <div className="flex gap-3">
            <CustomButton
              btnType="button"
              title="Refresh"
              styles="bg-[#3a3a43] text-white px-6 py-2"
              handleClick={refreshData}
            />
          </div>
        </div>

        {/* Status Info */}
        <div className="bg-[#1c1c24] rounded-[15px] p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-epilogue font-normal text-[14px] text-[#808191]">
                Total Requests
              </p>
              <p className="font-epilogue font-semibold text-[18px] text-white">
                {withdrawalRequests.length}
              </p>
            </div>
            <div>
              <p className="font-epilogue font-normal text-[14px] text-[#808191]">
                Pending Requests
              </p>
              <p className="font-epilogue font-semibold text-[18px] text-[#8c6dfd]">
                {withdrawalRequests.filter(req => !req.completed).length}
              </p>
            </div>
            <div>
              <p className="font-epilogue font-normal text-[14px] text-[#808191]">
                Your Role
              </p>
              <p className="font-epilogue font-semibold text-[16px] text-[#8c6dfd]">
                {isTeacherUser ? 'Teacher' : 'Student/Contributor'}
              </p>
            </div>
          </div>
        </div>

        {/* Withdrawal Requests Table */}
        <div className="bg-[#1c1c24] rounded-[15px] p-6">
          <h2 className="font-epilogue font-semibold text-[20px] text-white mb-4">
            Withdrawal Requests Table
          </h2>
          
          {withdrawalRequests.length === 0 ? (
            <div className="text-center py-8">
              <p className="font-epilogue font-normal text-[16px] text-[#808191]">
                No withdrawal requests found.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#3a3a43]">
                    <th className="font-epilogue font-semibold text-[14px] text-[#808191] py-3 px-2">Campaign</th>
                    <th className="font-epilogue font-semibold text-[14px] text-[#808191] py-3 px-2">Student</th>
                    <th className="font-epilogue font-semibold text-[14px] text-[#808191] py-3 px-2">Description</th>
                    <th className="font-epilogue font-semibold text-[14px] text-[#808191] py-3 px-2">Amount</th>
                    <th className="font-epilogue font-semibold text-[14px] text-[#808191] py-3 px-2">Recipient</th>
                    <th className="font-epilogue font-semibold text-[14px] text-[#808191] py-3 px-2">Approvals</th>
                    <th className="font-epilogue font-semibold text-[14px] text-[#808191] py-3 px-2">Status</th>
                    {isTeacherUser && <th className="font-epilogue font-semibold text-[14px] text-[#808191] py-3 px-2">Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {withdrawalRequests.map((request, index) => (
                    <tr key={`${request.campaignAddress}-${request.requestIndex}`} 
                        className="border-b border-[#2a2a32] hover:bg-[#2a2a32] transition-colors">
                      
                      {/* Campaign */}
                      <td className="py-4 px-2">
                        <div>
                          <p className="font-epilogue font-medium text-[14px] text-white truncate max-w-[120px]">
                            {request.campaignTitle}
                          </p>
                          <p className="font-mono text-[10px] text-[#808191]">
                            {request.campaignAddress.slice(0, 8)}...
                          </p>
                        </div>
                      </td>

                      {/* Student */}
                      <td className="py-4 px-2">
                        <div>
                          <p className="font-epilogue font-normal text-[12px] text-[#808191]">
                            Roll: {request.studentRoll}
                          </p>
                          <p className="font-mono text-[10px] text-[#606060]">
                            {request.studentName.slice(0, 8)}...
                          </p>
                        </div>
                      </td>

                      {/* Description */}
                      <td className="py-4 px-2">
                        <p className="font-epilogue font-normal text-[14px] text-white max-w-[150px] truncate">
                          {request.description}
                        </p>
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-2">
                        <p className="font-epilogue font-semibold text-[14px] text-[#8c6dfd]">
                          {request.value} ETH
                        </p>
                      </td>

                      {/* Recipient */}
                      <td className="py-4 px-2">
                        <p className="font-mono text-[10px] text-[#808191]">
                          {request.recipient.slice(0, 8)}...{request.recipient.slice(-4)}
                        </p>
                      </td>

                      {/* Approvals */}
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-2">
                          <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-[12px] font-semibold">
                            {request.approvalCount}
                          </span>
                          {processingRequest === `${request.campaignAddress}-${request.requestIndex}` && (
                            <span className="text-[10px] text-yellow-400">Processing...</span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-2">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${
                          request.completed 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {request.completed ? 'Completed' : 'Pending'}
                        </span>
                      </td>

                      {/* Action */}
                      {isTeacherUser && (
                        <td className="py-4 px-2">
                          {!request.completed && (
                            <CustomButton
                              btnType="button"
                              title={processingRequest === `${request.campaignAddress}-${request.requestIndex}` ? "Sending ETH..." : "Approve & Send"}
                              styles={`${
                                processingRequest === `${request.campaignAddress}-${request.requestIndex}` 
                                  ? "bg-gray-600 text-gray-300" 
                                  : "bg-green-600 hover:bg-green-700 text-white"
                              } px-3 py-1 text-[12px] transition-colors`}
                              handleClick={() => handleApprove(request.campaignAddress, request.requestIndex)}
                              disabled={processingRequest === `${request.campaignAddress}-${request.requestIndex}`}
                            />
                          )}
                          {request.completed && (
                            <span className="text-[12px] text-green-400 font-semibold">✓ Approved</span>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="bg-[#1c1c24] rounded-[15px] p-4">
          <h3 className="font-epilogue font-semibold text-[16px] text-white mb-3">
            Legend
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[12px]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-yellow-500/20 rounded-full"></span>
              <span className="text-[#808191]">Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500/20 rounded-full"></span>
              <span className="text-[#808191]">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-blue-500/20 rounded-full"></span>
              <span className="text-[#808191]">Approval Count</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#8c6dfd] rounded-full"></span>
              <span className="text-[#808191]">Amount</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllWithdrawals;