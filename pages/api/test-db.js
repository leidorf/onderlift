// pages/api/test-db.js
import pool from "../../server/database";

export default async function handler(req, res) {
    try {
      const tableName = req.query.table; // URL'den tablo adını al
      if (!tableName) {
        return res.status(400).json({ success: false, error: "Table name is required" });
      }
      
      // Sütun adlarını al
      const [columns] = await pool.query(`SHOW COLUMNS FROM ${tableName}`);
      
      // Sütun adlarını dizi olarak döndür
      const columnNames = columns.map(column => column.Field);
      
      res.status(200).json({ success: true, columns: columnNames });
    } catch (error) {
      console.error("Veritabanı bağlantı hatası:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  }