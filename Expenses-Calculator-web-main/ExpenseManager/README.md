# Personal Expense Manager - Local Browser Version

This version does **not require ASP.NET Core, SQL Server, a database, or login**.

## How it works
- All transactions are stored in the browser using `localStorage`.
- Data remains available after closing/reopening the browser on the same device/browser.
- Nothing is sent to a backend server.
- Excel export is handled in the browser using SheetJS.
- The dashboard includes income, expenses, balance, filters, charts, add/edit/delete, custom categories, and Excel export.

## Run
1. Open the `frontend` folder in VS Code.
2. Install the **Live Server** extension by Ritwick Dey.
3. Right-click `index.html` -> **Open with Live Server**, or click **Go Live**.
4. Open the displayed localhost address.

You can also use another static web server. No database setup is needed.

## Excel export
- **Export Excel** downloads all stored transactions.
- **Export Current View** downloads only the transactions matching the selected filters.

## Storage note
The data is stored only in the browser's local storage. Clearing browser site data, using a different browser/device, or private/incognito mode can remove or isolate the data. Use Excel export regularly for backup.
