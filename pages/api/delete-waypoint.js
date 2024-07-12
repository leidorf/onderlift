import pool from '../../server/db';

export default async function handler(req, res) {
  const { waypoint_id } = req.query;

  if (!waypoint_id) {
    return res.status(400).json({ success: false, error: 'Düğüm ID belirtilmeli' });
  }

  try {
    await pool.query('DELETE FROM waypoints WHERE waypoint_id = ?', [waypoint_id]);

    res.status(200).json({ success: true, message: 'Düğüm başarıyla silindi' });
  } catch (error) {
    console.error('Veritabanı hatası:', error);
    res.status(500).json({ success: false, error: 'Veritabanı hatası' });
  }
}
