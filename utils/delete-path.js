import axios from "axios";

export const deletePath = async (node_id, router) => {
  try {
    const confirmDeletePath = confirm(`Yol silinsin mi?`);
    if (confirmDeletePath) {
      await axios.delete(`/api/delete-path?node_id=${node_id}`);
      alert("Yol başarıyla silindi!");
      router.reload();
    }
  } catch (error) {
    console.error("Yol silme hatası:", error);
    alert("Yol silme sırasında bir hata oluştu.");
  }
};
