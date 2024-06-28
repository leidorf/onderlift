import pool from '../../server/db';

export default async function handler(req, res) {
  const { node_id } = req.query;

  if (!node_id) {
    return res.status(400).json({ success: false, error: 'Düğüm ID belirtilmeli' });
  }

  try {
    // Düğümü veritabanından sil
    await pool.query('DELETE FROM path WHERE node_id = ?', [node_id]);

    res.status(200).json({ success: true, message: 'Düğüm başarıyla silindi' });
  } catch (error) {
    console.error('Veritabanı hatası:', error);
    res.status(500).json({ success: false, error: 'Veritabanı hatası' });
  }
}
