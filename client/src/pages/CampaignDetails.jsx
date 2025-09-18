import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';

import { useStateContext } from '../context';
import { CountBox, CustomButton, Loader } from '../components';
import { thirdweb } from '../assets';
import CollegeCampaignABI from '../abi/CollegeCampaign.json';

const CampaignDetails = () => {
  const { state } = useLocation(); 
  const navigate = useNavigate();
  const { address, signer } = useStateContext();

  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [contributorsCount, setContributorsCount] = useState(0);

  const campaignContract = new ethers.Contract(
    state.address,
    CollegeCampaignABI.abi,
    signer
  );

  const fetchContributorsCount = async () => {
    try {
      const count = await campaignContract.contributorsCount();
      setContributorsCount(count.toNumber());
    } catch (error) {
      console.error('Failed to fetch contributors count:', error);
    }
  };

  useEffect(() => {
    if (campaignContract) fetchContributorsCount();
  }, [campaignContract, address]);

  const handleDonate = async () => {
    setIsLoading(true);
    try {
      const minContribution = await campaignContract.minimumContribution();
      if (ethers.utils.parseEther(amount).lt(minContribution)) {
        alert(`Minimum contribution is ${ethers.utils.formatEther(minContribution)} ETH`);
        setIsLoading(false);
        return;
      }

      const tx = await campaignContract.contribute({
        value: ethers.utils.parseEther(amount.toString()),
      });
      await tx.wait();
      await fetchContributorsCount();
      navigate('/');
    } catch (error) {
      console.error('Donation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-2 sm:px-0">
      {isLoading && <Loader />}

      <div className="w-full flex lg:flex-row flex-col mt-10 gap-[30px]">
        {/* Campaign image and progress */}
        <div className="flex-1 flex-col">
          <img
            src={state.image}
            alt="campaign"
            className="w-full h-[250px] sm:h-[350px] lg:h-[410px] object-cover rounded-xl"
          />
          <div className="relative w-full h-[5px] bg-[#DCDCDC] mt-2">
            <div
              className="absolute h-full bg-[#1E93AB]"
              style={{
                width: `${(state.balance / state.targetAmount) * 100}%`,
                maxWidth: '100%',
              }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="flex lg:w-[150px] w-full flex-row lg:flex-col justify-between lg:justify-start gap-[15px] lg:gap-[30px]">
          <CountBox
            title={`Raised of ${state.targetAmount} ETH`}
            value={`${state.balance} ETH`}
          />
          <CountBox title="Total Backers" value={contributorsCount} />
          <CountBox title="Min Contribution" value={`${state.minimumContribution} ETH`} />
        </div>
      </div>

      {/* Campaign details and donation */}
      <div className="mt-[40px] sm:mt-[60px] flex lg:flex-row flex-col gap-5">
        {/* Creator Info and Description */}
        <div className="flex-[2] flex flex-col gap-[30px] lg:gap-[40px]">
          <div>
            <h4 className="font-epilogue font-semibold text-[16px] sm:text-[18px] text-gray-800 uppercase">
              Creator
            </h4>
            <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
              <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#DCDCDC] cursor-pointer">
                <img
                  src={thirdweb}
                  alt="user"
                  className="w-[60%] h-[60%] object-contain"
                />
              </div>
              <div>
                <h4 className="font-epilogue font-semibold text-[14px] text-gray-800 break-all">
                  {state.student}
                </h4>
                <p className="mt-[4px] font-epilogue font-normal text-[12px] text-gray-600">
                  Roll Number: {state.studentRoll}
                </p>
              </div>
            </div>
          </div>

          {/* Campaign Management - Only for campaign owner */}
          {state.student.toLowerCase() === address.toLowerCase() && (
            <div>
              <h4 className="font-epilogue font-semibold text-[16px] sm:text-[18px] text-gray-800 uppercase">
                Campaign Management
              </h4>
              <div className="mt-[20px] flex flex-col sm:flex-row gap-[14px]">
                <CustomButton
                  btnType="button"
                  title="Manage Withdrawals"
                  styles="bg-[#E62727] hover:bg-[#c91f1f] text-white px-6 py-3 w-full sm:w-auto"
                  handleClick={() => navigate('/withdrawal', { state })}
                />
              </div>
            </div>
          )}

          <div>
            <h4 className="font-epilogue font-semibold text-[16px] sm:text-[18px] text-gray-800 uppercase">
              Story
            </h4>
            <div className="mt-[20px]">
              <p className="font-epilogue font-normal text-[14px] sm:text-[16px] text-gray-600 leading-[22px] sm:leading-[26px] text-justify">
                {state.description}
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-epilogue font-semibold text-[16px] sm:text-[18px] text-gray-800 uppercase">
              Campaign Stats
            </h4>
            <div className="mt-[20px] flex flex-col gap-4">
              <div className="flex justify-between items-center gap-4">
                <p className="font-epilogue font-normal text-[14px] sm:text-[16px] text-gray-600 leading-[22px] sm:leading-[26px]">
                  Total Contributors:
                </p>
                <p className="font-epilogue font-semibold text-[14px] sm:text-[16px] text-[#1E93AB] leading-[22px] sm:leading-[26px]">
                  {contributorsCount}
                </p>
              </div>
              <div className="flex justify-between items-center gap-4">
                <p className="font-epilogue font-normal text-[14px] sm:text-[16px] text-gray-600 leading-[22px] sm:leading-[26px]">
                  Current Balance:
                </p>
                <p className="font-epilogue font-semibold text-[14px] sm:text-[16px] text-[#E62727] leading-[22px] sm:leading-[26px]">
                  {state.balance} ETH
                </p>
              </div>
              <div className="flex justify-between items-center gap-4">
                <p className="font-epilogue font-normal text-[14px] sm:text-[16px] text-gray-600 leading-[22px] sm:leading-[26px]">
                  Withdrawal Requests:
                </p>
                <p className="font-epilogue font-semibold text-[14px] sm:text-[16px] text-[#1E93AB] leading-[22px] sm:leading-[26px]">
                  {state.requestsCount}
                </p>
              </div>
              
              {contributorsCount === 0 && (
                <p className="font-epilogue font-normal text-[14px] sm:text-[16px] text-gray-600 leading-[22px] sm:leading-[26px] text-justify mt-4">
                  No contributors yet. Be the first one to support this campaign!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Fund campaign */}
        <div className="flex-1">
          <h4 className="font-epilogue font-semibold text-[16px] sm:text-[18px] text-gray-800 uppercase">
            Fund
          </h4>
          <div className="mt-[20px] flex flex-col p-4 bg-white border-2 border-[#DCDCDC] rounded-[10px]">
            <p className="font-epilogue font-medium text-[18px] sm:text-[20px] leading-[28px] sm:leading-[30px] text-center text-gray-600">
              Fund the campaign
            </p>
            <div className="mt-[30px]">
              <input
                type="number"
                placeholder="ETH 0.1"
                step="0.01"
                className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#DCDCDC] bg-[#F3F2EC] focus:border-[#1E93AB] font-epilogue text-gray-800 text-[16px] sm:text-[18px] leading-[26px] sm:leading-[30px] placeholder:text-gray-500 rounded-[10px] transition-colors duration-300"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <div className="my-[20px] p-4 bg-[#F3F2EC] rounded-[10px] border border-[#DCDCDC]">
                <h4 className="font-epilogue font-semibold text-[14px] leading-[22px] text-gray-800">
                  Back it because you believe in it.
                </h4>
                <p className="mt-[20px] font-epilogue font-normal text-[12px] sm:text-[14px] leading-[20px] sm:leading-[22px] text-gray-600">
                  Support the project for no reward, just because it speaks to you.
                </p>
              </div>

              <CustomButton
                btnType="button"
                title="Fund Campaign"
                styles="w-full bg-[#1E93AB] hover:bg-[#176a82]"
                handleClick={handleDonate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;
