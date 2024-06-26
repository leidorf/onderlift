// pages/api/upload.js
import formidable from 'formidable-serverless';
import fs from 'fs/promises';
import path from 'path';
import pool from '../../server/database';

export const config = {
  api: {
    bodyParser: false, // FormData işleme için bodyParser devre dışı bırakılıyor
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm({
      uploadDir: './public/images', // Resimleri yüklemek için dizin
      keepExtensions: true, // Dosya uzantısını koru
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Form parse hatası:', err);
        return res.status(500).json({ success: false, error: 'Form parse hatası' });
      }

      // Veritabanına eklenecek alanlar
      const { x_position, y_position, z_position, yaw, roll, pitch } = fields;
      let photoPath = null;

      if (files.photo) {
        try {
          // Dosya adını ve yolunu belirle
          const fileName = `${Date.now()}-${files.photo.name}`;
          const filePath = path.join(form.uploadDir, fileName);
          await fs.rename(files.photo.path, filePath); // Dosyayı kalıcı yerine taşı
          photoPath = `/images/${fileName}`; // Dosya yolu
        } catch (error) {
          console.error('Dosya işleme hatası:', error);
          return res.status(500).json({ success: false, error: 'Dosya işleme hatası' });
        }
      }

      try {
        // Robot verisini veritabanına ekle
        const query = `
          INSERT INTO robot (x_position, y_position, z_position, yaw, roll, pitch, photo_path)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await pool.query(query, [
          x_position,
          y_position,
          z_position,
          yaw,
          roll,
          pitch,
          photoPath,
        ]);

        res.status(200).json({ success: true, message: 'Robot başarıyla yüklendi' });
      } catch (error) {
        console.error('Veritabanı hatası:', error);
        res.status(500).json({ success: false, error: 'Veritabanı hatası' });
      }
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ success: false, error: `Method ${req.method} not allowed` });
  }
}
