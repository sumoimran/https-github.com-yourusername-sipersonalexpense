
import React, { useState } from 'react';
import { PlusCircle, Download, TrendingUp, DollarSign, Calendar, Tag } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Food',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [view, setView] = useState('add');

  const categories = ['Food', 'Travel', 'Rent', 'Entertainment', 'Healthcare', 'Shopping', 'Utilities', 'Other'];
  const categoryColors = {
    Food: '#FF6384',
    Travel: '#36A2EB',
    Rent: '#FFCE56',
    Entertainment: '#4BC0C0',
    Healthcare: '#9966FF',
    Shopping: '#FF9F40',
    Utilities: '#FF6384',
    Other: '#C9CBCF'
  };

  const handleSubmit = () => {
    if (formData.amount && formData.description) {
      const newExpense = {
        id: Date.now(),
        ...formData,
        amount: parseFloat(formData.amount)
      };
      setExpenses([...expenses, newExpense]);
      setFormData({
        amount: '',
        category: 'Food',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
    }
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  const getTotalExpenses = () => {
    return expenses.reduce((sum, exp) => sum + exp.amount, 0);
  };

  const getCurrentMonthTotal = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return expenses
      .filter(exp => {
        const expDate = new Date(exp.date);
        return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
      })
      .reduce((sum, exp) => sum + exp.amount, 0);
  };

  const getCategoryData = () => {
    const categoryTotals = {};
    expenses.forEach(exp => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });

    return Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value: parseFloat(value.toFixed(2))
    }));
  };

  const getMonthlyData = () => {
    const monthlyTotals = {};
    expenses.forEach(exp => {
      const month = exp.date.substring(0, 7);
      monthlyTotals[month] = (monthlyTotals[month] || 0) + exp.amount;
    });

    return Object.entries(monthlyTotals)
      .sort()
      .slice(-6)
      .map(([month, total]) => ({
        month,
        total: parseFloat(total.toFixed(2))
      }));
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Category', 'Description', 'Amount'];
    const rows = expenses.map(exp => [
      exp.date,
      exp.category,
      exp.description,
      exp.amount
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Personal Expense Tracker</h1>
              <p className="text-gray-600">Manage your finances with ease</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Created by</p>
              <p className="text-lg font-bold text-blue-600">Sumaiya Imran</p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Expenses</p>
                <p className="text-2xl font-bold text-gray-800">${getTotalExpenses().toFixed(2)}</p>
              </div>
              <DollarSign className="text-blue-500" size={40} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">This Month</p>
                <p className="text-2xl font-bold text-gray-800">${getCurrentMonthTotal().toFixed(2)}</p>
              </div>
              <Calendar className="text-green-500" size={40} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Entries</p>
                <p className="text-2xl font-bold text-gray-800">{expenses.length}</p>
              </div>
              <TrendingUp className="text-purple-500" size={40} />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setView('add')}
              className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                view === 'add' 
                  ? 'border-b-2 border-blue-500 text-blue-500' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <PlusCircle className="inline mr-2" size={20} />
              Add Expense
            </button>
            <button
              onClick={() => setView('list')}
              className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                view === 'list' 
                  ? 'border-b-2 border-blue-500 text-blue-500' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Tag className="inline mr-2" size={20} />
              View Expenses
            </button>
            <button
              onClick={() => setView('stats')}
              className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                view === 'stats' 
                  ? 'border-b-2 border-blue-500 text-blue-500' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <TrendingUp className="inline mr-2" size={20} />
              Statistics
            </button>
          </div>

          {/* Add Expense Form */}
          {view === 'add' && (
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Grocery shopping"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                >
                  Add Expense
                </button>
              </div>
            </div>
          )}

          {/* Expense List */}
          {view === 'list' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">All Expenses</h2>
                <button
                  onClick={exportToCSV}
                  disabled={expenses.length === 0}
                  className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <Download size={18} />
                  Export CSV
                </button>
              </div>

              {expenses.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No expenses yet. Add your first expense!</p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {expenses.sort((a, b) => new Date(b.date) - new Date(a.date)).map(exp => (
                    <div key={exp.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span 
                            className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                            style={{backgroundColor: categoryColors[exp.category]}}
                          >
                            {exp.category}
                          </span>
                          <span className="text-gray-600 text-sm">{exp.date}</span>
                        </div>
                        <p className="mt-1 text-gray-800 font-medium">{exp.description}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xl font-bold text-gray-800">${exp.amount.toFixed(2)}</span>
                        <button
                          onClick={() => deleteExpense(exp.id)}
                          className="text-red-500 hover:text-red-700 font-semibold"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Statistics */}
          {view === 'stats' && (
            <div className="p-6">
              {expenses.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Add some expenses to see statistics!</p>
              ) : (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Spending by Category</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={getCategoryData()}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {getCategoryData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={categoryColors[entry.name]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Monthly Spending Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={getMonthlyData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                        <Legend />
                        <Bar dataKey="total" name="Total Spending" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-white rounded-lg shadow-lg p-4 mt-6 text-center">
          <p className="text-gray-600 text-sm">
            © 2024 <span className="font-semibold text-blue-600">Sumaiya Imran</span> - Your Personal Finance Companion
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExpenseTracker;
