import axios from "axios";

export const deleteTask = async (task_id) => {
  try {
    await axios.delete(`/api/task?task_id=${task_id}`);
  } catch (error) {
    console.error("Yol silme hatası:", error);
  }
};

export const addTask = async (robot_id, waypoint_ids) => {
  try {
    const response = await axios.post("/api/task", {
      robot_id,
      waypoint_ids,
    });
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

export const assignTask = async (task_id) => {
  try {
    const response = await fetch("/api/assign-task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ task_id }),
    });

    if (response.ok) {
      alert("Görev başarıyla ROS'a gönderildi.");
    } else {
      const errorData = await response.json();
      alert(`Görev gönderilemedi: ${errorData.error}`);
    }
  } catch (error) {
    console.error("Görev gönderilemedi:", error);
    alert("Görev gönderilemedi.");
  }
};

