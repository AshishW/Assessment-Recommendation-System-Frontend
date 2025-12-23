import React, { useState, useEffect } from "react";
import {
  Search,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Monitor,
  ClipboardList,
  HelpCircle,
  X,
  Clock,
  AlertCircle,
  Info,
} from "lucide-react";

export default function App() {
  const [query, setQuery] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetch("https://assessment-recommendation-engine-0mg0.onrender.com/health")
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.log(error));
  }, []);

  const handleGenerate = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setErrorMessage("");

    const YOUR_API_ENDPOINT =
      "https://assessment-recommendation-engine-0mg0.onrender.com/recommend";

    try {
      const response = await fetch(YOUR_API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: query }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      setRecommendations(data.recommended_assessments || []);
    } catch (error) {
      console.error("API Error:", error);
      setErrorMessage(
        "Failed to connect to the recommendation engine. Please try again later.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans relative text-slate-900">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              Assessment Recommender
            </h1>
            <p className="text-slate-500 text-sm">
              AI-driven insights from the SHL product catalogue.
            </p>
          </div>
          <button
            onClick={() => setIsHelpOpen(true)}
            className="p-2 cursor-pointer rounded-full hover:bg-slate-200 text-slate-400 hover:text-indigo-600 transition-colors"
          >
            <HelpCircle className="h-6 w-6" />
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Describe the role or skills you need to assess..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-slate-50/50"
              />
            </div>
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="cursor-pointer bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 min-w-[200px]"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Generate"
              )}
            </button>
          </div>
          {errorMessage && (
            <div className="mt-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg flex items-center gap-2 text-sm">
              <AlertCircle className="h-4 w-4" />
              {errorMessage}
            </div>
          )}
        </div>

        {recommendations.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="font-semibold text-slate-700 flex items-center gap-2 text-sm uppercase tracking-wider">
                <ClipboardList className="h-4 w-4 text-indigo-500" />{" "}
                Recommended Assessments
              </h2>
              <span className="text-xs font-bold px-2.5 py-1 bg-orange-100 text-orange-700 rounded-md">
                {recommendations.length} MATCHES
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 text-[11px] uppercase tracking-widest font-bold">
                    <th className="px-6 py-4">Assessment</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4 text-center">Remote</th>
                    <th className="px-6 py-4 text-center">Adaptive</th>
                    <th className="px-6 py-4 text-right">Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recommendations.map((item, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="px-6 py-5 max-sm">
                        <div className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors flex items-center gap-2">
                          {item.name}
                          {item.duration && (
                            <span className="flex items-center gap-1 text-[10px] font-medium text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                              <Clock className="h-3 w-3" /> {item.duration}m
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {item.description}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-wrap gap-1">
                          {item.test_type.map((type, tIdx) => (
                            <span
                              key={tIdx}
                              className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-tighter"
                            >
                              {type}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center font-bold text-[10px] uppercase">
                        {item.remote_support === "Yes" ? (
                          <span className="text-emerald-600 flex items-center justify-center gap-1">
                            <CheckCircle2 className="h-4 w-4" /> Supported
                          </span>
                        ) : (
                          <span className="text-slate-300 flex items-center justify-center gap-1">
                            <XCircle className="h-4 w-4" /> No
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-5 text-center font-bold text-[10px] uppercase tracking-tighter">
                        {item.adaptive_support === "Yes" ? (
                          <span className="text-white bg-indigo-600 px-2 py-0.5 rounded">
                            Adaptive
                          </span>
                        ) : (
                          <span className="text-slate-400">Standard</span>
                        )}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-widest bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-all"
                        >
                          View <ExternalLink className="h-3 w-3" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!recommendations.length && !isLoading && (
          <div className="text-center py-24 bg-white rounded-2xl border-2 border-dashed border-slate-200">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Monitor className="h-10 w-10 text-slate-300" />
            </div>
            <h3 className="text-slate-800 font-bold text-xl">
              Ready to analyze
            </h3>
            <p className="text-slate-400 max-w-sm mx-auto mt-2 text-sm">
              Type in your hiring context to find the best match.
            </p>
          </div>
        )}
      </div>

      {isHelpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Info className="h-4 w-4 text-indigo-600" /> System Information
              </h3>
              <button
                onClick={() => setIsHelpOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-8 text-center">
              <h2 className="text-2xl font-black text-slate-900 mb-4 leading-tight">
                What's Assessment Recommendation Engine?
              </h2>
              <p className="text-slate-500 leading-relaxed text-sm">
                This project helps teams find the most effective testing
                assessments based on job requirements, skills, and cultural fit
                from the{" "}
                <a
                  className="text-orange-600 underline"
                  href="https://www.shl.com/products/product-catalog/"
                >
                  SHL catalogue
                </a>
                .
              </p>
              <div className="mt-8">
                <button
                  onClick={() => setIsHelpOpen(false)}
                  className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold uppercase tracking-widest text-sm"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
