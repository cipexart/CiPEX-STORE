import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Server-side persistent storage paths
const CONFIG_FILE = path.join(process.cwd(), "data_store_config.json");
const DB_FILE = path.join(process.cwd(), "data_store_db.json");

interface ServerStoreConfig {
  adminEmail: string;
  sheetId: string;
  sheetUrl: string;
  sheetTitle: string;
  lastUpdated: string;
}

function getStoreConfig(): ServerStoreConfig {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const content = fs.readFileSync(CONFIG_FILE, "utf-8");
      const parsed = JSON.parse(content);
      if (parsed.sheetId) return parsed;
    }
  } catch (err) {
    console.error("Error reading store config:", err);
  }
  return {
    adminEmail: "artcipex@gmail.com",
    sheetId: "1EWqSFQhgA7d0n6V37W0WvhP1UqkZalPPb2quS7kE1T4",
    sheetUrl: "https://docs.google.com/spreadsheets/d/1EWqSFQhgA7d0n6V37W0WvhP1UqkZalPPb2quS7kE1T4/edit",
    sheetTitle: "CiPEX STORE",
    lastUpdated: new Date().toISOString(),
  };
}

function saveStoreConfig(config: Partial<ServerStoreConfig>) {
  try {
    const current = getStoreConfig();
    const updated = { ...current, ...config, lastUpdated: new Date().toISOString() };
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(updated, null, 2), "utf-8");
    return updated;
  } catch (err) {
    console.error("Error saving store config:", err);
    return getStoreConfig();
  }
}

function filterDemoItems(items: any[]) {
  if (!Array.isArray(items)) return [];
  const DEMO_IDS = ['art-stilo-01', 'art-stilo-02', 'art-stilo-03', 'art-stilo-04', 'art-stilo-05', 'art-stilo-06', 'inv-001', 'INV-CIPEX-2024-001', 'log-001', 'log-002', 'log-003'];
  return items.filter((item) => {
    if (!item) return false;
    if (DEMO_IDS.includes(item.id) || DEMO_IDS.includes(item.invoiceNumber) || DEMO_IDS.includes(item.artworkId)) return false;
    if (typeof item.certificateNumber === 'string' && item.certificateNumber.includes('CIPEX-STILO-2024-00')) return false;
    if (item.customerName === 'الأستاذ كريم بناني' || item.customerName === 'كريم بناني') return false;
    if (typeof item.titleAr === 'string' && (item.titleAr.includes('شموخ الخيل') || item.titleAr.includes('القصبة العتيق') || item.titleAr.includes('نظرة الصقر'))) return false;
    return true;
  });
}

function getStoreDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, "utf-8");
      const parsed = JSON.parse(content);
      if (parsed) {
        return {
          ...parsed,
          artworks: filterDemoItems(parsed.artworks),
          sales: filterDemoItems(parsed.sales),
          inventoryLogs: filterDemoItems(parsed.inventoryLogs),
        };
      }
    }
  } catch (err) {
    console.error("Error reading store database:", err);
  }
  return { artworks: [], sales: [], inventoryLogs: [] };
}

function saveStoreDatabase(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving store database:", err);
  }
}

// Health Check API
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "CiPEX Stilo Art Store API", time: new Date().toISOString() });
});

// GET Public/Visitor Store Data & Preserved Sheet Info
app.get("/api/store/data", (_req, res) => {
  const config = getStoreConfig();
  const db = getStoreDatabase();
  res.json({
    success: true,
    config,
    database: db,
  });
});

// POST Admin Store Data Persistence
app.post("/api/store/save", (req, res) => {
  const { artworks, sales, inventoryLogs, settings } = req.body;
  if (settings && settings.sheetId) {
    saveStoreConfig({
      sheetId: settings.sheetId,
      sheetUrl: settings.sheetUrl || `https://docs.google.com/spreadsheets/d/${settings.sheetId}`,
    });
  }
  saveStoreDatabase({ artworks, sales, inventoryLogs, settings, updatedAt: new Date().toISOString() });
  res.json({ success: true, message: "تم حفظ بيانات المتجر وتحديث قاعدة بيانات زوار المعرض بنجاح!" });
});

// Helper for Google Sheets REST API proxy
async function sheetsApiFetch(url: string, method: string = "GET", body?: any, accessToken?: string) {
  if (!accessToken) {
    throw new Error("Missing Google Access Token for Sheets API");
  }

  const options: RequestInit = {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || `Google Sheets API Error (${response.status})`);
  }

  return data;
}

// 1. Verify or Initialize Google Sheet "CiPEX STORE"
app.post("/api/sheets/verify-or-create", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const accessToken = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
    let { spreadsheetId } = req.body;

    if (!accessToken) {
      return res.status(401).json({ error: "الرجاء تسجيل الدخول بـ Google أولاً للحصول على صلاحية الوصول لجوجل شيت." });
    }

    const storeConfig = getStoreConfig();
    if (!spreadsheetId || spreadsheetId.trim() === "") {
      if (storeConfig.sheetId) {
        spreadsheetId = storeConfig.sheetId;
      }
    }

    // If still no spreadsheet ID provided, create a new single Google Sheet titled "CiPEX STORE"
    if (!spreadsheetId || spreadsheetId.trim() === "") {
      const createPayload = {
        properties: {
          title: "CiPEX STORE",
        },
        sheets: [
          { properties: { title: "Artworks" } },
          { properties: { title: "Sales_Invoices" } },
          { properties: { title: "Inventory_Log" } },
          { properties: { title: "Store_Settings" } },
        ],
      };

      const createdSheet = await sheetsApiFetch(
        "https://sheets.googleapis.com/v4/spreadsheets",
        "POST",
        createPayload,
        accessToken
      );

      spreadsheetId = createdSheet.spreadsheetId;
      const spreadsheetUrl = createdSheet.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}`;

      saveStoreConfig({
        sheetId: spreadsheetId,
        sheetUrl: spreadsheetUrl,
        sheetTitle: "CiPEX STORE",
      });

      // Seed Initial Headers for each Tab
      const headersPayload = {
        valueInputOption: "USER_ENTERED",
        data: [
          {
            range: "Artworks!A1:N1",
            values: [
              [
                "ID",
                "TitleAr (عنوان اللوحة)",
                "Dimensions (الأبعاد)",
                "DrawingHours (ساعات الرسم)",
                "PenColors (ألوان القلم الجاف)",
                "PaperType (نوع الورق)",
                "CreationYear (سنة الإنجاز)",
                "Price (السعر)",
                "Status (الحالة)",
                "ImageUrl (رابط الصورة)",
                "Description (الوصف)",
                "CertificateNumber (رقم الشهادة)",
                "FrameIncluded (إطار متاح)",
                "CreatedAt (تاريخ الإضافة)"
              ],
            ],
          },
          {
            range: "Sales_Invoices!A1:N1",
            values: [
              [
                "InvoiceNumber (رقم الفاتورة)",
                "ArtworkId (معرف اللوحة)",
                "ArtworkTitle (اسم اللوحة)",
                "CustomerName (اسم العميل)",
                "CustomerPhone (رقم الهاتف)",
                "CustomerAddress (العنوان)",
                "CustomerEmail (البريد الإلكتروني)",
                "SaleDate (تاريخ البيع)",
                "OriginalPrice (السعر الأصلي)",
                "Discount (الخصم)",
                "FinalPrice (السعر النهائي)",
                "PaymentMethod (طريقة الدفع)",
                "Status (الحالة)",
                "Notes (ملاحظات)"
              ],
            ],
          },
          {
            range: "Inventory_Log!A1:F1",
            values: [
              [
                "ID",
                "ArtworkId (معرف اللوحة)",
                "ArtworkTitle (اسم اللوحة)",
                "Action (نوع الحركة)",
                "Timestamp (الوقت)",
                "Details (تفاصيل)"
              ],
            ],
          },
          {
            range: "Store_Settings!A1:B1",
            values: [
              ["Key (المفتاح)", "Value (القيمة)"]
            ]
          }
        ],
      };

      await sheetsApiFetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`,
        "POST",
        headersPayload,
        accessToken
      );

      return res.json({
        success: true,
        spreadsheetId,
        spreadsheetUrl,
        message: "تم إنشاء شيت جديد باسم 'CiPEX STORE' في حساب Google الخاص بك وتعيينه كقاعدة البيانات الموحدة!",
      });
    }

    // Verify existing sheet
    const sheetMeta = await sheetsApiFetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`,
      "GET",
      null,
      accessToken
    );

    const spreadsheetUrl = sheetMeta.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}`;
    saveStoreConfig({
      sheetId: spreadsheetId,
      sheetUrl: spreadsheetUrl,
      sheetTitle: sheetMeta.properties?.title || "CiPEX STORE",
    });

    return res.json({
      success: true,
      spreadsheetId,
      spreadsheetUrl,
      title: sheetMeta.properties?.title || "CiPEX STORE",
      message: "تم التحقق والربط بقاعدة بيانات Google Sheet 'CiPEX STORE' بنجاح!",
    });
  } catch (error: any) {
    console.error("Sheets Verify Error:", error);
    res.status(500).json({ error: error.message || "فشل الاتصال بجوجل شيت" });
  }
});

function sanitizeCellForSheets(val: any): any {
  if (typeof val === "string") {
    if (val.length > 45000) {
      return val.substring(0, 45000);
    }
  }
  return val;
}

// 2. Sync / Push Data to Google Sheet
app.post("/api/sheets/push-all", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const accessToken = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
    const { spreadsheetId, artworks, sales, inventoryLogs, settings } = req.body;

    if (!accessToken) {
      return res.status(401).json({ error: "الرجاء تسجيل الدخول أولاً للمزامنة." });
    }

    if (!spreadsheetId) {
      return res.status(400).json({ error: "معرف Google Sheet غير محدد." });
    }

    // Format Artworks Rows
    const artworkRows = (artworks || []).map((art: any) => [
      art.id || "",
      art.titleAr || art.title || "",
      art.dimensions || "",
      art.drawingHours || 0,
      Array.isArray(art.penColors) ? art.penColors.join(", ") : art.penColors || "أزرق جاف",
      art.paperType || "",
      art.creationYear || "",
      art.price || 0,
      art.status || "available",
      art.imageUrl || "",
      art.description || "",
      art.certificateNumber || "",
      art.frameIncluded ? "نعم" : "لا",
      art.createdAt || new Date().toISOString()
    ].map(sanitizeCellForSheets));

    // Format Sales Rows
    const saleRows = (sales || []).map((s: any) => [
      s.invoiceNumber || "",
      s.artworkId || "",
      s.artworkTitle || "",
      s.customerName || "",
      s.customerPhone || "",
      s.customerAddress || "",
      s.customerEmail || "",
      s.saleDate || "",
      s.originalPrice || 0,
      s.discount || 0,
      s.finalPrice || 0,
      s.paymentMethod || "cash",
      s.status || "completed",
      s.notes || ""
    ].map(sanitizeCellForSheets));

    // Format Log Rows
    const logRows = (inventoryLogs || []).map((l: any) => [
      l.id || "",
      l.artworkId || "",
      l.artworkTitle || "",
      l.action || "",
      l.timestamp || "",
      l.details || ""
    ].map(sanitizeCellForSheets));

    // Format Settings Rows
    const settingRows = [
      ["artistName", settings?.artistName || "الفنان CiPEX"],
      ["studioName", settings?.studioName || "CiPEX STORE - متجر واستوديو اللوحات الجافة (Stilo Art)"],
      ["phone", settings?.phone || "0699745621"],
      ["whatsappPhone", settings?.whatsappPhone || "0699745621"],
      ["email", settings?.email || "artcipex@gmail.com"],
      ["address", settings?.address || "الدار البيضاء - المغرب"],
      ["currency", settings?.currency || "د.م (MAD)"],
      ["invoiceFooterAr", settings?.invoiceFooterAr || "جميع اللوحات الفنية موقعة وأصلية ومصحوبة بشهادة الأصالة الرسمية من الفنان CiPEX."],
      ["lastSynced", new Date().toLocaleString("ar-MA")]
    ].map(row => row.map(sanitizeCellForSheets));

    // Clear existing data ranges first
    try {
      await sheetsApiFetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchClear`,
        "POST",
        {
          ranges: [
            "Artworks!A2:Z1000",
            "Sales_Invoices!A2:Z1000",
            "Inventory_Log!A2:Z1000"
          ]
        },
        accessToken
      );
    } catch (err: any) {
      console.log("Notice: batchClear soft warning:", err.message);
    }

    // Build batch payload only for non-empty arrays
    const batchUpdateData: any[] = [
      {
        range: "Store_Settings!A2:B20",
        values: settingRows
      }
    ];

    if (artworkRows.length > 0) {
      batchUpdateData.push({
        range: `Artworks!A2:N${1 + artworkRows.length}`,
        values: artworkRows
      });
    }

    if (saleRows.length > 0) {
      batchUpdateData.push({
        range: `Sales_Invoices!A2:N${1 + saleRows.length}`,
        values: saleRows
      });
    }

    if (logRows.length > 0) {
      batchUpdateData.push({
        range: `Inventory_Log!A2:F${1 + logRows.length}`,
        values: logRows
      });
    }

    await sheetsApiFetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`,
      "POST",
      {
        valueInputOption: "USER_ENTERED",
        data: batchUpdateData
      },
      accessToken
    );

    return res.json({
      success: true,
      updatedAt: new Date().toISOString(),
      message: "تم حفظ ومزامنة جميع بيانات اللوحات، المبيعات، الفواتير، والسجلات بنجاح في Google Sheet!",
    });
  } catch (error: any) {
    console.error("Sheets Push Error:", error);
    res.status(500).json({ error: error.message || "فشل مزامنة البيانات مع جوجل شيت" });
  }
});

// Clear Sheet Data Endpoint
app.post("/api/sheets/clear-sheet", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const accessToken = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
    const { spreadsheetId } = req.body;

    if (!accessToken || !spreadsheetId) {
      return res.status(400).json({ error: "بيانات الاعتماد أو معرف Google Sheet مفقود." });
    }

    await sheetsApiFetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchClear`,
      "POST",
      {
        ranges: [
          "Artworks!A2:Z1000",
          "Sales_Invoices!A2:Z1000",
          "Inventory_Log!A2:Z1000"
        ]
      },
      accessToken
    );

    return res.json({
      success: true,
      message: "تم مسح وحذف كافة البيانات التجريبية من جدول Google Sheet بنجاح!"
    });
  } catch (error: any) {
    console.error("Sheets Clear Error:", error);
    res.status(500).json({ error: error.message || "فشل مسح بيانات Google Sheet" });
  }
});

// 3. Pull Data from Google Sheet
app.post("/api/sheets/pull-all", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const accessToken = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
    const { spreadsheetId } = req.body;

    if (!accessToken || !spreadsheetId) {
      return res.status(400).json({ error: "بيانات الاعتماد أو معرف Google Sheet مفقود." });
    }

    const ranges = [
      "Artworks!A2:N1000",
      "Sales_Invoices!A2:N1000",
      "Inventory_Log!A2:F1000",
      "Store_Settings!A2:B20"
    ];

    const rangesParam = ranges.map(r => `ranges=${encodeURIComponent(r)}`).join("&");
    const sheetData = await sheetsApiFetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchGet?${rangesParam}`,
      "GET",
      null,
      accessToken
    );

    const valueRanges = sheetData.valueRanges || [];

    // Parse Artworks
    const artworkValues = valueRanges[0]?.values || [];
    const artworks = artworkValues
      .filter((row: any[]) => row && row[0])
      .map((row: any[]) => ({
        id: row[0],
        titleAr: row[1] || "لوحة قلم جاف",
        title: row[1] || "Stilo Artwork",
        dimensions: row[2] || "50x70 cm",
        drawingHours: Number(row[3]) || 50,
        penColors: (row[4] || "أزرق جاف").split(",").map((c: string) => c.trim()),
        paperType: row[5] || "ورق فني 300 غرام",
        creationYear: row[6] || "2024",
        price: Number(row[7]) || 0,
        status: row[8] || "available",
        imageUrl: row[9] || "",
        description: row[10] || "",
        certificateNumber: row[11] || "",
        frameIncluded: row[12] === "نعم",
        createdAt: row[13] || new Date().toISOString()
      }));

    // Parse Sales Invoices
    const salesValues = valueRanges[1]?.values || [];
    const sales = salesValues
      .filter((row: any[]) => row && row[0])
      .map((row: any[]) => ({
        invoiceNumber: row[0],
        artworkId: row[1],
        artworkTitle: row[2],
        customerName: row[3],
        customerPhone: row[4],
        customerAddress: row[5],
        customerEmail: row[6],
        saleDate: row[7],
        originalPrice: Number(row[8]) || 0,
        discount: Number(row[9]) || 0,
        finalPrice: Number(row[10]) || 0,
        paymentMethod: row[11] || "cash",
        status: row[12] || "completed",
        notes: row[13] || ""
      }));

    // Parse Inventory Logs
    const logValues = valueRanges[2]?.values || [];
    const inventoryLogs = logValues
      .filter((row: any[]) => row && row[0])
      .map((row: any[]) => ({
        id: row[0],
        artworkId: row[1],
        artworkTitle: row[2],
        action: row[3],
        timestamp: row[4],
        details: row[5]
      }));

    return res.json({
      success: true,
      artworks,
      sales,
      inventoryLogs,
      message: "تم جلب البيانات بنجاح من Google Sheet!"
    });
  } catch (error: any) {
    console.error("Sheets Pull Error:", error);
    res.status(500).json({ error: error.message || "فشل استيراد البيانات من جوجل شيت" });
  }
});

// Start Express and Vite Middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[CiPEX Stilo Server] running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
