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
