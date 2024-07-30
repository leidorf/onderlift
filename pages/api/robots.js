import pool from "../../server/db";

export default async function handler(req, res) {
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
