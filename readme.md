# 💰 SpendWise - Personal Finance Tracker

A full-stack personal finance management application that helps users track income, expenses, budgets, and savings goals. Built with ASP.NET Core and React.

## ✨ Features

### Dashboard
- 📊 **Summary Cards**: View total income, expenses, net balance, and budget status at a glance
- 📈 **Expense Chart**: Visual breakdown of expenses by category using Recharts
- 📝 **Recent Transactions**: Quick view of latest transactions

### Transactions
- ➕ **Add Income/Expense**: Create transactions with categories and descriptions
- ✏️ **Edit & Delete**: Modify or remove existing transactions
- 🔍 **Search & Filter**: Filter by type, category, date range, and description
- 📅 **Date Selection**: Set transaction date for accurate tracking

### Categories
- 🏷️ **Create Categories**: Organize transactions with custom categories
- 🎨 **Type Support**: Separate categories for Income and Expense
- 📊 **Transaction Count**: See how many transactions use each category

### Budgets
- 🎯 **Monthly Budgets**: Set spending limits for each month
- 📊 **Progress Tracking**: Visual progress bar with real-time spending updates
- 📜 **Budget History**: View past budgets with easy restore
- ⚠️ **Over Budget Alerts**: Color-coded warnings when approaching or exceeding limits

### Savings Goals
- 🏦 **Goal Setting**: Create savings targets with deadlines
- 💸 **Track Contributions**: Add contributions and watch progress grow
- 📈 **Progress Visualization**: See percentage complete and days remaining
- 🎉 **Completion Celebration**: Automatic completion when target is reached

## 🛠️ Tech Stack

### Backend
- **Framework**: ASP.NET Core 8
- **Database**: SQL Server with Entity Framework Core
- **Authentication**: JWT (JSON Web Tokens)
- **Architecture**: Repository Pattern with Dependency Injection
- **API Documentation**: Swagger/OpenAPI

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS v2
- **Charts**: Recharts
- **Icons**: React Icons (Fi icons)
- **Routing**: React Router v6
- **State Management**: React Context API