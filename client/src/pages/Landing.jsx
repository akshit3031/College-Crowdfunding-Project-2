import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomButton } from '../components';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Start Your Campaign",
      description: "Create fundraising campaigns for educational expenses, projects, or emergencies",
      icon: (
        <svg className="w-16 h-16 mx-auto" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="30" fill="#E62727" fillOpacity="0.1"/>
          <path d="M32 8L36.47 24.53L52 20L44.47 32L52 44L36.47 39.47L32 56L27.53 39.47L12 44L19.53 32L12 20L27.53 24.53L32 8Z" fill="#E62727"/>
          <circle cx="32" cy="32" r="6" fill="#E62727"/>
        </svg>
      ),
      action: () => navigate('/create-campaign')
    },
    {
      title: "Support Students",
      description: "Browse and donate to meaningful campaigns from NIT Kurukshetra students",
      icon: (
        <svg className="w-16 h-16 mx-auto" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="30" fill="#1E93AB" fillOpacity="0.1"/>
          <path d="M32 50C40.8366 50 48 42.8366 48 34C48 25.1634 40.8366 18 32 18C23.1634 18 16 25.1634 16 34C16 42.8366 23.1634 50 32 50Z" fill="#1E93AB"/>
          <path d="M32 42C36.4183 42 40 38.4183 40 34C40 29.5817 36.4183 26 32 26C27.5817 26 24 29.5817 24 34C24 38.4183 27.5817 42 32 42Z" fill="white"/>
          <path d="M28 30L30 32L36 26" stroke="#1E93AB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      action: () => navigate('/campaigns')
    },
    {
      title: "Transparent Process",
      description: "All donations are tracked on blockchain with teacher approval for withdrawals",
      icon: (
        <svg className="w-16 h-16 mx-auto" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="30" fill="#1E93AB" fillOpacity="0.1"/>
          <rect x="20" y="22" width="24" height="20" rx="2" fill="#1E93AB"/>
          <rect x="22" y="24" width="20" height="16" rx="1" fill="white"/>
          <circle cx="32" cy="32" r="3" fill="#1E93AB"/>
          <path d="M32 29V35" stroke="#1E93AB" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M29 32H35" stroke="#1E93AB" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M26 18C26 16.8954 26.8954 16 28 16H36C37.1046 16 38 16.8954 38 18V22H26V18Z" fill="#E62727"/>
        </svg>
      ),
      action: () => navigate('/campaigns')
    }
  ];

  const stats = [
    { number: "500+", label: "Students Helped" },
    { number: "₹10L+", label: "Funds Raised" },
    { number: "100+", label: "Active Campaigns" },
    { number: "50+", label: "Teachers Involved" }
  ];

  return (
    <div className="min-h-screen bg-[#F3F2EC] -mx-4 md:-mx-6 lg:-mx-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-20 pb-16">
          <div className="text-center">
            {/* Main Title */}
            <h1 className="text-5xl md:text-7xl font-bold text-[#E62727] mb-6">
              NIT Kurukshetra
            </h1>
            <h2 className="text-3xl md:text-4xl font-semibold text-[#1E93AB] mb-8">
                Blockchain Based Crowdfunding Platform
            </h2>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed">
              Empowering NIT Kurukshetra students through transparent, blockchain-based crowdfunding. 
              Help fellow students achieve their academic dreams and overcome financial challenges.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <CustomButton
                btnType="button"
                title="Start a Campaign"
                styles="bg-[#E62727] hover:bg-[#c91f1f] text-white px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                handleClick={() => navigate('/create-campaign')}
              />
              <CustomButton
                btnType="button"
                title="Browse Campaigns"
                styles="bg-[#1E93AB] hover:bg-[#176a82] text-white px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                handleClick={() => navigate('/campaigns')}
              />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-[#E62727] mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-[#1E93AB] mb-4">
              How It Works
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform makes it easy for students to raise funds and for donors to support education
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-[#F3F2EC] p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border-2 border-transparent hover:border-[#1E93AB]"
                onClick={feature.action}
              >
                <div className="mb-6 text-center">
                  {feature.icon}
                </div>
                <h4 className="text-2xl font-bold text-[#E62727] mb-4 text-center">
                  {feature.title}
                </h4>
                <p className="text-gray-700 text-center leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Purpose Section */}
      <div className="bg-[#DCDCDC] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-[#1E93AB] mb-8">
              Our Purpose
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h4 className="text-2xl font-bold text-[#E62727] mb-6">
                Supporting Student Success
              </h4>
              <div className="space-y-4 text-gray-700">
                <p className="text-lg leading-relaxed">
                  <strong>Educational Expenses:</strong> Help students cover tuition fees, books, lab equipment, and course materials.
                </p>
                <p className="text-lg leading-relaxed">
                  <strong>Project Funding:</strong> Support innovative student projects, research initiatives, and academic competitions.
                </p>
                <p className="text-lg leading-relaxed">
                  <strong>Emergency Support:</strong> Provide assistance during unexpected financial difficulties or family emergencies.
                </p>
                <p className="text-lg leading-relaxed">
                  <strong>Skill Development:</strong> Fund workshops, certifications, and training programs to enhance career prospects.
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h4 className="text-2xl font-bold text-[#1E93AB] mb-6">
                Why Choose Our Platform?
              </h4>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start">
                  <span className="text-[#E62727] font-bold mr-3">✓</span>
                  <span><strong>Blockchain Security:</strong> All transactions are secure and transparent</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#E62727] font-bold mr-3">✓</span>
                  <span><strong>Teacher Verification:</strong> Faculty approval ensures legitimate use of funds</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#E62727] font-bold mr-3">✓</span>
                  <span><strong>Direct Impact:</strong> 100% of donations go directly to students</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#E62727] font-bold mr-3">✓</span>
                  <span><strong>Community Support:</strong> Built by and for NIT Kurukshetra students</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* How to Get Started */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-[#1E93AB] mb-4">
              Get Started Today
            </h3>
            <p className="text-xl text-gray-600">
              Join our community and make a difference
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* For Students */}
            <div className="bg-[#F3F2EC] p-8 rounded-xl shadow-lg">
              <h4 className="text-2xl font-bold text-[#E62727] mb-6">
                For Students Seeking Support
              </h4>
              <ol className="space-y-4 text-gray-700">
                <li className="flex items-start">
                  <span className="bg-[#E62727] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 mt-1">1</span>
                  <span><strong>Create Account:</strong> Connect your wallet and verify your NIT Kurukshetra student status</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-[#E62727] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 mt-1">2</span>
                  <span><strong>Launch Campaign:</strong> Tell your story, set your goal, and provide necessary documentation</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-[#E62727] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 mt-1">3</span>
                  <span><strong>Share & Promote:</strong> Spread the word among friends, family, and the NIT community</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-[#E62727] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 mt-1">4</span>
                  <span><strong>Receive Funds:</strong> Get teacher approval and receive funds directly to your wallet</span>
                </li>
              </ol>
              <div className="mt-8">
                <CustomButton
                  btnType="button"
                  title="Start Your Campaign"
                  styles="bg-[#E62727] hover:bg-[#c91f1f] text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300 w-full"
                  handleClick={() => navigate('/create-campaign')}
                />
              </div>
            </div>

            {/* For Donors */}
            <div className="bg-[#F3F2EC] p-8 rounded-xl shadow-lg">
              <h4 className="text-2xl font-bold text-[#1E93AB] mb-6">
                For Supporters & Donors
              </h4>
              <ol className="space-y-4 text-gray-700">
                <li className="flex items-start">
                  <span className="bg-[#1E93AB] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 mt-1">1</span>
                  <span><strong>Browse Campaigns:</strong> Explore active fundraising campaigns from NIT students</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-[#1E93AB] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 mt-1">2</span>
                  <span><strong>Choose Your Cause:</strong> Find campaigns that resonate with your values and interests</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-[#1E93AB] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 mt-1">3</span>
                  <span><strong>Make a Donation:</strong> Contribute any amount using cryptocurrency securely</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-[#1E93AB] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 mt-1">4</span>
                  <span><strong>Track Impact:</strong> Follow the progress and see how your donation makes a difference</span>
                </li>
              </ol>
              <div className="mt-8">
                <CustomButton
                  btnType="button"
                  title="Browse Campaigns"
                  styles="bg-[#1E93AB] hover:bg-[#176a82] text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300 w-full"
                  handleClick={() => navigate('/campaigns')}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-[#1E93AB] py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-4xl font-bold text-white mb-6">
            Ready to Make a Difference?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of students and supporters who are building a stronger NIT Kurukshetra community
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CustomButton
              btnType="button"
              title="Start Your Campaign"
              styles="bg-[#E62727] hover:bg-[#c91f1f] text-white px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
              handleClick={() => navigate('/create-campaign')}
            />
            <CustomButton
              btnType="button"
              title="Explore Campaigns"
              styles="bg-[#E62727] hover:bg-gray-100 text-[#1E93AB] px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
              handleClick={() => navigate('/campaigns')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;