/**
 * Shop-Stocker: Google Sheets Auto-Setup Script
 * =============================================
 * 
 * HOW TO USE:
 * 1. Open a NEW blank Google Sheet
 * 2. Go to Extensions → Apps Script
 * 3. Delete any existing code and paste this entire script
 * 4. Click ▶ Run → select "setupShopStocker"
 * 5. Grant permissions when prompted
 * 6. Wait 30-60 seconds — your entire system will be ready!
 * 
 * This script creates:
 * - उत्पाद सूची (Product Master) — with 50+ Amul products pre-loaded
 * - बिक्री (Sales Log) — for logging daily sales
 * - माल आवक (Stock In Log) — for logging restocks
 * - डैशबोर्ड (Dashboard) — auto-calculating reports
 */

// ============================================================
// MAIN SETUP FUNCTION — Run this one!
// ============================================================
function setupShopStocker() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.rename("Shop Stocker — दुकान स्टॉकर");
  
  // Delete default sheet later (after creating others)
  const defaultSheet = ss.getSheetByName("Sheet1");
  
  // Create all sheets
  const productMaster = createProductMasterSheet(ss);
  const salesLog = createSalesLogSheet(ss);
  const stockInLog = createStockInLogSheet(ss);
  const dashboard = createDashboardSheet(ss);
  
  // Load sample products
  loadSampleProducts(productMaster);
  
  // Prefill Stock In Log with all product names (leave Quantity blank for shopkeeper)
  prefillStockInProducts(stockInLog, productMaster);
  
  // Set up data validation (dropdowns) — must be after products are loaded
  setupDataValidation(ss, productMaster, salesLog, stockInLog);
  
  // Set up conditional formatting
  setupConditionalFormatting(productMaster, dashboard);
  
  // Delete default sheet if it exists
  if (defaultSheet) {
    ss.deleteSheet(defaultSheet);
  }
  
  // Reorder sheets
  productMaster.activate();
  ss.moveActiveSheet(1);
  salesLog.activate();
  ss.moveActiveSheet(2);
  stockInLog.activate();
  ss.moveActiveSheet(3);
  dashboard.activate();
  ss.moveActiveSheet(4);
  
  // Set Sales Log as the default view (most used)
  salesLog.activate();
  
  SpreadsheetApp.getUi().alert(
    "✅ Setup Complete! — सेटअप पूरा हुआ!\n\n" +
    "Your Shop Stocker system is ready.\n" +
    "• बिक्री (Sales Log) — Log your daily sales here\n" +
    "• माल आवक (Stock In) — Log restocks here\n" +
    "• डैशबोर्ड (Dashboard) — View reports here\n\n" +
    "Start by adding initial stock in the माल आवक tab!"
  );
}

// ============================================================
// SHEET 1: PRODUCT MASTER — उत्पाद सूची
// ============================================================
function createProductMasterSheet(ss) {
  let sheet = ss.getSheetByName("उत्पाद सूची");
  if (!sheet) {
    sheet = ss.insertSheet("उत्पाद सूची");
  }
  
  // Headers
  const headers = [
    ["उत्पाद का नाम\nProduct Name", "श्रेणी\nCategory", "खरीद मूल्य (₹)\nCost Price", 
     "बिक्री मूल्य (₹)\nSelling Price", "प्रति इकाई लाभ (₹)\nProfit/Unit", 
     "न्यूनतम स्टॉक\nMin Stock", "कुल स्टॉक इन\nTotal Stocked In", 
     "कुल बिक्री\nTotal Sold", "मौजूदा स्टॉक\nCurrent Stock", "स्थिति\nStatus"]
  ];
  
  sheet.getRange(1, 1, 1, 10).setValues(headers);
  
  // Header formatting
  const headerRange = sheet.getRange(1, 1, 1, 10);
  headerRange.setBackground("#1a237e")
             .setFontColor("#ffffff")
             .setFontWeight("bold")
             .setFontSize(10)
             .setWrap(true)
             .setVerticalAlignment("middle")
             .setHorizontalAlignment("center");
  
  // Set column widths
  sheet.setColumnWidth(1, 200);  // Product Name
  sheet.setColumnWidth(2, 130);  // Category
  sheet.setColumnWidth(3, 110);  // Cost Price
  sheet.setColumnWidth(4, 110);  // Selling Price
  sheet.setColumnWidth(5, 110);  // Profit/Unit
  sheet.setColumnWidth(6, 100);  // Min Stock
  sheet.setColumnWidth(7, 120);  // Total Stocked In
  sheet.setColumnWidth(8, 100);  // Total Sold
  sheet.setColumnWidth(9, 110);  // Current Stock
  sheet.setColumnWidth(10, 130); // Status
  
  // Freeze header row
  sheet.setFrozenRows(1);
  
  // Set row height for header
  sheet.setRowHeight(1, 50);
  
  // Currency format for price columns
  sheet.getRange("C:C").setNumberFormat("₹#,##0.00");
  sheet.getRange("D:D").setNumberFormat("₹#,##0.00");
  sheet.getRange("E:E").setNumberFormat("₹#,##0.00");
  
  // Set tab color
  sheet.setTabColor("#1a237e");
  
  return sheet;
}

// ============================================================
// SHEET 2: SALES LOG — बिक्री
// ============================================================
function createSalesLogSheet(ss) {
  let sheet = ss.getSheetByName("बिक्री");
  if (!sheet) {
    sheet = ss.insertSheet("बिक्री");
  }
  
  // Headers
  const headers = [
    ["तारीख\nDate", "उत्पाद का नाम\nProduct Name", "मात्रा\nQuantity", 
     "बिक्री मूल्य (₹)\nSelling Price", "कुल राशि (₹)\nTotal Amount", 
     "लागत मूल्य (₹)\nCost Price", "कुल लागत (₹)\nTotal Cost", "लाभ (₹)\nProfit"]
  ];
  
  sheet.getRange(1, 1, 1, 8).setValues(headers);
  
  // Header formatting
  const headerRange = sheet.getRange(1, 1, 1, 8);
  headerRange.setBackground("#2e7d32")
             .setFontColor("#ffffff")
             .setFontWeight("bold")
             .setFontSize(10)
             .setWrap(true)
             .setVerticalAlignment("middle")
             .setHorizontalAlignment("center");
  
  // Set column widths
  sheet.setColumnWidth(1, 120);  // Date
  sheet.setColumnWidth(2, 200);  // Product Name
  sheet.setColumnWidth(3, 80);   // Quantity
  sheet.setColumnWidth(4, 120);  // Selling Price
  sheet.setColumnWidth(5, 120);  // Total Amount
  sheet.setColumnWidth(6, 120);  // Cost Price
  sheet.setColumnWidth(7, 120);  // Total Cost
  sheet.setColumnWidth(8, 120);  // Profit
  
  // Add formulas for rows 2–500 in batch (for maximum speed)
  const salesFormulas = [];
  for (let i = 2; i <= 500; i++) {
    salesFormulas.push([
      `=IF(B${i}="","",VLOOKUP(B${i},'उत्पाद सूची'!A:D,4,FALSE))`,
      `=IF(B${i}="","",C${i}*D${i})`,
      `=IF(B${i}="","",VLOOKUP(B${i},'उत्पाद सूची'!A:C,3,FALSE))`,
      `=IF(B${i}="","",C${i}*F${i})`,
      `=IF(B${i}="","",E${i}-G${i})`
    ]);
  }
  sheet.getRange(2, 4, 499, 5).setFormulas(salesFormulas);
  
  // Grey out formula columns (D-H)
  sheet.getRange("D2:H500").setBackground("#f5f5f5");
  
  // Freeze header row
  sheet.setFrozenRows(1);
  sheet.setRowHeight(1, 50);
  
  // Currency format
  sheet.getRange("D:D").setNumberFormat("₹#,##0.00");
  sheet.getRange("E:E").setNumberFormat("₹#,##0.00");
  sheet.getRange("F:F").setNumberFormat("₹#,##0.00");
  sheet.getRange("G:G").setNumberFormat("₹#,##0.00");
  sheet.getRange("H:H").setNumberFormat("₹#,##0.00");
  
  // Date format
  sheet.getRange("A:A").setNumberFormat("dd-MMM-yyyy");
  
  // Set tab color
  sheet.setTabColor("#2e7d32");
  
  return sheet;
}

// ============================================================
// SHEET 3: STOCK IN LOG — माल आवक
// ============================================================
function createStockInLogSheet(ss) {
  let sheet = ss.getSheetByName("माल आवक");
  if (!sheet) {
    sheet = ss.insertSheet("माल आवक");
  }
  
  // Headers
  const headers = [
    ["तारीख\nDate", "उत्पाद का नाम\nProduct Name", "मात्रा\nQuantity", 
     "खरीद मूल्य (₹)\nCost Price", "कुल लागत (₹)\nTotal Cost"]
  ];
  
  sheet.getRange(1, 1, 1, 5).setValues(headers);
  
  // Header formatting
  const headerRange = sheet.getRange(1, 1, 1, 5);
  headerRange.setBackground("#e65100")
             .setFontColor("#ffffff")
             .setFontWeight("bold")
             .setFontSize(10)
             .setWrap(true)
             .setVerticalAlignment("middle")
             .setHorizontalAlignment("center");
  
  // Set column widths
  sheet.setColumnWidth(1, 120);  // Date
  sheet.setColumnWidth(2, 200);  // Product Name
  sheet.setColumnWidth(3, 80);   // Quantity
  sheet.setColumnWidth(4, 120);  // Cost Price
  sheet.setColumnWidth(5, 120);  // Total Cost
  
  // Add formulas for rows 2–500 in batch (for maximum speed)
  const stockInFormulas = [];
  for (let i = 2; i <= 500; i++) {
    stockInFormulas.push([
      `=IF(B${i}="","",VLOOKUP(B${i},'उत्पाद सूची'!A:C,3,FALSE))`,
      `=IF(B${i}="","",C${i}*D${i})`
    ]);
  }
  sheet.getRange(2, 4, 499, 2).setFormulas(stockInFormulas);
  
  // Grey out formula columns (D-E)
  sheet.getRange("D2:E500").setBackground("#f5f5f5");
  
  // Freeze header row
  sheet.setFrozenRows(1);
  sheet.setRowHeight(1, 50);
  
  // Currency format
  sheet.getRange("D:D").setNumberFormat("₹#,##0.00");
  sheet.getRange("E:E").setNumberFormat("₹#,##0.00");
  
  // Date format
  sheet.getRange("A:A").setNumberFormat("dd-MMM-yyyy");
  
  // Set tab color
  sheet.setTabColor("#e65100");
  
  return sheet;
}

// ============================================================
// SHEET 4: DASHBOARD — डैशबोर्ड
// ============================================================
function createDashboardSheet(ss) {
  let sheet = ss.getSheetByName("डैशबोर्ड");
  if (!sheet) {
    sheet = ss.insertSheet("डैशबोर्ड");
  }
  
  // Set column widths for layout
  sheet.setColumnWidth(1, 30);   // Spacer
  sheet.setColumnWidth(2, 220);  // Labels
  sheet.setColumnWidth(3, 150);  // Values
  sheet.setColumnWidth(4, 30);   // Spacer
  sheet.setColumnWidth(5, 220);  // Labels
  sheet.setColumnWidth(6, 150);  // Values
  sheet.setColumnWidth(7, 30);   // Spacer
  
  // ---- TITLE ----
  sheet.getRange("B1").setValue("📊 डैशबोर्ड — Shop Stocker Dashboard");
  sheet.getRange("B1:F1").merge()
       .setFontSize(16).setFontWeight("bold")
       .setBackground("#1a237e").setFontColor("#ffffff")
       .setHorizontalAlignment("center");
  sheet.setRowHeight(1, 45);
  
  // ---- SECTION 1: TODAY'S SUMMARY ----
  sheet.getRange("B3").setValue("📅 आज का सारांश — Today's Summary");
  sheet.getRange("B3:C3").merge()
       .setFontSize(12).setFontWeight("bold")
       .setBackground("#e8eaf6").setFontColor("#1a237e");
  
  sheet.getRange("B4").setValue("आज की तारीख (Today's Date)");
  sheet.getRange("C4").setFormula('=TODAY()').setNumberFormat("dd-MMM-yyyy");
  
  sheet.getRange("B5").setValue("कुल बिक्री आइटम (Items Sold Today)");
  sheet.getRange("C5").setFormula(
    '=SUMPRODUCT((\'बिक्री\'!A$2:A$500=TODAY())*(\'बिक्री\'!C$2:C$500))'
  );
  
  sheet.getRange("B6").setValue("कुल आय (Revenue Today) ₹");
  sheet.getRange("C6").setFormula(
    '=SUMPRODUCT((\'बिक्री\'!A$2:A$500=TODAY())*(\'बिक्री\'!E$2:E$500))'
  ).setNumberFormat("₹#,##0.00");
  
  sheet.getRange("B7").setValue("कुल लागत (Cost Today) ₹");
  sheet.getRange("C7").setFormula(
    '=SUMPRODUCT((\'बिक्री\'!A$2:A$500=TODAY())*(\'बिक्री\'!G$2:G$500))'
  ).setNumberFormat("₹#,##0.00");
  
  sheet.getRange("B8").setValue("आज का लाभ (Today's Profit) ₹");
  sheet.getRange("C8").setFormula('=C6-C7').setNumberFormat("₹#,##0.00");
  sheet.getRange("B8:C8").setFontWeight("bold").setFontSize(11);
  
  // Style the summary values
  sheet.getRange("C4:C8").setHorizontalAlignment("right").setFontSize(11);
  sheet.getRange("B4:B8").setFontSize(10);
  
  // Add border
  sheet.getRange("B3:C8").setBorder(true, true, true, true, false, false, "#1a237e", SpreadsheetApp.BorderStyle.SOLID);
  
  // ---- SECTION 2: TOP SELLERS (Right side) ----
  sheet.getRange("E3").setValue("🏆 टॉप 10 उत्पाद — Top 10 Products");
  sheet.getRange("E3:F3").merge()
       .setFontSize(12).setFontWeight("bold")
       .setBackground("#e8f5e9").setFontColor("#2e7d32");
  
  sheet.getRange("E4").setValue("उत्पाद (Product)").setFontWeight("bold");
  sheet.getRange("F4").setValue("कुल बिक्री (Total Sold)").setFontWeight("bold");
  
  // Top 10 using QUERY
  sheet.getRange("E5").setFormula(
    '=IFERROR(QUERY(\'बिक्री\'!B$2:C$500, "SELECT B, SUM(C) WHERE B <>\'\' GROUP BY B ORDER BY SUM(C) DESC LIMIT 10 LABEL SUM(C) \'\'"), "No sales yet")'
  );
  
  sheet.getRange("E3:F14").setBorder(true, true, true, true, false, false, "#2e7d32", SpreadsheetApp.BorderStyle.SOLID);
  
  // ---- SECTION 3: STOCK ALERTS ----
  const stockStartRow = 11;
  sheet.getRange("B" + stockStartRow).setValue("⚠️ स्टॉक अलर्ट — Stock Alerts (Low & Out of Stock)");
  sheet.getRange("B" + stockStartRow + ":C" + stockStartRow).merge()
       .setFontSize(12).setFontWeight("bold")
       .setBackground("#fff3e0").setFontColor("#e65100");
  
  sheet.getRange("B" + (stockStartRow + 1)).setValue("उत्पाद (Product)").setFontWeight("bold");
  sheet.getRange("C" + (stockStartRow + 1)).setValue("मौजूदा स्टॉक (Stock)").setFontWeight("bold");
  
  // Stock alerts — products with low or out of stock
  sheet.getRange("B" + (stockStartRow + 2)).setFormula(
    '=IFERROR(QUERY(\'उत्पाद सूची\'!A$2:J$300, "SELECT A, I WHERE I <= F ORDER BY I ASC", 0), "All stock OK! ✅")'
  );
  
  sheet.getRange("B" + stockStartRow + ":C" + (stockStartRow + 15)).setBorder(true, true, true, true, false, false, "#e65100", SpreadsheetApp.BorderStyle.SOLID);
  
  // ---- SECTION 4: MONTHLY PROFIT ----
  const monthlyStartRow = 28;
  sheet.getRange("B" + monthlyStartRow).setValue("📅 मासिक लाभ सारांश — Monthly Profit Summary");
  sheet.getRange("B" + monthlyStartRow + ":F" + monthlyStartRow).merge()
       .setFontSize(12).setFontWeight("bold")
       .setBackground("#e8eaf6").setFontColor("#1a237e");
  
  const monthHeaders = [["महीना\nMonth", "कुल आय (₹)\nRevenue", "कुल लागत (₹)\nCost", "कुल लाभ (₹)\nProfit", "लाभ %\nMargin"]];
  sheet.getRange(monthlyStartRow + 1, 2, 1, 5).setValues(monthHeaders)
       .setFontWeight("bold").setBackground("#c5cae9").setHorizontalAlignment("center");
  
  // Monthly summary using QUERY
  sheet.getRange("B" + (monthlyStartRow + 2)).setFormula(
    '=IFERROR(QUERY({EOMONTH(\'बिक्री\'!A$2:A$500,0), \'बिक्री\'!E$2:E$500, \'बिक्री\'!G$2:G$500, \'बिक्री\'!H$2:H$500}, "SELECT Col1, SUM(Col2), SUM(Col3), SUM(Col4) WHERE Col1 IS NOT NULL GROUP BY Col1 ORDER BY Col1 DESC LABEL Col1 \'\', SUM(Col2) \'\', SUM(Col3) \'\', SUM(Col4) \'\'", 0), "No data yet")'
  );
  
  // Format monthly dates and currency
  sheet.getRange("B" + (monthlyStartRow + 2) + ":B" + (monthlyStartRow + 14)).setNumberFormat("MMM yyyy");
  sheet.getRange("C" + (monthlyStartRow + 2) + ":E" + (monthlyStartRow + 14)).setNumberFormat("₹#,##0.00");
  
  // Profit margin % formula for rows
  for (let i = monthlyStartRow + 2; i <= monthlyStartRow + 14; i++) {
    sheet.getRange("F" + i).setFormula(
      `=IF(C${i}="","",IFERROR(E${i}/C${i}*100, 0))`
    ).setNumberFormat("0.0\"%\"");
  }
  
  sheet.getRange("B" + monthlyStartRow + ":F" + (monthlyStartRow + 14)).setBorder(true, true, true, true, false, false, "#1a237e", SpreadsheetApp.BorderStyle.SOLID);
  
  // ---- SECTION 5: ALL STOCK LEVELS ----
  const allStockRow = 17;
  sheet.getRange("E" + allStockRow).setValue("📦 सभी उत्पाद स्टॉक — All Product Stock");
  sheet.getRange("E" + allStockRow + ":F" + allStockRow).merge()
       .setFontSize(12).setFontWeight("bold")
       .setBackground("#e0f2f1").setFontColor("#00695c");
  
  sheet.getRange("E" + (allStockRow + 1)).setValue("उत्पाद (Product)").setFontWeight("bold");
  sheet.getRange("F" + (allStockRow + 1)).setValue("मौजूदा स्टॉक (Stock)").setFontWeight("bold");
  
  // All stock levels from Product Master
  sheet.getRange("E" + (allStockRow + 2)).setFormula(
    '=IFERROR(QUERY(\'उत्पाद सूची\'!A$2:I$300, "SELECT A, I WHERE A <>\'\' ORDER BY I ASC", 0), "No products yet")'
  );
  
  sheet.getRange("E" + allStockRow + ":F" + (allStockRow + 150)).setBorder(true, true, true, true, false, false, "#00695c", SpreadsheetApp.BorderStyle.SOLID);
  
  // Freeze title row
  sheet.setFrozenRows(1);
  
  // Set tab color
  sheet.setTabColor("#1a237e");
  
  // Protect dashboard
  const protection = sheet.protect().setDescription("Dashboard — View Only for Helpers");
  protection.setWarningOnly(true);
  
  return sheet;
}

// ============================================================
// LOAD SAMPLE AMUL PRODUCTS
// ============================================================
function loadSampleProducts(sheet) {
  const products = [
    // [Product Name, Category, Cost Price, MRP, Min Stock]
    
    // === 1. MILK (दूध) ===
    ["Amul Taaza 500ml", "Milk (दूध)", 22, 27, 10],
    ["Amul Taaza 1L", "Milk (दूध)", 44, 54, 10],
    ["Amul Gold 500ml", "Milk (दूध)", 28, 34, 10],
    ["Amul Gold 1L", "Milk (दूध)", 55, 66, 10],
    ["Amul Shakti 500ml", "Milk (दूध)", 24, 29, 8],
    ["Amul Shakti 1L", "Milk (दूध)", 46, 56, 8],
    ["Amul Slim n Trim 500ml", "Milk (दूध)", 24, 29, 5],
    ["Amul Cow Milk 500ml", "Milk (दूध)", 23, 28, 8],
    ["Amul Cow Milk 1L", "Milk (दूध)", 46, 56, 8],
    ["Amul A2 Buffalo Milk 500ml", "Milk (दूध)", 30, 37, 5],
    ["Amul Diamond Full Cream Milk 500ml", "Milk (दूध)", 30, 36, 5],
    ["Amul Lactose Free Milk 250ml", "Milk (दूध)", 20, 25, 5],
    ["Amul Camel Milk 200ml", "Milk (दूध)", 20, 25, 3],
    ["Amul T-Special Milk 1L", "Milk (दूध)", 49, 60, 5],
    
    // === 2. BUTTER & SPREADS (मक्खन & स्प्रेड) ===
    ["Amul Butter 50g", "Butter & Spreads (मक्खन)", 24, 30, 10],
    ["Amul Butter 100g", "Butter & Spreads (मक्खन)", 45, 56, 10],
    ["Amul Butter 200g", "Butter & Spreads (मक्खन)", 90, 112, 5],
    ["Amul Butter 500g", "Butter & Spreads (मक्खन)", 220, 275, 5],
    ["Amul Lite Butter 100g", "Butter & Spreads (मक्खन)", 48, 60, 5],
    ["Amul Garlic & Herbs Butter 100g", "Butter & Spreads (मक्खन)", 52, 65, 5],
    ["Amul Unsalted White Butter 100g", "Butter & Spreads (मक्खन)", 47, 58, 5],
    ["Amul Delicious Table Spread 100g", "Butter & Spreads (मक्खन)", 32, 40, 5],
    ["Amul Peanut Spread 200g", "Butter & Spreads (मक्खन)", 72, 90, 5],
    ["Amul Peanut Butter Crunchy 350g", "Butter & Spreads (मक्खन)", 120, 150, 3],
    
    // === 3. CHEESE (चीज़) ===
    ["Amul Cheese Slices 100g", "Cheese (चीज़)", 70, 85, 5],
    ["Amul Cheese Slices 200g", "Cheese (चीज़)", 130, 160, 5],
    ["Amul Cheese Slices 480g (24 slices)", "Cheese (चीज़)", 250, 310, 3],
    ["Amul Processed Cheese 200g Block", "Cheese (चीज़)", 80, 99, 5],
    ["Amul Processed Cheese 400g Block", "Cheese (चीज़)", 155, 190, 3],
    ["Amul Cheese Cubes 200g", "Cheese (चीज़)", 105, 130, 5],
    ["Amul Cheese Spread Plain 200g", "Cheese (चीज़)", 85, 105, 3],
    ["Amul Cheese Spread Garlic 200g", "Cheese (चीज़)", 88, 110, 3],
    ["Amul Cheese Spread Pepper 200g", "Cheese (चीज़)", 88, 110, 3],
    ["Amul Pizza Mozzarella Cheese 200g", "Cheese (चीज़)", 110, 135, 3],
    ["Amul Diced Mozzarella & Cheddar 200g", "Cheese (चीज़)", 115, 145, 3],
    ["Amul Gouda Cheese 150g", "Cheese (चीज़)", 140, 180, 2],
    ["Amul Emmental Cheese 400g Block", "Cheese (चीज़)", 320, 400, 2],
    ["Amul Cheddar Cheese 250g Block", "Cheese (चीज़)", 145, 180, 2],
    
    // === 4. PANEER & KHOYA (पनीर & खोया) ===
    ["Amul Fresh Paneer 200g", "Paneer & Khoya (पनीर)", 72, 90, 8],
    ["Amul Fresh Paneer 500g", "Paneer & Khoya (पनीर)", 170, 210, 5],
    ["Amul Malai Paneer 1kg", "Paneer & Khoya (पनीर)", 330, 400, 3],
    ["Amul Frozen Paneer Cubes 200g", "Paneer & Khoya (पनीर)", 76, 95, 5],
    ["Amul Khoya / Mawa 200g", "Paneer & Khoya (पनीर)", 70, 85, 3],
    ["Amul Khoya / Mawa 1kg", "Paneer & Khoya (पनीर)", 300, 370, 2],
    
    // === 5. GHEE (घी) ===
    ["Amul Ghee 200ml Pouch", "Ghee (घी)", 105, 130, 5],
    ["Amul Ghee 500ml Pouch", "Ghee (घी)", 240, 295, 5],
    ["Amul Ghee 1L Pouch", "Ghee (घी)", 480, 590, 3],
    ["Amul Ghee 1L Tin", "Ghee (घी)", 500, 620, 3],
    ["Amul Ghee 5L Jar", "Ghee (घी)", 2400, 2950, 2],
    ["Amul Cow Ghee 500ml Jar", "Ghee (घी)", 265, 330, 3],
    ["Amul Cow Ghee 1L Jar", "Ghee (घी)", 520, 650, 3],
    ["Amul High Polymer Ghee 1L", "Ghee (घी)", 510, 630, 2],
    
    // === 6. CURD, LASSI & CHHAS (दही & छाछ) ===
    ["Amul Masti Dahi 200g", "Curd, Lassi & Chhas (दही & छाछ)", 20, 25, 10],
    ["Amul Masti Dahi 400g", "Curd, Lassi & Chhas (दही & छाछ)", 35, 45, 10],
    ["Amul Masti Dahi 1kg", "Curd, Lassi & Chhas (दही & छाछ)", 70, 85, 5],
    ["Amul Set Dahi 400g", "Curd, Lassi & Chhas (दही & छाछ)", 40, 50, 5],
    ["Amul Sugarfree Dahi 400g", "Curd, Lassi & Chhas (दही & छाछ)", 44, 55, 3],
    ["Amul Masti Spiced Buttermilk 200ml Pouch", "Curd, Lassi & Chhas (दही & छाछ)", 10, 12, 15],
    ["Amul Masti Spiced Buttermilk 200ml Tetra", "Curd, Lassi & Chhas (दही & छाछ)", 12, 15, 15],
    ["Amul Masti Buttermilk 1L", "Curd, Lassi & Chhas (दही & छाछ)", 40, 50, 5],
    ["Amul Sweet Lassi 200ml Pouch", "Curd, Lassi & Chhas (दही & छाछ)", 15, 20, 15],
    ["Amul Mango Lassi 200ml", "Curd, Lassi & Chhas (दही & छाछ)", 20, 25, 10],
    ["Amul Rose Lassi 200ml", "Curd, Lassi & Chhas (दही & छाछ)", 20, 25, 10],
    
    // === 7. ICE CREAM & FROZEN DESSERTS (आइसक्रीम) ===
    ["Amul Vanilla Cup 100ml", "Ice Cream & Frozen Desserts (आइसक्रीम)", 18, 25, 15],
    ["Amul Strawberry Cup 100ml", "Ice Cream & Frozen Desserts (आइसक्रीम)", 18, 25, 15],
    ["Amul Chocolate Cup 100ml", "Ice Cream & Frozen Desserts (आइसक्रीम)", 20, 28, 15],
    ["Amul Chocobar Stick", "Ice Cream & Frozen Desserts (आइसक्रीम)", 22, 30, 15],
    ["Amul Frostik Chocobar Stick", "Ice Cream & Frozen Desserts (आइसक्रीम)", 30, 40, 10],
    ["Amul Tri Cone Butterscotch", "Ice Cream & Frozen Desserts (आइसक्रीम)", 25, 35, 10],
    ["Amul Tri Cone Chocolate", "Ice Cream & Frozen Desserts (आइसक्रीम)", 28, 40, 10],
    ["Amul Sundae Cup 125ml", "Ice Cream & Frozen Desserts (आइसक्रीम)", 30, 40, 10],
    ["Amul Mango Dolly Stick", "Ice Cream & Frozen Desserts (आइसक्रीम)", 8, 10, 20],
    ["Amul Fruit Bonanza Bar", "Ice Cream & Frozen Desserts (आइसक्रीम)", 8, 10, 20],
    ["Amul Kulfi Roll Cut 100ml", "Ice Cream & Frozen Desserts (आइसक्रीम)", 32, 40, 10],
    ["Amul Vanilla 750ml Tub", "Ice Cream & Frozen Desserts (आइसक्रीम)", 160, 210, 3],
    ["Amul Chocolate 750ml Tub", "Ice Cream & Frozen Desserts (आइसक्रीम)", 170, 220, 3],
    ["Amul Rajbhog 750ml Tub", "Ice Cream & Frozen Desserts (आइसक्रीम)", 180, 230, 3],
    ["Amul Butterscotch 750ml Tub", "Ice Cream & Frozen Desserts (आइसक्रीम)", 165, 210, 3],
    ["Amul Alphonso Mango 750ml Tub", "Ice Cream & Frozen Desserts (आइसक्रीम)", 175, 220, 3],
    ["Amul Cassatta Slice 150ml", "Ice Cream & Frozen Desserts (आइसक्रीम)", 45, 60, 5],
    ["Amul Sugarfree Vanilla 125ml Cup", "Ice Cream & Frozen Desserts (आइसक्रीम)", 28, 35, 5],
    ["Amul Epic Choco Cappuccino Stick", "Ice Cream & Frozen Desserts (आइसक्रीम)", 40, 50, 5],
    ["Amul Caramel Ice Cream 750ml Tub", "Ice Cream & Frozen Desserts (आइसक्रीम)", 165, 210, 3],
    ["Amul Kulfi Stick 50ml", "Ice Cream & Frozen Desserts (आइसक्रीम)", 16, 20, 15],
    
    // === 8. BEVERAGES & SHAKES (पेय & शेक) ===
    ["Amul Kool Mango 200ml", "Beverages & Shakes (पेय & शेक)", 15, 20, 15],
    ["Amul Kool Badam 200ml", "Beverages & Shakes (पेय & शेक)", 18, 25, 15],
    ["Amul Kool Rose 200ml", "Beverages & Shakes (पेय & शेक)", 15, 20, 10],
    ["Amul Kool Elaichi 200ml", "Beverages & Shakes (पेय & शेक)", 18, 25, 10],
    ["Amul Kool Koko 200ml", "Beverages & Shakes (पेय & शेक)", 22, 30, 10],
    ["Amul Kool Kesar 200ml", "Beverages & Shakes (पेय & शेक)", 18, 25, 10],
    ["Amul Kool Cafe 200ml Can", "Beverages & Shakes (पेय & शेक)", 24, 30, 10],
    ["Amul Tru Apple Juice 200ml", "Beverages & Shakes (पेय & शेक)", 12, 15, 15],
    ["Amul Tru Orange Juice 200ml", "Beverages & Shakes (पेय & शेक)", 12, 15, 15],
    ["Amul High Protein Lassi 200ml", "Beverages & Shakes (पेय & शेक)", 20, 25, 10],
    ["Amul High Protein Milkshake 200ml", "Beverages & Shakes (पेय & शेक)", 28, 35, 10],
    ["Amul Haldi Milk / Memory Milk 125ml", "Beverages & Shakes (पेय & शेक)", 16, 20, 5],
    ["Amul Masti Buttermilk 200ml Can", "Beverages & Shakes (पेय & शेक)", 12, 15, 10],
    
    // === 9. CHOCOLATES (चॉकलेट) ===
    ["Amul Milk Chocolate 150g", "Chocolates (चॉकलेट)", 75, 95, 5],
    ["Amul Dark Chocolate 150g 55%", "Chocolates (चॉकलेट)", 80, 100, 5],
    ["Amul Bitter Chocolate 150g 75%", "Chocolates (चॉकलेट)", 100, 130, 3],
    ["Amul Fruit & Nut Chocolate 150g", "Chocolates (चॉकलेट)", 110, 140, 5],
    ["Amul Mystic Mocha Chocolate 150g", "Chocolates (चॉकलेट)", 95, 120, 3],
    ["Amul Sugar Free Dark Chocolate 150g", "Chocolates (चॉकलेट)", 110, 140, 3],
    ["Amul Single Origin Dark Chocolate 125g", "Chocolates (चॉकलेट)", 120, 150, 3],
    ["Amul Chocozoo Chocolate 10g", "Chocolates (चॉकलेट)", 8, 10, 30],
    ["Amul Choco Minis 250g Box", "Chocolates (चॉकलेट)", 120, 150, 3],
    
    // === 10. SWEETS & DESSERTS (मिठाई) ===
    ["Amul Gulab Jamun 500g Tin", "Sweets & Desserts (मिठाई)", 85, 105, 5],
    ["Amul Gulab Jamun 1kg Tin", "Sweets & Desserts (मिठाई)", 175, 220, 3],
    ["Amul Rasgulla 1kg Tin", "Sweets & Desserts (मिठाई)", 165, 210, 3],
    ["Amul Kaju Katli 200g Pack", "Sweets & Desserts (मिठाई)", 160, 200, 3],
    ["Amul Shrikhand Kesar 100g", "Sweets & Desserts (मिठाई)", 35, 45, 5],
    ["Amul Shrikhand Kesar 500g", "Sweets & Desserts (मिठाई)", 140, 175, 3],
    ["Amul Amrakhand Mango 250g", "Sweets & Desserts (मिठाई)", 60, 75, 3],
    ["Amul Basundi 200ml", "Sweets & Desserts (मिठाई)", 45, 55, 5],
    ["Amul Peda 250g Pack", "Sweets & Desserts (मिठाई)", 105, 130, 3],
    ["Amul Milk Cake 250g Pack", "Sweets & Desserts (मिठाई)", 105, 130, 3],
    ["Amul Kalakand 250g Pack", "Sweets & Desserts (मिठाई)", 105, 130, 3],
    
    // === 11. MILK POWDER & CONDENSED MILK (पाउडर & कंडेंस्ड) ===
    ["Amulya Dairy Whitener 200g", "Milk Powder & Condensed Milk (पाउडर & कंडेंस्ड)", 90, 110, 5],
    ["Amulya Dairy Whitener 500g", "Milk Powder & Condensed Milk (पाउडर & कंडेंस्ड)", 220, 270, 5],
    ["Amulya Dairy Whitener 1kg", "Milk Powder & Condensed Milk (पाउडर & कंडेंस्ड)", 430, 520, 3],
    ["Amul Spray Infant Milk Food 500g", "Milk Powder & Condensed Milk (पाउडर & कंडेंस्ड)", 230, 280, 3],
    ["Amul Mithai Mate Condensed Milk 200g", "Milk Powder & Condensed Milk (पाउडर & कंडेंस्ड)", 30, 38, 5],
    ["Amul Mithai Mate Condensed Milk 400g", "Milk Powder & Condensed Milk (पाउडर & कंडेंस्ड)", 56, 70, 5],
    ["Amul Fresh Cream 200ml", "Milk Powder & Condensed Milk (पाउडर & कंडेंस्ड)", 48, 60, 5],
    ["Amul Fresh Cream 1L", "Milk Powder & Condensed Milk (पाउडर & कंडेंस्ड)", 200, 250, 3],
    ["Amul Sour Cream 200g", "Milk Powder & Condensed Milk (पाउडर & कंडेंस्ड)", 56, 70, 5],
    
    // === 12. BAKERY, PROTEIN & FROZEN SNACKS (बेकरी & स्नेक्स) ===
    ["Amul PRO Chocolate Protein Mix 500g", "Bakery, Protein & Frozen Snacks (बेकरी & स्नेक्स)", 175, 220, 3],
    ["Amul Butter Cookies 200g", "Bakery, Protein & Frozen Snacks (बेकरी & स्नेक्स)", 48, 60, 5],
    ["Amul Chocolate Chip Cookies 200g", "Bakery, Protein & Frozen Snacks (बेकरी & स्नेक्स)", 56, 70, 5],
    ["Amul Cheese Nuggets Frozen 200g", "Bakery, Protein & Frozen Snacks (बेकरी & स्नेक्स)", 88, 110, 3],
    ["Amul Veg Cheese Pockets Frozen 200g", "Bakery, Protein & Frozen Snacks (बेकरी & स्नेक्स)", 80, 100, 3],
    ["Amul Cheese Paratha Frozen 400g", "Bakery, Protein & Frozen Snacks (बेकरी & स्नेक्स)", 120, 150, 3],
    ["Amul Organic Whole Wheat Atta 5kg", "Bakery, Protein & Frozen Snacks (बेकरी & स्नेक्स)", 210, 260, 2],
    ["Amul Spray Cream 250g", "Bakery, Protein & Frozen Snacks (बेकरी & स्नेक्स)", 120, 150, 3],
    ["Amul Happy Treats French Fries 400g", "Bakery, Protein & Frozen Snacks (बेकरी & स्नेक्स)", 68, 85, 3],
    ["Amul Happy Treats Aloo Tikki 400g", "Bakery, Protein & Frozen Snacks (बेकरी & स्नेक्स)", 80, 100, 3],
    ["Amul Happy Treats Paneer Paratha 400g", "Bakery, Protein & Frozen Snacks (बेकरी & स्नेक्स)", 105, 130, 3],
    ["Amul Honey 250g Bottle", "Bakery, Protein & Frozen Snacks (बेकरी & स्नेक्स)", 80, 100, 5],
  ];
  
  // Write product data starting from row 2
  const dataRange = sheet.getRange(2, 1, products.length, 5);
  dataRange.setValues(products);
  
  // Add formulas for each product row in batch (for maximum speed)
  const col5Formulas = [];
  const col7To10Formulas = [];
  for (let i = 2; i <= products.length + 1; i++) {
    col5Formulas.push([`=IF(A${i}="","",D${i}-C${i})`]);
    col7To10Formulas.push([
      `=IF(A${i}="","",SUMIF('माल आवक'!B:B, A${i}, 'माल आवक'!C:C))`,
      `=IF(A${i}="","",SUMIF('बिक्री'!B:B, A${i}, 'बिक्री'!C:C))`,
      `=IF(A${i}="","",G${i}-H${i})`,
      `=IF(A${i}="","",IF(I${i}<=0,"❌ Out of Stock",IF(I${i}<=F${i},"⚠️ Low Stock","✅ OK")))`
    ]);
  }
  sheet.getRange(2, 5, products.length, 1).setFormulas(col5Formulas);
  sheet.getRange(2, 7, products.length, 4).setFormulas(col7To10Formulas);
  
  // Grey out formula columns
  sheet.getRange(2, 5, products.length, 1).setBackground("#f5f5f5");  // Profit/Unit
  sheet.getRange(2, 7, products.length, 4).setBackground("#f5f5f5");  // Stocked In, Sold, Current, Status
  
  // Sort by Category, then Product Name
  sheet.getRange(2, 1, products.length, 10).sort([{column: 2, ascending: true}, {column: 1, ascending: true}]);
  
  // Add alternating row colors
  for (let i = 2; i <= products.length + 1; i++) {
    if (i % 2 === 0) {
      sheet.getRange(i, 1, 1, 4).setBackground("#e8eaf6");
    }
  }
}

// ============================================================
// HELPER: Prefill Stock In Log with Product Names
// ============================================================
function prefillStockInProducts(stockInLog, productMaster) {
  const lastRow = productMaster.getLastRow();
  if (lastRow < 2) return;
  
  // Fetch product names from Product Master
  const productNames = productMaster.getRange(2, 1, lastRow - 1, 1).getValues();
  const today = new Date();
  
  const initialStockInRows = productNames.map(row => [today, row[0], ""]);
  
  // Write Date, Product Name, and leave Quantity blank for shopkeeper
  stockInLog.getRange(2, 1, initialStockInRows.length, 3).setValues(initialStockInRows);
}

// ============================================================
// DATA VALIDATION — Dropdowns
// ============================================================
function setupDataValidation(ss, productMaster, salesLog, stockInLog) {
  const productRange = productMaster.getRange("A2:A300");
  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInRange(productRange, true)
    .setAllowInvalid(false)
    .setHelpText("उत्पाद चुनें — Select a product from the list")
    .build();
  
  // Apply to Sales Log Column B
  salesLog.getRange("B2:B500").setDataValidation(rule);
  
  // Apply to Stock In Log Column B
  stockInLog.getRange("B2:B500").setDataValidation(rule);
  
  // Quantity validation — must be >= 1
  const qtyRule = SpreadsheetApp.newDataValidation()
    .requireNumberGreaterThanOrEqualTo(1)
    .setAllowInvalid(false)
    .setHelpText("मात्रा 1 या उससे अधिक होनी चाहिए — Quantity must be 1 or more")
    .build();
  
  salesLog.getRange("C2:C500").setDataValidation(qtyRule);
  stockInLog.getRange("C2:C500").setDataValidation(qtyRule);
}

// ============================================================
// CONDITIONAL FORMATTING
// ============================================================
function setupConditionalFormatting(productMaster, dashboard) {
  // Product Master — Status column (J)
  const statusRange = productMaster.getRange("J2:J300");
  
  // Out of Stock — Red
  const outOfStockRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextContains("❌")
    .setBackground("#ffcdd2")
    .setFontColor("#b71c1c")
    .setRanges([statusRange])
    .build();
  
  // Low Stock — Orange/Yellow
  const lowStockRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextContains("⚠️")
    .setBackground("#fff9c4")
    .setFontColor("#e65100")
    .setRanges([statusRange])
    .build();
  
  // OK — Green
  const okRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextContains("✅")
    .setBackground("#c8e6c9")
    .setFontColor("#1b5e20")
    .setRanges([statusRange])
    .build();
  
  // Also highlight the entire row in Product Master based on stock
  const fullRowRange = productMaster.getRange("I2:I300");
  
  const rowRedRule = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberLessThanOrEqualTo(0)
    .setBackground("#ffebee")
    .setRanges([fullRowRange])
    .build();
  
  const rules = productMaster.getConditionalFormatRules();
  rules.push(outOfStockRule, lowStockRule, okRule, rowRedRule);
  productMaster.setConditionalFormatRules(rules);
}

// ============================================================
// HELPER: Add sheet protection
// ============================================================
function protectSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Protect Product Master
  const pm = ss.getSheetByName("उत्पाद सूची");
  if (pm) {
    const protection = pm.protect().setDescription("Product Master — Owner Only");
    protection.setWarningOnly(true);
  }
  
  // Protect formula columns in Sales Log
  const sales = ss.getSheetByName("बिक्री");
  if (sales) {
    const formulaProtection = sales.getRange("D:H").protect()
      .setDescription("Sales formulas — Do not edit");
    formulaProtection.setWarningOnly(true);
  }
  
  // Protect formula columns in Stock In Log
  const stockIn = ss.getSheetByName("माल आवक");
  if (stockIn) {
    const formulaProtection = stockIn.getRange("D:E").protect()
      .setDescription("Stock In formulas — Do not edit");
    formulaProtection.setWarningOnly(true);
  }
}

// ============================================================
// BONUS: Quick-add sale from menu
// ============================================================
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🛒 Shop Stocker')
    .addItem('➕ Log Sale — बिक्री दर्ज करें', 'goToSalesLog')
    .addItem('📦 Add Stock — माल आवक दर्ज करें', 'goToStockInLog')
    .addItem('📊 View Dashboard — डैशबोर्ड देखें', 'goToDashboard')
    .addSeparator()
    .addItem('🔄 Update Catalog (Requires Internet)', 'syncCatalog')
    .addItem('🔒 Protect Sheets — शीट सुरक्षित करें', 'protectSheets')
    .addToUi();
}

function goToSalesLog() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("बिक्री");
  sheet.activate();
  // Find next empty row
  const lastRow = sheet.getLastRow();
  sheet.getRange(lastRow + 1, 1).activate();
}

function goToStockInLog() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("माल आवक");
  sheet.activate();
  const lastRow = sheet.getLastRow();
  sheet.getRange(lastRow + 1, 1).activate();
}

function goToDashboard() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("डैशबोर्ड");
  sheet.activate();
  sheet.getRange("B1").activate();
}

// ============================================================
// CATALOG SYNC: Fetch updates from Central CSV
// ============================================================
function syncCatalog() {
  const ui = SpreadsheetApp.getUi();
  
  const response = ui.alert(
    'Update Catalog',
    'This will connect to the internet to check for new Amul products. Do you want to proceed?',
    ui.ButtonSet.YES_NO
  );
  
  if (response !== ui.Button.YES) return;

  // Placeholder for the Central CSV. The Manager should host a CSV file (e.g. on GitHub/Google Drive)
  // Format: [Product Name, Category, Cost Price, MRP, Min Stock]
  const SYNC_URL = "https://raw.githubusercontent.com/ShashankDvd1/Shop-Stocker/main/amul_catalog_updates.csv";
  
  let csvContent = "";
  try {
    const fetchResponse = UrlFetchApp.fetch(SYNC_URL);
    csvContent = fetchResponse.getContentText();
  } catch (e) {
    ui.alert("Error", "Could not connect to the internet or fetch the update file. Please try again later.", ui.ButtonSet.OK);
    return;
  }

  // Very basic CSV parser (assumes no commas inside values for simplicity)
  const rows = csvContent.split("\\n");
  if (rows.length < 2) {
    ui.alert("Notice", "No updates found in the remote file.", ui.ButtonSet.OK);
    return;
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const productMaster = ss.getSheetByName("उत्पाद सूची");
  const lastRow = productMaster.getLastRow();
  
  // Get existing products to avoid duplicates
  const existingProductsRange = productMaster.getRange(2, 1, Math.max(1, lastRow - 1), 1);
  const existingProducts = existingProductsRange.getValues().map(row => row[0].toString().trim().toLowerCase());
  
  let addedCount = 0;
  let newProductsData = [];
  
  // Skip header row (i=1)
  for (let i = 1; i < rows.length; i++) {
    const cols = rows[i].split(",");
    if (cols.length >= 5) {
      const productName = cols[0].trim();
      if (productName && !existingProducts.includes(productName.toLowerCase())) {
        // [Product Name, Category, Cost Price, MRP, Min Stock]
        newProductsData.push([
          productName,
          cols[1].trim(),
          parseFloat(cols[2]) || 0,
          parseFloat(cols[3]) || 0,
          parseInt(cols[4]) || 0
        ]);
        addedCount++;
      }
    }
  }
  
  if (addedCount > 0) {
    // Append new products
    const appendRow = lastRow + 1;
    productMaster.getRange(appendRow, 1, addedCount, 5).setValues(newProductsData);
    
    // Auto-fill formulas for new rows in batch
    const syncCol5 = [];
    const syncCol7To11 = [];
    for (let r = appendRow; r < appendRow + addedCount; r++) {
      syncCol5.push([`=IF(A${r}="","",D${r}-C${r})`]);
      syncCol7To11.push([
        `=IF(A${r}="","",SUMIF('माल आवक'!B:B,A${r},'माल आवक'!C:C))`,
        `=IF(A${r}="","",SUMIF('बिक्री'!B:B,A${r},'बिक्री'!C:C))`,
        `=IF(A${r}="","",0+G${r}-H${r})`,
        `=IF(A${r}="","",IF(I${r}<=0,"❌ Out of Stock",IF(I${r}<=E${r},"⚠️ Low Stock","✅ OK")))`,
        `=IF(A${r}="","",IFERROR(INDEX(SORT(FILTER('माल आवक'!A:A,'माल आवक'!B:B=A${r}),1,FALSE),1),"Never"))`
      ]);
    }
    productMaster.getRange(appendRow, 5, addedCount, 1).setFormulas(syncCol5);
    productMaster.getRange(appendRow, 7, addedCount, 5).setFormulas(syncCol7To11);
    
    // Apply formatting to new cells (currency)
    productMaster.getRange(appendRow, 3, addedCount, 3).setNumberFormat("[$₹] #,##0.00");
    
    ui.alert("Sync Complete", `Successfully added ${addedCount} new product(s) to the catalog!`, ui.ButtonSet.OK);
  } else {
    ui.alert("Up to Date", "No new products found. Your catalog is up to date.", ui.ButtonSet.OK);
  }
}
