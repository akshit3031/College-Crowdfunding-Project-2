import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStateContext } from '../context';
import { CustomButton, Loader } from '../components';

const WithdrawalRequestCard = ({ request, campaignAddress, isOwner, isTeacherUser, onAction }) => (
  <div className="bg-white border-2 border-[#DCDCDC] rounded-[15px] p-3 sm:p-4 mb-4">
    <div className="flex flex-col gap-3 sm:gap-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
        <div className="flex-1">
          <h4 className="font-epilogue font-semibold text-[14px] sm:text-[16px] text-gray-800">
            Request #{request.index}
          </h4>
          <p className="font-epilogue font-normal text-[12px] sm:text-[14px] text-gray-600 mt-2">
            {request.description}
          </p>
        </div>
        <div className="text-left sm:text-right">
          <p className="font-epilogue font-semibold text-[14px] sm:text-[16px] text-[#E62727]">
            {request.value} ETH
          </p>
          <p className="font-epilogue font-normal text-[10px] sm:text-[12px] text-gray-600">
            Approvals: {request.approvalCount}
          </p>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <p className="font-epilogue font-normal text-[10px] sm:text-[12px] text-gray-600 break-all sm:break-normal">
          Recipient: {request.recipient.slice(0, 6)}...{request.recipient.slice(-4)}
        </p>
        <div className={`px-2 py-1 rounded-full text-[8px] sm:text-[10px] font-semibold self-start ${
          request.completed 
            ? 'bg-green-500/20 text-green-400' 
            : 'bg-yellow-500/20 text-yellow-400'
        }`}>
          {request.completed ? 'Completed' : 'Pending'}
        </div>
      </div>

      {!request.completed && (
        <div className="flex flex-col sm:flex-row gap-2 mt-2">
          {isTeacherUser && (
            <CustomButton
              btnType="button"
              title="Approve"
              styles="bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm w-full sm:w-auto"
              handleClick={() => onAction('approve', request.index)}
            />
          )}
          {isOwner && request.approvalCount > 0 && (
            <CustomButton
              btnType="button"
              title="Finalize"
              styles="bg-[#1E93AB] hover:bg-[#176a82] text-white px-4 py-2 text-sm w-full sm:w-auto"
              handleClick={() => onAction('finalize', request.index)}
            />
          )}
        </div>
      )}
    </div>
  </div>
);

const CreateWithdrawalForm = ({ campaignAddress, campaignOwner, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    value: ''
  });
  const { createWithdrawalRequest } = useStateContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description || !formData.value) {
      alert('Please fill in all fields');
      return;
    }

    // Validate amount
    if (parseFloat(formData.value) <= 0) {
      alert('Amount must be greater than 0');
      return;
    }

    setIsLoading(true);
    try {
      // Use campaign owner as recipient automatically
      const success = await createWithdrawalRequest(
        campaignAddress,
        formData.description,
        formData.value,
        campaignOwner // Use campaign owner's address as recipient
      );
      
      if (success) {
        setFormData({ description: '', value: '' });
        onSuccess();
        alert('Withdrawal request created successfully! Funds will be sent to your address when approved.');
      } else {
        alert('Failed to create withdrawal request');
      }
    } catch (error) {
      console.error('Error creating withdrawal request:', error);
      alert('Failed to create withdrawal request: ' + error.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-white border-2 border-[#DCDCDC] rounded-[15px] p-4 sm:p-6 mb-6">
      <h3 className="font-epilogue font-semibold text-[16px] sm:text-[18px] text-gray-800 mb-4">
        Create Withdrawal Request
      </h3>
      
      <div className="mb-4 p-3 bg-[#F3F2EC] rounded-[10px] border border-[#DCDCDC]">
        <p className="font-epilogue font-normal text-[12px] sm:text-[14px] text-gray-700 mb-2">
          <strong>Withdrawal Information:</strong>
        </p>
        <p className="font-epilogue font-normal text-[10px] sm:text-[12px] text-gray-600 leading-[16px] sm:leading-[18px]">
          When your withdrawal request is approved and finalized, the funds will be automatically 
          sent to your wallet address (the campaign creator). You don't need to specify a recipient address.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <input
            type="text"
            placeholder="Description (e.g., Books, Lab Equipment, Tuition)"
            className="w-full py-[10px] px-[15px] outline-none border-[1px] border-[#DCDCDC] bg-[#F3F2EC] focus:border-[#1E93AB] font-epilogue text-gray-800 text-[14px] sm:text-[16px] leading-[26px] sm:leading-[30px] placeholder:text-gray-500 rounded-[10px] transition-colors duration-300"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>
        
        <div>
          <input
            type="number"
            step="0.01"
            placeholder="Amount in ETH"
            className="w-full py-[10px] px-[15px] outline-none border-[1px] border-[#DCDCDC] bg-[#F3F2EC] focus:border-[#1E93AB] font-epilogue text-gray-800 text-[14px] sm:text-[16px] leading-[26px] sm:leading-[30px] placeholder:text-gray-500 rounded-[10px] transition-colors duration-300"
            value={formData.value}
            onChange={(e) => setFormData({...formData, value: e.target.value})}
          />
        </div>
        
        {/* Show recipient info but don't allow editing */}
        <div className="p-3 bg-[#DCDCDC] rounded-[10px]">
          <p className="font-epilogue font-normal text-[10px] sm:text-[12px] text-gray-600 mb-1">
            Funds will be sent to:
          </p>
          <p className="font-epilogue font-normal text-[12px] sm:text-[14px] text-[#1E93AB] break-all">
            {campaignOwner} (Your Address)
          </p>
        </div>
        
        <CustomButton
          btnType="submit"
          title={isLoading ? "Creating..." : "Create Request"}
          styles="bg-[#E62727] hover:bg-[#c91f1f] w-full"
          handleClick={() => {}}
        />
      </form>
    </div>
  );
};

const Withdrawal = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { 
    address, 
    getWithdrawalRequests, 
    approveWithdrawalRequest, 
    finalizeWithdrawalRequest,
    isTeacher 
  } = useStateContext();
  
  const [isLoading, setIsLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [isTeacherUser, setIsTeacherUser] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (!state?.address) {
      navigate('/');
      return;
    }
    
    const init = async () => {
      setIsLoading(true);
      try {
        // Check if user is teacher
        const teacherStatus = await isTeacher();
        setIsTeacherUser(teacherStatus);
        
        // Check if user is campaign owner
        setIsOwner(state.student.toLowerCase() === address.toLowerCase());
        
        // Fetch withdrawal requests
        const requestsData = await getWithdrawalRequests(state.address);
        setRequests(requestsData);
      } catch (error) {
        console.error('Error initializing withdrawal page:', error);
      }
      setIsLoading(false);
    };

    init();
  }, [state, address, isTeacher, getWithdrawalRequests, navigate]);

  const handleAction = async (action, requestIndex) => {
    setIsLoading(true);
    try {
      let success = false;
      
      if (action === 'approve') {
        success = await approveWithdrawalRequest(state.address, requestIndex);
      } else if (action === 'finalize') {
        success = await finalizeWithdrawalRequest(state.address, requestIndex);
      }
      
      if (success) {
        // Refresh requests
        const updatedRequests = await getWithdrawalRequests(state.address);
        setRequests(updatedRequests);
      } else {
        alert(`Failed to ${action} request`);
      }
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
      alert(`Failed to ${action} request`);
    }
    setIsLoading(false);
  };

  const handleCreateSuccess = async () => {
    // Refresh the requests list
    const updatedRequests = await getWithdrawalRequests(state.address);
    setRequests(updatedRequests);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto px-2 sm:px-0">
      <div className="flex flex-col gap-4 sm:gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="font-epilogue font-semibold text-[20px] sm:text-[24px] text-gray-800">
              Withdrawal Management
            </h1>
            <p className="font-epilogue font-normal text-[14px] sm:text-[16px] text-gray-600 mt-2 break-words">
              Campaign: {state.title}
            </p>
          </div>
          <CustomButton
            btnType="button"
            title="Back to Campaign"
            styles="bg-[#DCDCDC] hover:bg-gray-300 text-gray-800 px-4 sm:px-6 py-2 w-full sm:w-auto text-sm sm:text-base"
            handleClick={() => navigate(`/campaign-details/${state.address}`, { state })}
          />
        </div>

        {/* Campaign Info */}
        <div className="bg-white border-2 border-[#DCDCDC] rounded-[15px] p-4">
          <div className="grid grid-cols-2 gap-4 text-center sm:text-left">
            <div>
              <p className="font-epilogue font-normal text-[12px] sm:text-[14px] text-gray-600">
                Campaign Balance
              </p>
              <p className="font-epilogue font-semibold text-[16px] sm:text-[18px] text-[#E62727]">
                {state.balance} ETH
              </p>
            </div>
            <div>
              <p className="font-epilogue font-normal text-[12px] sm:text-[14px] text-gray-600">
                Your Role
              </p>
              <p className="font-epilogue font-semibold text-[14px] sm:text-[16px] text-[#1E93AB]">
                {isOwner ? 'Campaign Owner' : isTeacherUser ? 'Teacher' : 'Contributor'}
              </p>
            </div>
          </div>
        </div>

        {/* Create withdrawal form - only for campaign owner */}
        {isOwner && (
          <CreateWithdrawalForm 
            campaignAddress={state.address} 
            campaignOwner={state.student}
            onSuccess={handleCreateSuccess}
          />
        )}

        {/* Withdrawal Requests */}
        <div>
          <h2 className="font-epilogue font-semibold text-[18px] sm:text-[20px] text-gray-800 mb-4">
            Withdrawal Requests ({requests.length})
          </h2>
          
          {requests.length === 0 ? (
            <div className="bg-white border-2 border-[#DCDCDC] rounded-[15px] p-4 sm:p-6 text-center">
              <p className="font-epilogue font-normal text-[14px] sm:text-[16px] text-gray-600">
                No withdrawal requests yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <WithdrawalRequestCard
                  key={request.index}
                  request={request}
                  campaignAddress={state.address}
                  isOwner={isOwner}
                  isTeacherUser={isTeacherUser}
                  onAction={handleAction}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Withdrawal;