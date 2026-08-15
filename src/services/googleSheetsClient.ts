// Client-side Google Sheets API service for static environments (e.g. GitHub Pages)

export async function sheetsApiFetch(url: string, method = 'GET', body: any = null, accessToken: string) {
  const options: RequestInit = {
    method,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
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

export async function clientVerifyOrCreateSheet(accessToken: string, spreadsheetIdInput?: string) {
  let spreadsheetId = spreadsheetIdInput?.trim();

  if (!spreadsheetId) {
    const createPayload = {
      properties: {
        title: "CiPEX STORE",
      },
      sheets: [
        { properties: { title: "Artworks" } },
        { properties: { title: "Customer_Orders" } },
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

    // Seed headers
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
          range: "Customer_Orders!A1:L1",
          values: [
            [
              "OrderID (رقم الطلب)",
              "ArtworkId (معرف اللوحة)",
              "ArtworkTitle (عنوان اللوحة)",
              "Dimensions (الأبعاد)",
              "Price (السعر)",
              "CustomerName (اسم المقتني)",
              "CustomerPhone (رقم الهاتف)",
              "CustomerAddress (عنوان التسليم)",
              "CustomerEmail (البريد الإلكتروني)",
              "OrderDate (تاريخ الطلب)",
              "Status (حالة الطلب)",
              "Notes (ملاحظات خاصة)"
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
          values: [["Key (المفتاح)", "Value (القيمة)"]]
        }
      ],
    };

    await sheetsApiFetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`,
      "POST",
      headersPayload,
      accessToken
    );

    return {
      spreadsheetId,
      spreadsheetUrl,
      message: "تم إنشاء جدول بيانات جديد 'CiPEX STORE' وتوصيله بنجاح مع صفحة مخصصة لطلبات الاقتناء Customer_Orders!",
    };
  }

  // Verify existing
  const sheetMeta = await sheetsApiFetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`,
    "GET",
    null,
    accessToken
  );

  const spreadsheetUrl = sheetMeta.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}`;
  return {
    spreadsheetId,
    spreadsheetUrl,
    title: sheetMeta.properties?.title || "CiPEX STORE",
    message: "تم التحقق والربط بـ Google Sheet بنجاح!",
  };
}

export async function clientPushAllToSheet(
  accessToken: string,
  spreadsheetId: string,
  payload: { artworks: any[]; sales: any[]; inventoryLogs: any[]; settings?: any }
) {
  const { artworks = [], sales = [], inventoryLogs = [], settings = {} } = payload;

  // 1. Clear existing contents
  await sheetsApiFetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchClear`,
    "POST",
    {
      ranges: [
        "Artworks!A2:N1000",
        "Customer_Orders!A2:L1000",
        "Sales_Invoices!A2:N1000",
        "Inventory_Log!A2:F1000",
        "Store_Settings!A2:B100"
      ]
    },
    accessToken
  );

  // 2. Prepare Rows
  const artworkRows = artworks.map((item) => [
    item.id,
    item.titleAr || item.title || "",
    item.dimensions || "",
    item.drawingHours || 0,
    Array.isArray(item.penColors) ? item.penColors.join(", ") : (item.penColors || ""),
    item.paperType || "",
    item.creationYear || "",
    item.price || 0,
    item.status || "available",
    item.imageUrl || "",
    item.description || "",
    item.certificateNumber || "",
    item.frameIncluded ? "نعم" : "لا",
    item.createdAt || new Date().toISOString(),
  ]);

  // Customer orders (all sales that are orders or pending requests)
  const orderRows = sales.map((sale) => [
    sale.invoiceNumber || sale.id || "",
    sale.artworkId || "",
    sale.artworkTitle || "",
    artworks.find((a) => a.id === sale.artworkId)?.dimensions || "50x70 cm",
    sale.finalPrice || sale.originalPrice || 0,
    sale.customerName || "",
    sale.customerPhone || "",
    sale.customerAddress || "",
    sale.customerEmail || "",
    sale.saleDate || new Date().toISOString().split('T')[0],
    sale.status === 'pending' ? 'طلب جديد - قيد المتابعة' : (sale.status === 'completed' ? 'مكتمل - تم التسليم' : 'ملغي'),
    sale.notes || "",
  ]);

  const salesRows = sales.map((sale) => [
    sale.invoiceNumber || sale.id || "",
    sale.artworkId || "",
    sale.artworkTitle || "",
    sale.customerName || "",
    sale.customerPhone || "",
    sale.customerAddress || "",
    sale.customerEmail || "",
    sale.saleDate || "",
    sale.originalPrice || 0,
    sale.discount || 0,
    sale.finalPrice || 0,
    sale.paymentMethod || "cash",
    sale.status || "completed",
    sale.notes || "",
  ]);

  const logRows = inventoryLogs.map((log) => [
    log.id || "",
    log.artworkId || "",
    log.artworkTitle || "",
    log.action || "",
    log.timestamp || "",
    log.details || "",
  ]);

  const settingRows = Object.entries(settings).map(([k, v]) => [
    k,
    typeof v === "object" ? JSON.stringify(v) : String(v ?? ""),
  ]);

  const batchPayload = {
    valueInputOption: "USER_ENTERED",
    data: [
      {
        range: "Artworks!A2",
        values: artworkRows.length > 0 ? artworkRows : [["", "", "", "", "", "", "", "", "", "", "", "", "", ""]],
      },
      {
        range: "Customer_Orders!A2",
        values: orderRows.length > 0 ? orderRows : [["", "", "", "", "", "", "", "", "", "", "", ""]],
      },
      {
        range: "Sales_Invoices!A2",
        values: salesRows.length > 0 ? salesRows : [["", "", "", "", "", "", "", "", "", "", "", "", "", ""]],
      },
      {
        range: "Inventory_Log!A2",
        values: logRows.length > 0 ? logRows : [["", "", "", "", "", "", ""]],
      },
      {
        range: "Store_Settings!A2",
        values: settingRows.length > 0 ? settingRows : [["", ""]],
      },
    ],
  };

  await sheetsApiFetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`,
    "POST",
    batchPayload,
    accessToken
  );

  return {
    success: true,
    message: "تم حفظ ومزامنة جميع البيانات في Google Sheet بنجاح بما فيها صفحة طلبات الاقتناء Customer_Orders!",
  };
}

export async function clientAppendOrderToSheet(
  accessToken: string,
  spreadsheetId: string,
  order: {
    orderId: string;
    artworkId: string;
    artworkTitle: string;
    dimensions?: string;
    price: number;
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    customerEmail?: string;
    orderDate: string;
    status?: string;
    notes?: string;
  }
) {
  const row = [
    order.orderId,
    order.artworkId,
    order.artworkTitle,
    order.dimensions || "50x70 cm",
    order.price,
    order.customerName,
    order.customerPhone,
    order.customerAddress,
    order.customerEmail || "",
    order.orderDate,
    order.status || "طلب جديد - قيد المتابعة",
    order.notes || "",
  ];

  const appendPayload = {
    range: "Customer_Orders!A2",
    majorDimension: "ROWS",
    values: [row],
  };

  return sheetsApiFetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Customer_Orders!A2:append?valueInputOption=USER_ENTERED`,
    "POST",
    appendPayload,
    accessToken
  );
}

export async function clientPullAllFromSheet(accessToken: string | null, spreadsheetId: string) {
  let artworkValues: any[] = [];
  let salesValues: any[] = [];
  let logValues: any[] = [];

  if (accessToken) {
    try {
      const res = await sheetsApiFetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchGet?ranges=Artworks!A2:N1000&ranges=Sales_Invoices!A2:N1000&ranges=Inventory_Log!A2:F1000`,
        "GET",
        null,
        accessToken
      );
      const valueRanges = res.valueRanges || [];
      artworkValues = valueRanges[0]?.values || [];
      salesValues = valueRanges[1]?.values || [];
      logValues = valueRanges[2]?.values || [];
    } catch (apiErr) {
      console.warn("Sheets API failed, attempting public CSV fetch fallback...", apiErr);
      artworkValues = await fetchPublicSheetCSV(spreadsheetId, "Artworks");
      salesValues = await fetchPublicSheetCSV(spreadsheetId, "Sales_Invoices").catch(() => []);
      logValues = await fetchPublicSheetCSV(spreadsheetId, "Inventory_Log").catch(() => []);
    }
  } else {
    // Visitor mode without accessToken: pull directly from public gviz endpoint
    artworkValues = await fetchPublicSheetCSV(spreadsheetId, "Artworks");
    salesValues = await fetchPublicSheetCSV(spreadsheetId, "Sales_Invoices").catch(() => []);
    logValues = await fetchPublicSheetCSV(spreadsheetId, "Inventory_Log").catch(() => []);
  }

  const artworks = artworkValues
    .filter((row: any[]) => row && row[0])
    .map((row: any[]) => ({
      id: String(row[0]),
      titleAr: String(row[1] || "لوحة قلم جاف"),
      title: String(row[1] || "Stilo Artwork"),
      dimensions: String(row[2] || "50x70 cm"),
      drawingHours: Number(row[3]) || 50,
      penColors: typeof row[4] === 'string' ? row[4].split(",").map((c: string) => c.trim()) : (Array.isArray(row[4]) ? row[4] : ["أزرق جاف"]),
      paperType: String(row[5] || "ورق فني 300 غرام"),
      creationYear: String(row[6] || "2024"),
      price: Number(row[7]) || 0,
      status: String(row[8] || "available"),
      imageUrl: String(row[9] || ""),
      description: String(row[10] || ""),
      certificateNumber: String(row[11] || ""),
      frameIncluded: row[12] === "نعم" || row[12] === "true" || row[12] === true,
      createdAt: String(row[13] || new Date().toISOString())
    }));

  const sales = salesValues
    .filter((row: any[]) => row && row[0])
    .map((row: any[]) => ({
      invoiceNumber: String(row[0]),
      artworkId: String(row[1] || ""),
      artworkTitle: String(row[2] || ""),
      customerName: String(row[3] || ""),
      customerPhone: String(row[4] || ""),
      customerAddress: String(row[5] || ""),
      customerEmail: String(row[6] || ""),
      saleDate: String(row[7] || ""),
      originalPrice: Number(row[8]) || 0,
      discount: Number(row[9]) || 0,
      finalPrice: Number(row[10]) || 0,
      paymentMethod: String(row[11] || "cash"),
      status: String(row[12] || "completed"),
      notes: String(row[13] || "")
    }));

  const inventoryLogs = logValues
    .filter((row: any[]) => row && row[0])
    .map((row: any[]) => ({
      id: String(row[0]),
      artworkId: String(row[1] || ""),
      artworkTitle: String(row[2] || ""),
      action: String(row[3] || ""),
      timestamp: String(row[4] || ""),
      details: String(row[5] || "")
    }));

  return { artworks, sales, inventoryLogs };
}

function parseCSV(text: string): string[][] {
  const lines: string[][] = [];
  let row: string[] = [];
  let inQuotes = false;
  let current = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(current);
      current = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      row.push(current);
      lines.push(row);
      row = [];
      current = '';
    } else {
      current += char;
    }
  }
  if (current || row.length > 0) {
    row.push(current);
    lines.push(row);
  }
  return lines;
}

async function fetchPublicSheetCSV(spreadsheetId: string, sheetName: string): Promise<string[][]> {
  const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const csvText = await res.text();
  const rows = parseCSV(csvText);
  return rows.slice(1).filter(r => r.length > 0 && r[0]);
}
