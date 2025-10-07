import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, Minus, Sun, Moon, ChevronDown, DollarSign, Globe, BarChart3, Users, Activity } from 'lucide-react';

interface CurrencyData {
  code: string;
  name: string;
  fundamental: 'Buy' | 'Sell' | 'Neutral';
  futures: 'Buy' | 'Sell' | 'Neutral';
  sentiment: 'Buy' | 'Sell' | 'Neutral';
  technical: 'Buy' | 'Sell' | 'Neutral';
  overall: 'Buy' | 'Sell' | 'Neutral';
}

interface EconomicIndicator {
  name: string;
  value: string;
  change: number;
  impact: 'Positive' | 'Negative' | 'Neutral';
}

interface FuturesData {
  week: string;
  value: number;
}

interface SentimentData {
  buy: number;
  sell: number;
}

const ForexTracker: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('EUR');
  const [selectedPair, setSelectedPair] = useState('EURUSD');
  const [fundamentalNotes, setFundamentalNotes] = useState<{ [key: string]: string }>({});
  const [technicalNotes, setTechnicalNotes] = useState<{ [key: string]: string }>({});

  const currencies: CurrencyData[] = [
    { code: 'USD', name: 'US Dollar', fundamental: 'Buy', futures: 'Buy', sentiment: 'Neutral', technical: 'Buy', overall: 'Buy' },
    { code: 'EUR', name: 'Euro', fundamental: 'Sell', futures: 'Sell', sentiment: 'Sell', technical: 'Neutral', overall: 'Sell' },
    { code: 'GBP', name: 'British Pound', fundamental: 'Neutral', futures: 'Buy', sentiment: 'Buy', technical: 'Buy', overall: 'Buy' },
    { code: 'JPY', name: 'Japanese Yen', fundamental: 'Sell', futures: 'Sell', sentiment: 'Neutral', technical: 'Sell', overall: 'Sell' },
    { code: 'CAD', name: 'Canadian Dollar', fundamental: 'Buy', futures: 'Neutral', sentiment: 'Buy', technical: 'Buy', overall: 'Buy' },
    { code: 'AUD', name: 'Australian Dollar', fundamental: 'Neutral', futures: 'Sell', sentiment: 'Sell', technical: 'Neutral', overall: 'Sell' },
    { code: 'NZD', name: 'New Zealand Dollar', fundamental: 'Sell', futures: 'Sell', sentiment: 'Sell', technical: 'Sell', overall: 'Sell' },
    { code: 'CHF', name: 'Swiss Franc', fundamental: 'Buy', futures: 'Buy', sentiment: 'Neutral', technical: 'Buy', overall: 'Buy' },
  ];

  const economicIndicators: { [key: string]: EconomicIndicator[] } = {
    USD: [
      { name: 'GDP', value: '2.5%', change: 0.3, impact: 'Positive' },
      { name: 'Interest Rate', value: '5.25%', change: 0.0, impact: 'Neutral' },
      { name: 'Inflation', value: '3.2%', change: -0.5, impact: 'Positive' },
      { name: 'Trade Balance', value: '-$65B', change: -5, impact: 'Negative' },
      { name: 'Unemployment', value: '3.8%', change: -0.2, impact: 'Positive' },
    ],
    EUR: [
      { name: 'GDP', value: '0.8%', change: -0.2, impact: 'Negative' },
      { name: 'Interest Rate', value: '4.0%', change: 0.0, impact: 'Neutral' },
      { name: 'Inflation', value: '2.9%', change: -0.3, impact: 'Positive' },
      { name: 'Trade Balance', value: '0ac25B', change: 3, impact: 'Positive' },
      { name: 'Unemployment', value: '6.5%', change: 0.1, impact: 'Negative' },
    ],
  };

  const futuresData: { [key: string]: FuturesData[] } = {
    USD: [
      { week: 'W1', value: 105.2 },
      { week: 'W2', value: 105.8 },
      { week: 'W3', value: 106.1 },
      { week: 'W4', value: 106.5 },
      { week: 'W5', value: 107.0 },
    ],
    EUR: [
      { week: 'W1', value: 1.085 },
      { week: 'W2', value: 1.082 },
      { week: 'W3', value: 1.078 },
      { week: 'W4', value: 1.075 },
      { week: 'W5', value: 1.072 },
    ],
  };

  const sentimentData: { [key: string]: SentimentData } = {
    USD: { buy: 65000, sell: 45000 },
    EUR: { buy: 35000, sell: 55000 },
    GBP: { buy: 52000, sell: 38000 },
    JPY: { buy: 28000, sell: 42000 },
    CAD: { buy: 48000, sell: 32000 },
    AUD: { buy: 30000, sell: 45000 },
    NZD: { buy: 25000, sell: 40000 },
    CHF: { buy: 42000, sell: 38000 },
  };

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'Buy':
        return darkMode ? 'text-green-400' : 'text-green-600';
      case 'Sell':
        return darkMode ? 'text-red-400' : 'text-red-600';
      default:
        return darkMode ? 'text-gray-400' : 'text-gray-600';
    }
  };

  const getSignalBg = (signal: string) => {
    switch (signal) {
      case 'Buy':
        return darkMode ? 'bg-green-900/30 border-green-600' : 'bg-green-50 border-green-300';
      case 'Sell':
        return darkMode ? 'bg-red-900/30 border-red-600' : 'bg-red-50 border-red-300';
      default:
        return darkMode ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-300';
    }
  };

  const selectedCurrencyData = currencies.find(c => c.code === selectedCurrency) || currencies[0];
  const currentIndicators = economicIndicators[selectedCurrency] || economicIndicators.USD;
  const currentFuturesData = futuresData[selectedCurrency] || futuresData.USD;
  const currentSentiment = sentimentData[selectedCurrency] || sentimentData.USD;
  const sentimentStrength = currentSentiment.buy / (currentSentiment.buy + currentSentiment.sell) * 100;

  const currencyPairs = ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD', 'NZDUSD', 'USDCHF', 'EURGBP'];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Market Direction Fundamentals Tracker</h1>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Real-time analysis of Forex market fundamentals, futures, sentiment, and technicals</p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-3 rounded-lg transition-colors ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'} shadow-lg`}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        {/* Market Overview */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Market Direction Overview
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {currencies.map((currency) => (
              <button
                key={currency.code}
                onClick={() => setSelectedCurrency(currency.code)}
                className={`p-4 rounded-lg border-2 transition-all ${selectedCurrency === currency.code ? 'ring-2 ring-blue-500' : ''} ${getSignalBg(currency.overall)}`}
              >
                <div className="text-lg font-bold">{currency.code}</div>
                <div className={`text-sm font-medium mt-1 ${getSignalColor(currency.overall)}`}>
                  {currency.overall}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* System Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Fundamental System */}
          <div className={`p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Fundamental System - {selectedCurrency}
            </h3>
            <div className="space-y-3 mb-4">
              {currentIndicators.map((indicator, idx) => (
                <div key={idx} className={`flex justify-between items-center p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <span className="font-medium">{indicator.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm">{indicator.value}</span>
                    <span className={`text-xs px-2 py-1 rounded ${indicator.impact === 'Positive' ? 'bg-green-100 text-green-700' : indicator.impact === 'Negative' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                      {indicator.change > 0 ? '+' : ''}{indicator.change}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <textarea
              value={fundamentalNotes[selectedCurrency] || ''}
              onChange={(e) => setFundamentalNotes({ ...fundamentalNotes, [selectedCurrency]: e.target.value })}
              placeholder="Add your fundamental analysis notes..."
              className={`w-full p-3 rounded-lg resize-none h-24 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'}`}
            />
          </div>

          {/* Futures System */}
          <div className={`p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Futures System - {selectedCurrency}
            </h3>
            <div className="h-48 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={currentFuturesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                  <XAxis dataKey="week" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                  <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                  <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1f2937' : '#ffffff', border: 'none', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className={`p-3 rounded-lg ${getSignalBg(selectedCurrencyData.futures)}`}>
              <div className="flex items-center justify-between">
                <span className="font-medium">Trend Signal:</span>
                <span className={`font-bold ${getSignalColor(selectedCurrencyData.futures)}`}>
                  {selectedCurrencyData.futures}
                </span>
              </div>
            </div>
          </div>

          {/* Sentiment System */}
          <div className={`p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Sentiment System - {selectedCurrency}
            </h3>
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Buy Contracts: {currentSentiment.buy.toLocaleString()}</span>
                <span>Sell Contracts: {currentSentiment.sell.toLocaleString()}</span>
              </div>
              <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-green-500 transition-all duration-500"
                  style={{ width: `${sentimentStrength}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-medium text-white drop-shadow-lg">
                    {sentimentStrength.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-green-900/30' : 'bg-green-50'}`}>
                <div className="text-2xl font-bold text-green-600">{currentSentiment.buy.toLocaleString()}</div>
                <div className="text-sm text-green-600">Buyers</div>
              </div>
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-red-900/30' : 'bg-red-50'}`}>
                <div className="text-2xl font-bold text-red-600">{currentSentiment.sell.toLocaleString()}</div>
                <div className="text-sm text-red-600">Sellers</div>
              </div>
            </div>
          </div>

          {/* Technical System */}
          <div className={`p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Technical System
            </h3>
            <div className="mb-4">
              <div className="relative">
                <select
                  value={selectedPair}
                  onChange={(e) => setSelectedPair(e.target.value)}
                  className={`w-full p-3 rounded-lg appearance-none pr-10 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'}`}
                >
                  {currencyPairs.map(pair => (
                    <option key={pair} value={pair}>{pair}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-4 w-5 h-5 pointer-events-none" />
              </div>
            </div>
            <div className={`h-48 mb-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-center`}>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{selectedPair}</div>
                <div className={`text-lg ${getSignalColor(selectedCurrencyData.technical)}`}>
                  {selectedCurrencyData.technical} Signal
                </div>
                <div className="text-sm mt-2 opacity-60">TradingView Widget Placeholder</div>
              </div>
            </div>
            <textarea
              value={technicalNotes[selectedPair] || ''}
              onChange={(e) => setTechnicalNotes({ ...technicalNotes, [selectedPair]: e.target.value })}
              placeholder="Add technical notes (trendlines, S/R levels, setups)..."
              className={`w-full p-3 rounded-lg resize-none h-20 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'}`}
            />
          </div>
        </div>

        {/* Market Analysis Summary */}
        <div className={`p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className="text-xl font-semibold mb-4">Market Analysis Summary</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <th className="text-left py-3 px-4">Currency</th>
                  <th className="text-center py-3 px-4">Fundamental</th>
                  <th className="text-center py-3 px-4">Futures</th>
                  <th className="text-center py-3 px-4">Sentiment</th>
                  <th className="text-center py-3 px-4">Technical</th>
                  <th className="text-center py-3 px-4">Overall Signal</th>
                </tr>
              </thead>
              <tbody>
                {currencies.map((currency) => (
                  <tr key={currency.code} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <td className="py-3 px-4 font-medium">{currency.name}</td>
                    <td className={`text-center py-3 px-4 font-medium ${getSignalColor(currency.fundamental)}`}>
                      {currency.fundamental}
                    </td>
                    <td className={`text-center py-3 px-4 font-medium ${getSignalColor(currency.futures)}`}>
                      {currency.futures}
                    </td>
                    <td className={`text-center py-3 px-4 font-medium ${getSignalColor(currency.sentiment)}`}>
                      {currency.sentiment}
                    </td>
                    <td className={`text-center py-3 px-4 font-medium ${getSignalColor(currency.technical)}`}>
                      {currency.technical}
                    </td>
                    <td className={`text-center py-3 px-4 font-bold ${getSignalColor(currency.overall)}`}>
                      {currency.overall}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForexTracker;