import axios from "axios";

export const deletePath = async (node_id) => {
  try {
    await axios.delete(`/api/delete-path?node_id=${node_id}`);
  } catch (error) {
    console.error("Yol silme hatası:", error);
  }
};

export const deletePathConf = async (node_id) => {
  try {
    const confirmDeletePath = confirm(`Yol silinsin mi?`);
    if (confirmDeletePath) {
      await axios.delete(`/api/delete-path?node_id=${node_id}`);
      alert("Yol başarıyla silindi!");
    }
  } catch (error) {
    console.error("Yol silme hatası:", error);
    alert("Yol silme sırasında bir hata oluştu.");
  }
};

export const addPath = async (robotId, x, y, z) => {
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
