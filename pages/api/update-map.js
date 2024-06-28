import formidable from "formidable-serverless";
import fs from "fs/promises";
import pool from "../../server/db";

export const config = {
  api: {
    bodyParser: false, // FormData processing for uploading files
  },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Form parsing error:", err);
        return res
          .status(500)
          .json({ success: false, error: "Form parsing error" });
      }

      const { id, paths } = fields;
      let photoBase64 = null;

      if (files.photo) {
        try {
          const fileData = await fs.readFile(files.photo.path);
          photoBase64 = fileData.toString("base64");
        } catch (error) {
          console.error("File read error:", error);
          return res
            .status(500)
            .json({ success: false, error: "File read error" });
        }
      }

      try {
        // Update photo in the database
        await pool.query("UPDATE robot SET photo = ? WHERE id = ?", [
          photoBase64,
          id,
        ]);

        // Delete existing paths
        await pool.query("DELETE FROM path WHERE robot_id = ?", [id]);

        // Insert new paths if available
        if (paths && paths.length > 0) {
          const pathValues = paths.map((path) => [
            id,
            path.x_position,
            path.y_position,
            path.z_position,
          ]);
          await pool.query(
            "INSERT INTO path (robot_id, x_position, y_position, z_position) VALUES ?",
            [pathValues]
          );
        }

        res
          .status(200)
          .json({
            success: true,
            message: "Photo and path updated successfully",
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
