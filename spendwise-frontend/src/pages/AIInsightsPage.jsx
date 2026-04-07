// AIInsightsPage.jsx
import { useAuth } from '../context/AuthContext';
import AIInsights from '../components/AIInsights';
import { FiCpu } from 'react-icons/fi';

export default function AIInsightsPage() {
  const { user } = useAuth();
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-[#5409DA] to-[#4E71FF]">
              <FiCpu size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">AI Financial Insights</h1>
              <p className="text-gray-400 mt-1">
                Personalized recommendations powered by AI
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-[#5409DA]/20 to-[#4E71FF]/20 border border-[#4E71FF]/30 rounded-2xl p-5">
        <p className="text-gray-300">
          👋 Welcome back, <span className="text-white font-medium">{user?.email?.split('@')[0]}</span>!
          Our AI analyzes your spending patterns to help you save more and budget smarter.
        </p>
      </div>

      {/* AI Insights Component */}
      <AIInsights month={currentMonth} year={currentYear} />
    </div>
  );
}