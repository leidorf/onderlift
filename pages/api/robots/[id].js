import pool from '../../../server/database';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query('SELECT * FROM robot WHERE id = ?', [id]);
      if (rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Robot bulunamadı' });
      }
      res.status(200).json(rows[0]);
    } catch (error) {
      console.error('Veritabanı hatası:', error);
      res.status(500).json({ success: false, error: 'Veritabanı hatası' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ success: false, error: `Method ${req.method} not allowed` });
  }
}
