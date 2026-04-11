from typing import Dict, Any
from datetime import datetime, timedelta

class ContextBuilder:
    def __init__(self, user_data: Dict[str, Any]):
        self.transactions = user_data.get("transactions", [])
        self.budgets = user_data.get("budgets", [])
        self.categories = user_data.get("categories", [])
        self.savings_goals = user_data.get("savings_goals", [])
    
    def build_context(self, question_type: str) -> str:
        """Build context based on question type"""
        try:
            if question_type == "save_money":
                return self._build_savings_context()
            elif question_type == "savings_goals":
                return self._build_savings_goals_context()
            elif question_type == "where_money_goes":
                return self._build_spending_context()
            elif question_type == "stick_to_budget":
                return self._build_budget_context()
            elif question_type == "financial_health":
                return self._build_health_context()
            else:
                return self._build_general_context()
        except Exception as e:
            print(f"Error building context: {e}")
            return self._build_general_context()
    
    def _build_spending_context(self) -> str:
        """Context for 'where does my money go' questions - SAFER VERSION"""
        try:
            if not self.transactions:
                return "The user has no transactions recorded yet. They should add some expenses to get spending analysis."
            
            # Get last 3 months of expenses safely
            three_months_ago = datetime.now() - timedelta(days=90)
            
            recent_expenses = []
            category_totals = {}
            
            for t in self.transactions:
                try:
                    if t.get("type") == "Expense":
                        tx_date_str = t.get("date", "2000-01-01")
                        tx_date = datetime.strptime(tx_date_str[:10], "%Y-%m-%d")
                        if tx_date >= three_months_ago:
                            recent_expenses.append(t)
                            cat_id = t.get("categoryId")
                            # Find category name safely
                            cat_name = "Uncategorized"
                            for c in self.categories:
                                if c.get("id") == cat_id:
                                    cat_name = c.get("categoryName", "Uncategorized")
                                    break
                            amount = t.get("amount", 0)
                            category_totals[cat_name] = category_totals.get(cat_name, 0) + amount
                except Exception as e:
                    print(f"Error processing transaction: {e}")
                    continue
            
            total_recent = sum(t.get("amount", 0) for t in recent_expenses)
            
            if total_recent == 0:
                return "The user has no expenses recorded in the last 3 months."
            
            # Build category breakdown string
            category_breakdown = sorted(category_totals.items(), key=lambda x: x[1], reverse=True)
            category_str = "\n".join([f"  - {name}: ₱{amount:,.0f} ({(amount / total_recent * 100):.0f}%)" 
                                       for name, amount in category_breakdown[:8]])
            
            return f"""
SPENDING BREAKDOWN (Last 3 Months):

TOTAL SPENT: ₱{total_recent:,.0f}
NUMBER OF TRANSACTIONS: {len(recent_expenses)}

SPENDING BY CATEGORY:
{category_str}

The user wants to understand where their money is going. Provide a clear breakdown and insights about their spending patterns.
"""
        except Exception as e:
            print(f"Error in _build_spending_context: {e}")
            return f"The user has {len(self.transactions)} transactions recorded. They want to understand their spending patterns."
    
    def _build_savings_context(self) -> str:
        """Context for saving money questions"""
        try:
            total_income = sum(t.get("amount", 0) for t in self.transactions if t.get("type") == "Income")
            total_expenses = sum(t.get("amount", 0) for t in self.transactions if t.get("type") == "Expense")
            
            # Get top spending categories
            category_spending = {}
            for t in self.transactions:
                if t.get("type") == "Expense":
                    cat_id = t.get("categoryId")
                    cat_name = "Uncategorized"
                    for c in self.categories:
                        if c.get("id") == cat_id:
                            cat_name = c.get("categoryName", "Uncategorized")
                            break
                    category_spending[cat_name] = category_spending.get(cat_name, 0) + t.get("amount", 0)
            
            top_categories = sorted(category_spending.items(), key=lambda x: x[1], reverse=True)[:5]
            top_categories_str = "\n".join([f"  - {name}: ₱{amount:,.0f}" for name, amount in top_categories])
            
            # Get current month's budget vs actual
            current_month = datetime.now().month
            current_year = datetime.now().year
            monthly_expenses = 0
            for t in self.transactions:
                if t.get("type") == "Expense":
                    try:
                        tx_date = datetime.strptime(t.get("date", "2000-01-01")[:10], "%Y-%m-%d")
                        if tx_date.month == current_month and tx_date.year == current_year:
                            monthly_expenses += t.get("amount", 0)
                    except:
                        pass
            
            savings_rate = 0
            if total_income > 0:
                savings_rate = (total_income - total_expenses) / total_income * 100
            
            return f"""
USER FINANCIAL SUMMARY:

INCOME & EXPENSES:
- Total Income: ₱{total_income:,.0f}
- Total Expenses: ₱{total_expenses:,.0f}
- Savings Rate: {savings_rate:.0f}%

TOP SPENDING CATEGORIES:
{top_categories_str if top_categories else "  - No expense data available"}

CURRENT MONTH SPENDING: ₱{monthly_expenses:,.0f}

The user wants to save more money. Based on their actual spending data, provide specific, actionable advice.
"""
        except Exception as e:
            print(f"Error in _build_savings_context: {e}")
            return "The user wants to save money. Provide general saving tips."
    
    def _build_savings_goals_context(self) -> str:
        """Context for savings goals questions"""
        try:
            if not self.savings_goals:
                return "The user has no savings goals set yet. They should create their first savings goal."
            
            goals_summary = []
            total_saved = 0
            total_target = 0
            
            for goal in self.savings_goals:
                current = goal.get("currentAmount", 0)
                target = goal.get("targetAmount", 0)
                name = goal.get("name", "Unnamed Goal")
                total_saved += current
                total_target += target
                
                progress = (current / target * 100) if target > 0 else 0
                remaining = target - current
                goals_summary.append(f"  - {name}: ₱{current:,.0f} / ₱{target:,.0f} ({progress:.0f}% complete, ₱{remaining:,.0f} remaining)")
            
            total_income = sum(t.get("amount", 0) for t in self.transactions if t.get("type") == "Income")
            monthly_savings = total_income - sum(t.get("amount", 0) for t in self.transactions if t.get("type") == "Expense")
            
            return f"""
SAVINGS GOALS SUMMARY:

ACTIVE SAVINGS GOALS:
{chr(10).join(goals_summary)}

TOTALS:
- Total Saved: ₱{total_saved:,.0f}
- Total Target: ₱{total_target:,.0f}
- Overall Progress: {(total_saved / total_target * 100) if total_target > 0 else 0:.0f}%

MONTHLY SAVINGS POTENTIAL:
- Monthly Savings: ₱{monthly_savings:,.0f}

The user wants to accomplish their savings goals faster. Provide specific advice on how to accelerate their progress.
"""
        except Exception as e:
            print(f"Error in _build_savings_goals_context: {e}")
            return "The user has savings goals. Provide general advice on saving faster."
    
    def _build_budget_context(self) -> str:
        """Context for budget-related questions"""
        try:
            current_month = datetime.now().month
            current_year = datetime.now().year
            
            # Find current month budget
            current_budget = None
            for b in self.budgets:
                if b.get("month") == current_month and b.get("year") == current_year:
                    current_budget = b
                    break
            
            # Calculate current month spending
            monthly_spending = 0
            for t in self.transactions:
                if t.get("type") == "Expense":
                    try:
                        tx_date = datetime.strptime(t.get("date", "2000-01-01")[:10], "%Y-%m-%d")
                        if tx_date.month == current_month and tx_date.year == current_year:
                            monthly_spending += t.get("amount", 0)
                    except:
                        pass
            
            if current_budget:
                budget_amount = current_budget.get("amount", 0)
                remaining = budget_amount - monthly_spending
                percent_used = (monthly_spending / budget_amount * 100) if budget_amount > 0 else 0
                
                budget_context = f"""
CURRENT MONTH BUDGET:
- Budget Amount: ₱{budget_amount:,.0f}
- Spent So Far: ₱{monthly_spending:,.0f}
- Remaining: ₱{remaining:,.0f}
- Percentage Used: {percent_used:.0f}%
- Status: {"OVER BUDGET" if remaining < 0 else "Within Budget"}
"""
            else:
                budget_context = "No budget set for current month. The user should create a budget to track spending.\n"
            
            return f"""
BUDGET STATUS:

{budget_context}

The user needs help sticking to their budget. Provide practical tips based on their current spending vs budget.
"""
        except Exception as e:
            print(f"Error in _build_budget_context: {e}")
            return "The user wants help with budgeting. Provide general budgeting tips."
    
    def _build_health_context(self) -> str:
        """Context for financial health checkup"""
        try:
            total_income = sum(t.get("amount", 0) for t in self.transactions if t.get("type") == "Income")
            total_expenses = sum(t.get("amount", 0) for t in self.transactions if t.get("type") == "Expense")
            
            savings_rate = 0
            if total_income > 0:
                savings_rate = (total_income - total_expenses) / total_income * 100
            
            # Count savings goals
            goals_count = len(self.savings_goals)
            goals_completed = sum(1 for g in self.savings_goals if g.get("isCompleted", False))
            
            # Budget compliance
            current_month = datetime.now().month
            current_year = datetime.now().year
            has_budget = any(b.get("month") == current_month and b.get("year") == current_year for b in self.budgets)
            
            # Determine health rating
            if savings_rate >= 20:
                health_rating = "Excellent"
            elif savings_rate >= 10:
                health_rating = "Good"
            elif total_income > 0:
                health_rating = "Needs Improvement"
            else:
                health_rating = "Data Insufficient"
            
            return f"""
FINANCIAL HEALTH CHECKUP:

INCOME & SAVINGS:
- Total Income: ₱{total_income:,.0f}
- Total Expenses: ₱{total_expenses:,.0f}
- Savings Rate: {savings_rate:.0f}%
- Health Rating: {health_rating}

SAVINGS GOALS:
- Active Goals: {goals_count}
- Completed Goals: {goals_completed}

BUDGET STATUS:
- Has Budget: {"Yes" if has_budget else "No"}

The user requested a complete financial health checkup. Provide an overall assessment and actionable recommendations.
"""
        except Exception as e:
            print(f"Error in _build_health_context: {e}")
            return "The user wants a financial health checkup. Provide general financial health advice."
    
    def _build_general_context(self) -> str:
        """General context for uncategorized questions"""
        try:
            total_income = sum(t.get("amount", 0) for t in self.transactions if t.get("type") == "Income")
            total_expenses = sum(t.get("amount", 0) for t in self.transactions if t.get("type") == "Expense")
            transaction_count = len(self.transactions)
            
            return f"""
USER FINANCIAL OVERVIEW:
- Total Transactions: {transaction_count}
- Total Income: ₱{total_income:,.0f}
- Total Expenses: ₱{total_expenses:,.0f}
- Net Savings: ₱{total_income - total_expenses:,.0f}

Provide helpful financial advice based on this data.
"""
        except Exception as e:
            print(f"Error in _build_general_context: {e}")
            return "The user has a personal finance app. Provide general financial advice."