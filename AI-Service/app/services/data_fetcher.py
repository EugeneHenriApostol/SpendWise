import httpx
from typing import Dict, Any, List
from app.core.config import config

class DataFetcher:
    def __init__(self, jwt_token: str):
        self.jwt_token = jwt_token
        self.headers = {
            "Authorization": f"Bearer {jwt_token}",
            "Content-Type": "application/json"
        }
        self.base_url = config.API_BASE_URL

    async def fetch_all_data(self) -> Dict[str, Any]:
        """Fetch all relevant user data from ASP.NET Core APIs"""
        async with httpx.AsyncClient(timeout=30.0) as client:
            try:
                # Use proper async/await pattern
                transactions_resp = await client.get(
                    f"{self.base_url}/api/transaction",
                    headers=self.headers
                )
                budgets_resp = await client.get(
                    f"{self.base_url}/api/budget",
                    headers=self.headers
                )
                categories_resp = await client.get(
                    f"{self.base_url}/api/category",
                    headers=self.headers
                )
                savings_resp = await client.get(
                    f"{self.base_url}/api/savings",
                    headers=self.headers
                )

                # Parse responses
                transactions = transactions_resp.json() if transactions_resp.status_code == 200 else []
                budgets = budgets_resp.json() if budgets_resp.status_code == 200 else []
                categories = categories_resp.json() if categories_resp.status_code == 200 else []
                savings = savings_resp.json() if savings_resp.status_code == 200 else []

                return {
                    "transactions": transactions,
                    "budgets": budgets,
                    "categories": categories,
                    "savings_goals": savings
                }
            except Exception as e:
                print(f"Error fetching data: {e}")
                return {
                    "transactions": [],
                    "budgets": [],
                    "categories": [],
                    "savings_goals": []
                }

    async def fetch_current_month_budget(self) -> Dict:
        """Fetch current month's budget specifically"""
        from datetime import datetime
        month = datetime.now().month
        year = datetime.now().year
        
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                f"{self.base_url}/api/budget/{month}/{year}",
                headers=self.headers
            )
            if resp.status_code == 200:
                return resp.json()
            return {}