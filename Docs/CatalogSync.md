# Amul Catalog Sync Guide

This guide explains how the "Update Catalog" feature works in the Shop-Stocker system, allowing you to keep your village shops up-to-date with the latest Amul products while keeping them 100% offline for daily operations.

## How It Works

The Shop-Stocker Google Sheet contains a custom menu: **Shop Menu > 🔄 Update Catalog (Requires Internet)**.
When clicked, the script briefly connects to the internet to fetch a **Master CSV File** that you (the owner/manager) maintain centrally. It checks if there are any new products, and if so, it automatically adds them to the bottom of the "उत्पाद सूची" (Product Master) sheet and sets up all the necessary formulas.

### Important Rules:
1. **No Overwrites**: The script will only **ADD** new products. It will **never** overwrite existing prices. This protects the shopkeeper's local Cost Price and MRP, ensuring their profit margins on existing inventory aren't ruined if Amul raises prices.
2. **Internet Required**: The shopkeeper only needs an internet connection (via mobile hotspot or wifi) for the 5 seconds it takes to run this script once a month.

---

## How to Maintain the Master CSV (For Managers)

To push updates to all your village shops, you just need to update one central file.

### Step 1: Host the CSV
1. Create a public repository on GitHub (or use a direct download link from Google Drive or AWS S3).
2. The default URL configured in the script is:
   `https://raw.githubusercontent.com/ShashankDvd1/Shop-Stocker/main/amul_catalog_updates.csv`
   *(You can change this in `ShopStockerSetup.gs` line 805).*

### Step 2: Format the CSV
Your CSV file MUST have exactly 5 columns, comma-separated, with a header row.
```csv
Product Name,Category,Cost Price,MRP,Min Stock
Amul New Pizza 400g,Bakery, Protein & Frozen Snacks (बेकरी & स्नेक्स),120,150,5
Amul Dark Choco New 100g,Chocolates (चॉकलेट),80,100,10
```

### Step 3: Pushing an Update
Whenever Amul releases a new product:
1. Edit the `amul_catalog_updates.csv` file to add the new row(s).
2. Save the file.
3. Tell your village shopkeepers: *"Connect to the internet and click 'Update Catalog' in your menu."*

They will instantly receive the new products in their local offline system!

---

## Troubleshooting

- **Error: "Could not connect to the internet"**: The shopkeeper must ensure their device is actually connected to Wi-Fi or a hotspot before clicking the button.
- **Notice: "No updates found"**: The script successfully connected, but all products in the remote CSV are already present in their local sheet.
- **Duplicates**: The script checks the exact Product Name (case-insensitive). If a shopkeeper manually added "amul pizza" and the central CSV pushes "Amul Pizza", it will not duplicate. However, if the shopkeeper misspelled it as "Ammul Pizza", it will be added again.
