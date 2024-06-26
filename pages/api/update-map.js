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

      const { id } = fields;

      if (!id) {
        return res.status(400).json({ success: false, error: 'Robot ID belirtilmeli' });
      }

      let photoPath = null;

      if (files.photo) {
        try {
          // Yeni dosya adını ve yolunu belirle
          const fileName = `${Date.now()}-${files.photo.name}`;
          const filePath = path.join(form.uploadDir, fileName);
          await fs.rename(files.photo.path, filePath); // Dosyayı kalıcı yerine taşı
          photoPath = `/images/${fileName}`; // Yeni dosya yolu
        } catch (error) {
          console.error('Dosya işleme hatası:', error);
          return res.status(500).json({ success: false, error: 'Dosya işleme hatası' });
        }
      }

      try {
        // Eski fotoğraf yolunu veritabanından al
        const [rows] = await pool.query('SELECT photo_path FROM robot WHERE id = ?', [id]);
        if (rows.length === 0) {
          return res.status(404).json({ success: false, error: 'Robot bulunamadı' });
        }

        const oldPhotoPath = rows[0].photo_path;

        // Veritabanında fotoğraf yolunu güncelle
        await pool.query('UPDATE robot SET photo_path = ? WHERE id = ?', [photoPath, id]);

        // Eski fotoğrafı sil
        if (oldPhotoPath) {
          try {
            await fs.unlink(`./public${oldPhotoPath}`);
          } catch (error) {
            console.error('Eski fotoğrafı silme hatası:', error);
          }
        }

        res.status(200).json({ success: true, message: 'Fotoğraf başarıyla güncellendi' });
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
