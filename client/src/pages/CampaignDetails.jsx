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
    <div>
      {isLoading && <Loader />}

      <div className="w-full flex md:flex-row flex-col mt-10 gap-[30px]">
        {/* Campaign image and progress */}
        <div className="flex-1 flex-col">
          <img
            src={state.image}
            alt="campaign"
            className="w-full h-[410px] object-cover rounded-xl"
          />
          <div className="relative w-full h-[5px] bg-[#3a3a43] mt-2">
            <div
              className="absolute h-full bg-[#4acd8d]"
              style={{
                width: `${(state.balance / state.targetAmount) * 100}%`,
                maxWidth: '100%',
              }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]">
          <CountBox
            title={`Raised of ${state.targetAmount} ETH`}
            value={`${state.balance} ETH`}
          />
          <CountBox title="Total Backers" value={contributorsCount} />
          <CountBox title="Min Contribution" value={`${state.minimumContribution} ETH`} />
        </div>
      </div>

      {/* Campaign details and donation */}
      <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
        {/* Creator Info and Description */}
        <div className="flex-[2] flex flex-col gap-[40px]">
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
              Creator
            </h4>
            <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
              <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer">
                <img
                  src={thirdweb}
                  alt="user"
                  className="w-[60%] h-[60%] object-contain"
                />
              </div>
              <div>
                <h4 className="font-epilogue font-semibold text-[14px] text-white break-all">
                  {state.student}
                </h4>
                <p className="mt-[4px] font-epilogue font-normal text-[12px] text-[#808191]">
                  Roll Number: {state.studentRoll}
                </p>
              </div>
            </div>
          </div>

          {/* Campaign Management - Only for campaign owner */}
          {state.student.toLowerCase() === address.toLowerCase() && (
            <div>
              <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
                Campaign Management
              </h4>
              <div className="mt-[20px] flex flex-col sm:flex-row gap-[14px]">
                <CustomButton
                  btnType="button"
                  title="Manage Withdrawals"
                  styles="bg-[#8c6dfd] hover:bg-[#7c5df4] text-white px-6 py-3"
                  handleClick={() => navigate('/withdrawal', { state })}
                />
              </div>
            </div>
          )}

          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
              Story
            </h4>
            <div className="mt-[20px]">
              <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">
                {state.description}
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
              Campaign Stats
            </h4>
            <div className="mt-[20px] flex flex-col gap-4">
              <div className="flex justify-between items-center gap-4">
                <p className="font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px]">
                  Total Contributors:
                </p>
                <p className="font-epilogue font-semibold text-[16px] text-[#8c6dfd] leading-[26px]">
                  {contributorsCount}
                </p>
              </div>
              <div className="flex justify-between items-center gap-4">
                <p className="font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px]">
                  Current Balance:
                </p>
                <p className="font-epilogue font-semibold text-[16px] text-[#8c6dfd] leading-[26px]">
                  {state.balance} ETH
                </p>
              </div>
              <div className="flex justify-between items-center gap-4">
                <p className="font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px]">
                  Withdrawal Requests:
                </p>
                <p className="font-epilogue font-semibold text-[16px] text-[#8c6dfd] leading-[26px]">
                  {state.requestsCount}
                </p>
              </div>
              
              {contributorsCount === 0 && (
                <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify mt-4">
                  No contributors yet. Be the first one to support this campaign!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Fund campaign */}
        <div className="flex-1">
          <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
            Fund
          </h4>
          <div className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
            <p className="font-epilogue font-medium text-[20px] leading-[30px] text-center text-[#808191]">
              Fund the campaign
            </p>
            <div className="mt-[30px]">
              <input
                type="number"
                placeholder="ETH 0.1"
                step="0.01"
                className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <div className="my-[20px] p-4 bg-[#13131a] rounded-[10px]">
                <h4 className="font-epilogue font-semibold text-[14px] leading-[22px] text-white">
                  Back it because you believe in it.
                </h4>
                <p className="mt-[20px] font-epilogue font-normal leading-[22px] text-[#808191]">
                  Support the project for no reward, just because it speaks to you.
                </p>
              </div>

              <CustomButton
                btnType="button"
                title="Fund Campaign"
                styles="w-full bg-[#8c6dfd]"
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
