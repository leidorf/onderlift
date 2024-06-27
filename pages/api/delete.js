import pool from '../../server/db';
import fs from 'fs/promises';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, error: 'Robot ID belirtilmeli' });
  }

  try {
    // Eski fotoğraf yolunu veritabanından al
    const [rows] = await pool.query('SELECT photo FROM robot WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Robot bulunamadı' });
    }

    const oldPhoto = rows[0].photo;

    // Robotu veritabanından sil
    await pool.query('DELETE FROM robot WHERE id = ?', [id]);

    // Eski fotoğrafı sil
    if (oldPhoto) {
      try {
        const photoPath = `./public/images/${id}.jpg`;
        await fs.unlink(photoPath);
      } catch (error) {
        console.error('Eski fotoğrafı silme hatası:', error);
      }
    }

    res.status(200).json({ success: true, message: 'Robot başarıyla silindi' });
  } catch (error) {
    console.error('Veritabanı hatası:', error);
    res.status(500).json({ success: false, error: 'Veritabanı hatası' });
  }
}
