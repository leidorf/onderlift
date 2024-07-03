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
        console.error("Form parsing error:", err);
        return res
          .status(500)
          .json({ success: false, error: "Form parsing error" });
      }

      const { id, map } = fields;

      try {
        // Update map data in the database
        await pool.query("UPDATE robots SET map = ? WHERE id = ?", [
          map,
          id,
        ]);

        res.status(200).json({
          success: true,
          message: "ROS map data saved successfully",
        });
      } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ success: false, error: "Database error" });
      }
    });
  } else {
    res.setHeader("Allow", ["POST"]);
    res
      .status(405)
      .json({ success: false, error: `Method ${req.method} not allowed` });
  }
}
