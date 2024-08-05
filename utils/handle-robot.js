import axios from "axios";

export const deleteRobot = async (robot) => {
  try {
    const confirmDelete = confirm(`Robot ${robot} silinsin mi?`);
    if (confirmDelete) {
      await axios.delete(`/api/robot?robot_id=${robot}`);
      alert("Robot başarıyla silindi!");
    }
  } catch (error) {
    console.error("Robot silme hatası:", error);
  }
};

export const updateRobot = async (robot_id, new_ip) => {
  try {
    await axios.put(`/api/robot`, { robot_id: robot_id, ip_address: new_ip });
    alert("Robot IP adresi başarıyla güncellendi!");
  } catch (error) {
    console.error("Robot IP güncelleme hatası:", error);
    alert("Robot IP adresi güncellenirken bir hata oluştu.");
  }
};
