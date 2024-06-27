import formidable from 'formidable-serverless';
import fs from 'fs/promises';
import pool from '../../server/db';

export const config = {
  api: {
    bodyParser: false, // FormData işleme için bodyParser devre dışı bırakılıyor
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Form parse hatası:', err);
        return res.status(500).json({ success: false, error: 'Form parse hatası' });
      }

      const { x_position, y_position, z_position, yaw, roll, pitch } = fields;
      let photoBase64 = null;

      if (files.photo) {
        try {
          const fileData = await fs.readFile(files.photo.path);
          photoBase64 = fileData.toString('base64');
        } catch (error) {
          console.error('Dosya okuma hatası:', error);
          return res.status(500).json({ success: false, error: 'Dosya okuma hatası' });
        }
      }

      try {
        const query = `
          INSERT INTO robot (x_position, y_position, z_position, yaw, roll, pitch, photo)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await pool.query(query, [
          x_position,
          y_position,
          z_position,
          yaw,
          roll,
          pitch,
          photoBase64,
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
