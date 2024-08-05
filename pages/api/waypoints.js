import pool from '../../server/db';
import {rateLimit} from 'express-rate-limit';

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
    const { robot_id } = req.query;

    if (!robot_id) {
      return res.status(400).json({ success: false, message: 'Robot ID belirtilmeli' });
    }

    try {
      const query = 'SELECT * FROM waypoints WHERE robot_id = ?';
      const [waypoints] = await pool.query(query, [robot_id]);
      res.status(200).json(waypoints);
    } catch (error) {
      console.error('Veritabanı hatası:', error);
      res.status(500).json({ success: false, message: 'Veritabanı hatası' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ success: false, message: `Method ${req.method} not allowed` });
  }
}
