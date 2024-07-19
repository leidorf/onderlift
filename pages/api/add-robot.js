import formidable from "formidable-serverless";
import pool from "../../server/db";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields) => {
      if (err) {
        console.error("Form parse hatası:", err);
        return res.status(500).json({ success: false, error: "Form parse hatası" });
      }

      const { ip_address } = fields;

      try {
        const query = `
          INSERT INTO robots (ip_address, created_at)
          VALUES (?, CURRENT_TIMESTAMP())
        `;
        const [result] = await pool.query(query, [ip_address]);

        res.status(200).json({ success: true, message: "Robot başarıyla kaydedildi" });
      } catch (error) {
        console.error("Veritabanı hatası:", error);
        res.status(500).json({ success: false, error: "Veritabanı hatası" });
      }
    });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ success: false, error: `Method ${req.method} not allowed` });
  }
}

/**
 * @swagger
 * /api/add-robot:
 *   post:
 *     tags:
 *       - robot
 *     summary: Add a new robot
 *     description: Adds a new robot to the database with the provided IP address.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               ip_address:
 *                 type: string
 *                 description: The IP address of the robot.
 *                 example: '192.168.1.100'
 *     responses:
 *       200:
 *         description: Robot başarıyla kaydedildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'Robot başarıyla kaydedildi'
 *       500:
 *         description: Form parse hatası or Veritabanı hatası
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: 'Form parse hatası'
 *       405:
 *         description: Method not allowed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: 'Method POST not allowed'
 */
