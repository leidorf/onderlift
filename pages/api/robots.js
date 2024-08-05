import pool from "../../server/db";
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Cok fazla istek gonderildi, lutfen bir sure sonra tekrar deneyiniz.",
});

export default async function handler(req, res) {
  await new Promise((resolve, reject) => {
    limiter(req, res, (result) => (result instanceof Error ? reject(result) : resolve(result)));
  });

  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query('SELECT * FROM robots');
      res.status(200).json(rows);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch robot" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
