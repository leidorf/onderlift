import axios from "axios";

export const deleteRobot = async (robot, router) => {
  try {
    const confirmDelete = confirm(`Robot ${robot} silinsin mi?`);
    if (confirmDelete) {
      await axios.delete(`/api/delete-robot?id=${robot}`);
      alert("Robot başarıyla silindi!");
      router.push("/"); // Anasayfaya yönlendir
    }
  } catch (error) {
    console.error("Robot silme hatası:", error);
    alert("Robot silme sırasında bir hata oluştu.");
  }
};
