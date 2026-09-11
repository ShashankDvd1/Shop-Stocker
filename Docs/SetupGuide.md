# Shop-Stocker: Setup Guide — सेटअप गाइड

A step-by-step guide to set up your Shop Stocker system.

---

## What You Need (आवश्यकता)

| Item | Details |
|------|---------|
| Google Account | Gmail account (free) |
| Device | Android phone with Google Sheets app, OR laptop with Chrome browser |
| Internet | One-time internet to set up. After that, works offline too! |
| Time | 5 minutes for setup |

---

## Step-by-Step Setup (सेटअप के कदम)

### Step 1: Create a New Google Sheet

1. Open **Google Sheets** on your phone or laptop
   - Phone: Open the **Google Sheets** app
   - Laptop: Go to [sheets.google.com](https://sheets.google.com)
2. Tap the **+** button to create a new blank spreadsheet

---

### Step 2: Open Apps Script Editor

1. In your new Google Sheet, go to the menu:
   - **Extensions** → **Apps Script**
2. This will open a code editor in a new tab

---

### Step 3: Paste the Setup Script

1. **Delete** any existing code in the editor (select all → delete)
2. Open the file `Scripts/ShopStockerSetup.gs` from this project
3. **Copy all the code** from that file
4. **Paste** it into the Apps Script editor
5. Click the **💾 Save** button (or Ctrl+S)

---

### Step 4: Run the Setup

1. In the Apps Script editor, make sure `setupShopStocker` is selected in the function dropdown (top bar)
2. Click the **▶ Run** button
3. **First time only**: Google will ask for permissions
   - Click **"Review permissions"**
   - Select your Google account
   - Click **"Advanced"** → **"Go to Shop Stocker (unsafe)"**
   - Click **"Allow"**
4. Wait 30–60 seconds — the script will create everything automatically
5. You'll see a success popup: **"✅ Setup Complete!"**

---

### Step 5: Enable Offline Mode (ऑफलाइन मोड)

**On Phone (Google Sheets app):**
1. Open the Google Sheets app
2. Find your "Shop Stocker" spreadsheet
3. Tap the **⋮** (three dots) next to the file name
4. Toggle ON **"Make available offline"**

**On Laptop (Chrome):**
1. Go to [drive.google.com](https://drive.google.com)
2. Click the ⚙️ **Settings** gear icon
3. Check **"Offline"** → enable it
4. The spreadsheet will now work without internet

---

## How to Use Daily (रोज़ कैसे इस्तेमाल करें)

### Logging a Sale (बिक्री दर्ज करना)

```
1. Open the sheet → go to "बिक्री" tab
2. In the next empty row:
   - Column A: Today's date (type it or it auto-fills)
   - Column B: TAP the dropdown → select the product
   - Column C: Type the quantity sold (e.g., 3)
3. Done! Price, total, cost, and profit fill automatically ✅
```

**Time: 5 seconds per entry ⚡**

---

### Logging a Restock (माल आवक दर्ज करना)

When the distributor delivers new stock:

```
1. Open the sheet → go to "माल आवक" tab
2. In the next empty row:
   - Column A: Today's date
   - Column B: TAP the dropdown → select the product
   - Column C: Type the quantity received (e.g., 50)
3. Done! Cost price and total cost fill automatically ✅
```

---

### Viewing Reports (रिपोर्ट देखना)

Just tap the **"डैशबोर्ड"** tab to see:

| Section | What It Shows |
|---------|--------------|
| आज का सारांश | Today's total items sold, revenue, cost, profit |
| टॉप 10 उत्पाद | Top 10 best-selling products |
| स्टॉक अलर्ट | Products that are low or out of stock |
| मासिक लाभ | Monthly revenue, cost, and profit summary |
| सभी उत्पाद स्टॉक | Current stock levels for all products |

---

### Using the Custom Menu (कस्टम मेनू)

After setup, you'll see a **"🛒 Shop Stocker"** menu in the menu bar:

| Menu Item | What It Does |
|-----------|-------------|
| ➕ Log Sale | Jumps to the next empty row in Sales Log |
| 📦 Add Stock | Jumps to the next empty row in Stock In Log |
| 📊 View Dashboard | Opens the Dashboard |
| 🔒 Protect Sheets | Locks formula columns and master sheets |

---

## Adding a New Product (नया उत्पाद जोड़ना)

1. Go to the **"उत्पाद सूची"** tab
2. In the next empty row, fill in:
   - **Column A**: Product name (e.g., "Amul Kool Strawberry 200ml")
   - **Column B**: Category (e.g., "Beverages (पेय)")
   - **Column C**: Cost price — what you pay the distributor (e.g., ₹18)
   - **Column D**: MRP — what the customer pays (e.g., ₹25)
   - **Column F**: Minimum stock alert threshold (e.g., 10)
3. Columns E, G, H, I, J will calculate automatically
4. The product will now appear in the dropdown menus in Sales and Stock In sheets

---

## Sharing with Helpers (हेल्पर्स के साथ शेयर करना)

1. Open the Google Sheet
2. Click the **Share** button (top right)
3. Enter the helper's Gmail address
4. Set permission to **"Editor"**
5. Click **Send**
6. **Important**: After sharing, run **🔒 Protect Sheets** from the Shop Stocker menu to lock formulas and the Product Master

---

## Troubleshooting (समस्या निवारण)

| Problem | Solution |
|---------|---------|
| Dropdown not showing products | Check if "उत्पाद सूची" tab has products in Column A |
| #N/A error in Sales Log | Product name doesn't match — use dropdown, don't type manually |
| Dashboard shows wrong numbers | Check if dates are entered correctly (dd-MMM-yyyy format) |
| Can't edit a cell | The cell might be protected — only the owner can edit formula cells |
| Offline changes not syncing | Open the sheet when you have internet — it will auto-sync |
| Script didn't run | Make sure you selected "setupShopStocker" in the function dropdown |

---

## What NOT to Do (क्या न करें) ⚠️

| ❌ Don't | Why |
|----------|-----|
| Don't type product names manually in Sales/Stock Log | Use the dropdown — typed names may not match and formulas will break |
| Don't edit grey-colored cells | These contain formulas that calculate automatically |
| Don't delete rows in Product Master | This will break references — mark as inactive instead |
| Don't rename the sheet tabs | Formulas reference tab names — renaming will break them |
| Don't sort the Sales or Stock In logs | This may confuse date-based calculations |
