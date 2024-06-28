import pool from '../../server/db';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, error: 'Robot ID belirtilmeli' });
  }

  try {
    // Robotu veritabanından sil
    await pool.query('DELETE FROM path WHERE robot_id = ?', [id]); // Path tablosundaki kayıtları sil

    // Şimdi robotu sil
    await pool.query('DELETE FROM robot WHERE id = ?', [id]);

    res.status(200).json({ success: true, message: 'Robot başarıyla silindi' });
  } catch (error) {
    console.error('Veritabanı hatası:', error);
    res.status(500).json({ success: false, error: 'Veritabanı hatası' });
  }
}
