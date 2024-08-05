import formidable from "formidable-serverless";
import pool from "../../server/db";
import rateLimit from "express-rate-limit";

export const config = {
  api: {
    bodyParser: false,
  },
};

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Cok fazla istek gonderildi, lutfen bir sure sonra tekrar deneyiniz.",
});

export default async function handler(req, res) {
  await new Promise((resolve, reject) => {
    limiter(req, res, (result) => (result instanceof Error ? reject(result) : resolve(result)));
  });

  //  /api/add-robot API
  if (req.method === "POST") {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields) => {
      if (err) {
        console.error("Form parse hatası:", err);
        return res.status(500).json({ success: false, error: "Form parse hatası" });
      }

      const { ip_address } = fields;

      if (!ip_address || typeof ip_address !== "string" || !ip_address.match(/^(\d{1,3}\.){3}\d{1,3}$/)) {
        return res.status(400).json({ success: false, error: "Geçersiz IP adresi" });
      }

      try {
        const query = `
          INSERT INTO robots (ip_address, created_at)
          VALUES (?, CURRENT_TIMESTAMP())
        `;
        const [result] = await pool.query(query, [ip_address]);

        res.status(200).json({ success: true, message: "Robot başarıyla kaydedildi" });
      } catch (error) {
        console.error("Veritabanı hatası:", error);
        res.status(500).json({ success: false, error: "Veritabanı hatası" });
      }
    });
  }

  // /api/robot info API
  else if (req.method === "GET") {
    const { robot_id } = req.query;

    try {
      const [rows] = await pool.query("SELECT * FROM robots WHERE robot_id = ?", [robot_id]);
      if (rows.length === 0) {
        return res.status(404).json({ success: false, error: "Robot bulunamadı" });
      }
      res.status(200).json(rows[0]);
    } catch (error) {
      console.error("Veritabanı hatası:", error);
      res.status(500).json({ success: false, error: "Veritabanı hatası" });
    }
  }

  // /api/update-robot API
  else if (req.method === "PUT") {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields) => {
      const { robot_id, ip_address } = fields;

      if (!ip_address || typeof ip_address !== "string" || !ip_address.match(/^(\d{1,3}\.){3}\d{1,3}$/)) {
        return res.status(400).json({ success: false, error: "Geçersiz IP adresi" });
      }
      try {
        const query = `
          UPDATE robots 
          SET ip_address = ?
          WHERE robot_id = ?
        `;
        const [result] = await pool.query(query, [ip_address, robot_id]);

        if (result.affectedRows === 0) {
          return res.status(404).json({ success: false, message: "Robot bulunamadı" });
        }

        res.status(200).json({ success: true, message: "Robot IP adresi başarıyla güncellendi" });
      } catch (error) {
        console.error("Veritabanı hatası:", error);
        res.status(500).json({ success: false, error: "Veritabanı hatası" });
      }
    });
  }

  // /api/delete-robot API
  else if (req.method === "DELETE") {
    const { robot_id } = req.query;

    if (!robot_id) {
      return res.status(400).json({ success: false, error: "Robot ID belirtilmeli" });
    }

    try {
      await pool.query("DELETE FROM waypoints WHERE robot_id = ?", [robot_id]);

      await pool.query("DELETE FROM robots WHERE robot_id = ?", [robot_id]);

      res.status(200).json({ success: true, message: "Robot başarıyla silindi" });
    } catch (error) {
      console.error("Veritabanı hatası:", error);
      res.status(500).json({ success: false, error: "Veritabanı hatası" });
    }
  } else {
    res.setHeader("Allow", ["POST"], ["GET"], ["PUT"], ["DELETE"]);
    res.status(405).json({ success: false, error: `Method ${req.method} not allowed` });
  }
}
