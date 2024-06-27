import pool from '../../server/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { robot_id, x_position, y_position, z_position } = req.body;

    if (!robot_id || !x_position || !y_position || !z_position) {
      return res.status(400).json({ success: false, message: 'Eksik bilgi' });
    }

    try {
      const query = 'INSERT INTO path (robot_id, x_position, y_position, z_position) VALUES (?, ?, ?, ?)';
      const [result] = await pool.query(query, [robot_id, x_position, y_position, z_position]);

      res.status(200).json({ success: true, message: 'Yol başarıyla eklendi' });
    } catch (error) {
      console.error('Veritabanı hatası:', error);
      res.status(500).json({ success: false, message: 'Veritabanı hatası' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ success: false, message: `Method ${req.method} not allowed` });
  }
}
