import axios from "axios";

export const deleteTask = async (task_id) => {
  try {
    await axios.delete(`/api/delete-task?task_id=${task_id}`);
  } catch (error) {
    console.error("Yol silme hatası:", error);
  }
};

export const addTask = async (robot_id, waypoint_ids) => {
  try {
    const response = await axios.post("/api/add-task", {
      robot_id,
      waypoint_ids,
    });

    if (response.status === 200) {
      alert("Görev başarıyla kaydedildi");
    }
  } catch (error) {
    alert("Görev kaydedilirken bir hata oluştu");
  }
};

export const deleteAllTasks = async (tasks) => {
  try {
    const deletePromises = tasks.map((task) => deleteTask(task.task_id));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error("Tüm yolları silerken hatayla karşılaşıldı:", error);
  }
};
