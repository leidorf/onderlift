import axios from "axios";

export const handleAddPath = async (robotId, x, y, z, router) => {
  try {
    await axios.post("/api/add-path", {
      robot_id: robotId,
      x_position: x,
      y_position: y,
      z_position: z,
    });

    alert("Yol başarıyla eklendi!");
    router.reload();
  } catch (error) {
    console.error("Yol ekleme hatası:", error);
    alert("Yol ekleme sırasında bir hata oluştu.");
  }
};
