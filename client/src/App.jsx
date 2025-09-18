import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { Sidebar, Navbar } from './components';
import { Landing, CampaignDetails, CreateCampaign, Home, Profile, Withdrawal, AdminPanel, AllWithdrawals } from './pages';

const App = () => {
  return (
    <div className="relative bg-[#F3F2EC] min-h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:left-0 md:z-50 md:w-64">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:pl-64">
        <Navbar />
        
        <main className="flex-1 px-4 py-4 md:px-6 md:py-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-7xl w-full">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/campaigns" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/create-campaign" element={<CreateCampaign />} />
              <Route path="/campaign-details/:id" element={<CampaignDetails />} />
              <Route path="/withdrawal" element={<Withdrawal />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/all-withdrawals" element={<AllWithdrawals />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App