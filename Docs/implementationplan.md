# Shop-Stocker: Monthly Catalog Sync Feature

This plan outlines the architecture and implementation for adding an "Update Products (Internet Required)" feature to the Shop-Stocker Google Sheet. This allows the village shopkeeper to briefly connect to the internet once a month to pull down any new Amul products or MRP updates, while remaining 100% offline for daily operations.

## User Review Required
> [!IMPORTANT]
> **Data Source for Updates**: Since the official Amul website blocks automated bots (like Google Sheets), the script needs to fetch from a centralized list that you (the owner/manager) maintain. I will configure the script to fetch a **Public CSV link**. You can host this CSV on GitHub or a Google Drive link, and update that CSV whenever Amul releases new products. Does this approach work for you?

> [!WARNING]
> **Price Overwrites**: If the sync detects a price change for an existing product, should it **overwrite** the shopkeeper's local Cost Price/MRP? Overwriting might mess up profit margins for older stock they haven't sold yet. 
> *Recommendation*: The script will only **ADD NEW** products that are missing from the sheet. It will not touch existing product rows so the shopkeeper's local pricing is safe. (Let me know if you prefer it to update prices too).

## Proposed Changes

### 1. `ShopStockerSetup.gs`

#### [MODIFY] [ShopStockerSetup.gs](file:///e:/PM_Portfolio_Projects/Shop-Stocker/Scripts/ShopStockerSetup.gs)
- **Add Menu Item**: Update `onOpen()` to include a new menu option: `"🔄 Update Catalog (Requires Internet)"` linked to a new function `syncCatalog()`.
- **Implement `syncCatalog()`**:
  - Show a confirmation dialog: "This will connect to the internet to check for new Amul products. Proceed?"
  - Use `UrlFetchApp.fetch(SYNC_URL)` to download a central CSV file.
  - Parse the CSV and compare it against the current "Product Master" (उत्पाद सूची) sheet.
  - Identify any products in the CSV that do not exist in column A of the sheet.
  - Append the new products to the bottom of the "Product Master" sheet and auto-fill the required formulas (Profit, Total Stock In, Total Sold, Current Stock).
  - Display a success message: "Sync Complete! X new products added."

### 2. Documentation

#### [NEW] `Docs/CatalogSync.md`
- Documentation explaining how the Sync feature works.
- Instructions for the manager on how to update the central CSV file so that all village shops get the updates.

## Verification Plan

### Automated Tests
- Use `validate.js` to ensure the new Apps Script functions are syntactically correct and don't break existing formula generation.

### Manual Verification
- Simulate a sync by creating a mock CSV with 2 new products and verifying the script appends them correctly without duplicating existing products.
