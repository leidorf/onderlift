import pool from '../../server/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { robot_id } = req.query;

    if (!robot_id) {
      return res.status(400).json({ success: false, message: 'Robot ID belirtilmeli' });
    }

    try {
      const query = 'SELECT * FROM tasks WHERE robot_id = ?';
      const [tasks] = await pool.query(query, [robot_id]);
      res.status(200).json(tasks);
    } catch (error) {
      console.error('Veritabanı hatası:', error);
      res.status(500).json({ success: false, message: 'Veritabanı hatası' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ success: false, message: `Method ${req.method} not allowed` });
  }
}
