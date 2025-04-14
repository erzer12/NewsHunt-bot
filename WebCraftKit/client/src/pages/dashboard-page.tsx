import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useAuth } from "@/hooks/use-auth";

export default function DashboardPage() {
  const { user, logoutMutation } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 dark:bg-gray-800 dark:text-gray-100 transition-colors duration-300">
      <Header />

      <main className="flex-grow py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="md:w-1/4">
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 rounded-full bg-primary-100 dark:bg-primary-900/30 mx-auto flex items-center justify-center text-primary-600 dark:text-primary-400 text-4xl font-bold">
                    {user?.fullName ? user.fullName.charAt(0).toUpperCase() : user?.username.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="mt-4 text-xl font-semibold">{user?.fullName || user?.username}</h3>
                  <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
                </div>

                <nav className="space-y-1">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`w-full flex items-center px-4 py-3 rounded-md ${
                      activeTab === "overview"
                        ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab("projects")}
                    className={`w-full flex items-center px-4 py-3 rounded-md ${
                      activeTab === "projects"
                        ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    Projects
                  </button>
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`w-full flex items-center px-4 py-3 rounded-md ${
                      activeTab === "profile"
                        ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile
                  </button>
                  <button
                    onClick={() => setActiveTab("settings")}
                    className={`w-full flex items-center px-4 py-3 rounded-md ${
                      activeTab === "settings"
                        ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-3 rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="md:w-3/4">
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
                {activeTab === "overview" && <DashboardOverview />}
                {activeTab === "projects" && <DashboardProjects />}
                {activeTab === "profile" && <DashboardProfile user={user} />}
                {activeTab === "settings" && <DashboardSettings />}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function DashboardOverview() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-primary-50 dark:bg-primary-900/20 p-6 rounded-lg border border-primary-100 dark:border-primary-800">
          <h3 className="text-lg font-semibold mb-2 text-primary-700 dark:text-primary-300">Active Projects</h3>
          <p className="text-3xl font-bold text-primary-800 dark:text-primary-200">3</p>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-100 dark:border-blue-800">
          <h3 className="text-lg font-semibold mb-2 text-blue-700 dark:text-blue-300">Pending Tasks</h3>
          <p className="text-3xl font-bold text-blue-800 dark:text-blue-200">7</p>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-100 dark:border-green-800">
          <h3 className="text-lg font-semibold mb-2 text-green-700 dark:text-green-300">Completed Tasks</h3>
          <p className="text-3xl font-bold text-green-800 dark:text-green-200">12</p>
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Recent Activities</h3>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <p className="font-medium">New project created</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Today at 10:30 AM</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-medium">Task "Update homepage design" completed</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Yesterday at 4:45 PM</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <div>
              <p className="font-medium">New comment on "E-commerce Project"</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">3 days ago</p>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-4">Upcoming Deadlines</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Project</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Task</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Deadline</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td className="px-4 py-3 whitespace-nowrap">Portfolio Website</td>
                <td className="px-4 py-3 whitespace-nowrap">Finalize design</td>
                <td className="px-4 py-3 whitespace-nowrap">Apr 15, 2023</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">In Progress</span>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 whitespace-nowrap">E-commerce Project</td>
                <td className="px-4 py-3 whitespace-nowrap">Implement payment gateway</td>
                <td className="px-4 py-3 whitespace-nowrap">Apr 18, 2023</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">Not Started</span>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 whitespace-nowrap">Blog Platform</td>
                <td className="px-4 py-3 whitespace-nowrap">Content migration</td>
                <td className="px-4 py-3 whitespace-nowrap">Apr 22, 2023</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Completed</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function DashboardProjects() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Projects</h2>
        <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
          New Project
        </button>
      </div>
      
      <div className="space-y-6">
        {/* Project Card 1 */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold">E-commerce Website</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Created on Apr 5, 2023</p>
              </div>
              <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Active</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              A fully featured e-commerce website with product catalog, shopping cart, and payment processing.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2 py-1 text-xs rounded-md bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">React</span>
              <span className="px-2 py-1 text-xs rounded-md bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">Node.js</span>
              <span className="px-2 py-1 text-xs rounded-md bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">MongoDB</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-sm">
                <span className="font-medium">Progress:</span> 75%
              </div>
              <div className="flex space-x-2">
                <button className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-2">
            <div className="bg-primary-500 h-2" style={{ width: "75%" }}></div>
          </div>
        </div>
        
        {/* Project Card 2 */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold">Portfolio Website</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Created on Mar 20, 2023</p>
              </div>
              <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">In Progress</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Personal portfolio website to showcase projects and skills with a modern, responsive design.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2 py-1 text-xs rounded-md bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">HTML/CSS</span>
              <span className="px-2 py-1 text-xs rounded-md bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">JavaScript</span>
              <span className="px-2 py-1 text-xs rounded-md bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">Tailwind CSS</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-sm">
                <span className="font-medium">Progress:</span> 40%
              </div>
              <div className="flex space-x-2">
                <button className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-2">
            <div className="bg-primary-500 h-2" style={{ width: "40%" }}></div>
          </div>
        </div>
        
        {/* Project Card 3 */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold">Blog Platform</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Created on Feb 15, 2023</p>
              </div>
              <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">Planning</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              A content management system for creating and managing blog posts with categories and tags.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2 py-1 text-xs rounded-md bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">React</span>
              <span className="px-2 py-1 text-xs rounded-md bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">Express</span>
              <span className="px-2 py-1 text-xs rounded-md bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">PostgreSQL</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-sm">
                <span className="font-medium">Progress:</span> 10%
              </div>
              <div className="flex space-x-2">
                <button className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-2">
            <div className="bg-primary-500 h-2" style={{ width: "10%" }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardProfile({ user }: { user: any }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Your Profile</h2>
      
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-shrink-0">
            <div className="w-32 h-32 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 text-5xl font-bold">
              {user?.fullName ? user.fullName.charAt(0).toUpperCase() : user?.username.charAt(0).toUpperCase()}
            </div>
          </div>
          
          <div className="flex-grow">
            <h3 className="text-xl font-semibold">{user?.fullName || user?.username}</h3>
            <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Web developer with a passion for creating beautiful, functional, and user-friendly websites.
            </p>
            
            <div className="mt-4 flex space-x-3">
              <button className="px-4 py-2 border border-primary-500 text-primary-600 dark:text-primary-400 rounded-md hover:bg-primary-50 dark:hover:bg-primary-900/20">
                Edit Profile
              </button>
              <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
                Upload Photo
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
              <p className="font-medium">{user?.fullName || "Not provided"}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Username</p>
              <p className="font-medium">{user?.username}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Account Created</p>
              <p className="font-medium">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Account Settings</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Two-factor Authentication</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security to your account</p>
              </div>
              <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
                Enable
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receive updates and alerts via email</p>
              </div>
              <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
                Manage
              </button>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <button className="text-red-600 dark:text-red-400 hover:underline">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardSettings() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Settings</h2>
      
      <div className="space-y-6">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Password</h3>
          
          <form className="space-y-4">
            <div>
              <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Current Password
              </label>
              <input
                id="current-password"
                type="password"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                New Password
              </label>
              <input
                id="new-password"
                type="password"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm New Password
              </label>
              <input
                id="confirm-password"
                type="password"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Update Password
            </button>
          </form>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Appearance</h3>
          
          <div className="space-y-4">
            <div>
              <p className="font-medium mb-2">Theme</p>
              <div className="flex space-x-4">
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
                  Light
                </button>
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
                  Dark
                </button>
                <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
                  System Default
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Notifications</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receive project updates and alerts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" checked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Project Reminders</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receive reminders about upcoming deadlines</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" checked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Marketing Emails</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receive tips, promotions, and updates</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}