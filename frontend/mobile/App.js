import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
} from "react-native";

const API_URL = "http://192.168.18.173:5000";
// Example for real device on same Wi-Fi: http://192.168.1.5:5000
// Example for Android Emulator: http://10.0.2.2:5000

export default function App() {
  const [title, setTitle] = useState("");
  const [tasks, setTasks] = useState([]);

  const loadTasks = async () => {
    try {
      const res = await fetch(`${API_URL}/tasks`);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.log("Load error:", err);
    }
  };

  const addTask = async () => {
    if (!title.trim()) return;

    try {
      const res = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      if (res.ok) {
        setTitle("");
        loadTasks();
      }
    } catch (err) {
      console.log("Create error:", err);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>My Tasks</Text>

      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Enter task"
        style={styles.input}
      />

      <Button title="Add Task" onPress={addTask} />

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ marginTop: 20 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.taskTitle}>{item.title}</Text>
            <Text style={styles.taskDate}>{item.createdAt}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 40,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  card: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 10,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  taskDate: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
});
