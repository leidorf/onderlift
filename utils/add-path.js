import axios from "axios";

export const handleAddPath = async (robotId, x, y, z) => {
  try {
    await axios.post("/api/add-path", {
      robot_id: robotId,
      x_position: x,
      y_position: y,
      z_position: z,
    });

  } catch (error) {
    console.error("Yol ekleme hatası:", error);
  }
};
