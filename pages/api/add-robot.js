import formidable from "formidable-serverless";
import pool from "../../server/db";

export const config = {
  api: {
    bodyParser: false, 
  },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields) => {
      if (err) {
        console.error("Form parse hatası:", err);
        return res.status(500).json({ success: false, error: "Form parse hatası" });
      }

      const { ip_address } = fields;

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
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ success: false, error: `Method ${req.method} not allowed` });
  }
}
