import axios from "axios";
import { router } from "next/router";

export const updateMap = async (robotId, mapData) => {
  try {
    const formData = new FormData();
    formData.append('map', mapData);

    await axios.post(`/api/update-map?id=${robotId}`, formData);
    alert("Harita başarıyla güncellendi!");
    router.reload();
  } catch (error) {
    console.error("Harita güncelleme hatası:", error);
    alert("Harita güncelleme sırasında bir hata oluştu.");
  }
};
