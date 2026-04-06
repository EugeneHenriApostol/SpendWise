import { useState } from 'react';
import { aiService } from '../services/aiService';
import { FiTrendingUp, FiAlertCircle } from 'react-icons/fi';

export default function AIInsights({ month, year }) {
  const [insights, setInsights] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showInsights, setShowInsights] = useState(false);

  const loadInsights = async () => {
    setLoading(true);
    try {
      const [budgetRecs, financialInsights] = await Promise.all([
        aiService.getBudgetRecommendations(month, year),
        aiService.getFinancialInsights()
      ]);
      setRecommendations(budgetRecs);
      setInsights(financialInsights);
      setShowInsights(true);
    } catch (error) {
      console.error('Failed to load AI insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'text-red-400 bg-red-500/10';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/10';
      default: return 'text-blue-400 bg-blue-500/10';
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
      <div className="p-5 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiLightbulb className="text-[#8DD8FF]" size={20} />
            <h2 className="text-white font-semibold text-lg">AI Insights</h2>
          </div>
          <button
            onClick={loadInsights}
            disabled={loading}
            className="px-4 py-2 bg-gradient-to-r from-[#5409DA] to-[#4E71FF] text-white rounded-lg text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Get AI Insights'}
          </button>
        </div>
        <p className="text-gray-400 text-sm mt-1">
          Personalized recommendations to optimize your finances
        </p>
      </div>

      {showInsights && (
        <div className="p-5 space-y-6">
          {/* Budget Recommendations */}
          {recommendations?.length > 0 && (
            <div>
              <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                <FiTrendingUp size={16} className="text-[#8DD8FF]" />
                Budget Recommendations
              </h3>
              <div className="space-y-3">
                {recommendations.map((rec, idx) => (
                  <div key={idx} className="bg-gray-800/50 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-white font-medium">{rec.category}</span>
                      <span className="text-sm text-[#8DD8FF]">
                        Save ₱{rec.potentialSavings.toLocaleString()}/month
                      </span>
                    </div>
                    <div className="text-sm text-gray-400 mb-2">
                      Current: ₱{rec.currentSpending.toLocaleString()} → 
                      Recommended: ₱{rec.recommendedBudget.toLocaleString()}
                    </div>
                    <p className="text-xs text-gray-500">{rec.reasoning}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Financial Insights */}
          {insights?.length > 0 && (
            <div>
              <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                <FiAlertCircle size={16} className="text-[#8DD8FF]" />
                Financial Insights
              </h3>
              <div className="space-y-3">
                {insights.map((insight, idx) => (
                  <div key={idx} className="bg-gray-800/50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">{insight.title}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(insight.priority)}`}>
                        {insight.priority} Priority
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{insight.description}</p>
                    <div className="text-xs text-gray-500">
                      <span className="text-[#8DD8FF]">Action items:</span>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        {insight.actionItems.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}