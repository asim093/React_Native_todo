import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

type Task = {
  text: string;
  completed: boolean;
};

export default function ToDoApp() {
  const [tasks, setTasks] = useState<Task[]>([
    { text: "Learn React Native", completed: false },
    { text: "Build a To-Do App", completed: false },
  ]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  // Toggle between light and dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const AddTodo = () => {
    if (inputValue) {
      setTasks([...tasks, { text: inputValue, completed: false }]);
      setInputValue("");
    }
  };

  const DeleteTodo = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const EditTodo = (index: number) => {
    setEditValue(tasks[index].text);
    setEditingIndex(index);
    setIsEditing(true);
  };

  const submitEdit = () => {
    if (editingIndex !== null && editValue) {
      const updatedTasks = [...tasks];
      updatedTasks[editingIndex].text = editValue;
      setTasks(updatedTasks);
      setIsEditing(false);
      setEditValue("");
      setEditingIndex(null);
    }
  };

  function completeTask(index: number) {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed; // Toggle completion status
    setTasks(updatedTasks);

    if (updatedTasks[index].completed) {
      setInputValue("Task Completed"); 
    } else {
      setInputValue(""); 
    }
  }

  const themeStyles = isDarkMode ? darkTheme : lightTheme;

  return (
    <View style={[styles.container, themeStyles.container]}>
      {/* Header with Dark Mode Toggle */}
      <View style={styles.header}>
        <Text style={[styles.headerText, themeStyles.headerText]}>
          To-Do List
        </Text>

        {/* Dark Mode Toggle Button */}
        <TouchableOpacity onPress={toggleDarkMode} style={styles.iconButton}>
          <Icon
            name={isDarkMode ? "sun-o" : "moon-o"}
            size={24}
            color={isDarkMode ? "#FFD700" : "#333"}
          />
        </TouchableOpacity>
      </View>

      {/* Task Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, themeStyles.input]}
          placeholder="Add a new task"
          placeholderTextColor={isDarkMode ? "#ccc" : "#aaa"}
          value={inputValue}
          onChangeText={setInputValue}
        />
        <TouchableOpacity style={styles.addButton} onPress={AddTodo}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Task List */}
      <ScrollView style={styles.taskList}>
        {tasks.map((task, index) => (
          <View key={index} style={[styles.taskItem, themeStyles.taskItem]}>
            <Text
              style={[
                styles.taskText,
                task.completed && styles.completedTask,
                themeStyles.taskText,
              ]}
            >
              {task.text}
            </Text>

            <View style={styles.taskActions}>
              {/* Complete Button */}
              <TouchableOpacity
                style={styles.completeButton}
                onPress={() => completeTask(index)}
              >
                <Text style={styles.completeButtonText}>
                  {task.completed ? "✓" : "X"}
                </Text>
              </TouchableOpacity>

              {/* Edit Icon */}
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => EditTodo(index)}
              >
                <Icon
                  name="edit"
                  size={20}
                  color={isDarkMode ? "#ff9800" : "#333"}
                />
              </TouchableOpacity>

              {/* Delete Icon */}
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => DeleteTodo(index)}
              >
                <Icon
                  name="trash"
                  size={20}
                  color={isDarkMode ? "#f44336" : "#333"}
                />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Edit Task Modal */}
      <Modal
        transparent={true}
        visible={isEditing}
        animationType="slide"
        onRequestClose={() => {
          setIsEditing(false); 
          setEditValue("");
          setEditingIndex(null);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Task</Text>
            <TextInput
              style={styles.modalInput}
              value={editValue}
              onChangeText={setEditValue}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={submitEdit}>
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setIsEditing(false)} // Close modal
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const lightTheme = StyleSheet.create({
  container: {
    backgroundColor: "#f5f5f5",
  },
  headerText: {
    color: "#333",
  },
  input: {
    backgroundColor: "#fff",
    color: "#333",
  },
  taskItem: {
    backgroundColor: "#fff",
  },
  taskText: {
    color: "#333",
  },
});

const darkTheme = StyleSheet.create({
  container: {
    backgroundColor: "#121212",
  },
  headerText: {
    color: "#fff",
  },
  input: {
    backgroundColor: "#333",
    color: "#fff",
  },
  taskItem: {
    backgroundColor: "#1e1e1e",
  },
  taskText: {
    color: "#fff",
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 32,
    fontWeight: "bold",
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  addButton: {
    backgroundColor: "#4a90e2",
    marginLeft: 10,
    borderRadius: 50,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  addButtonText: {
    fontSize: 24,
    color: "#fff",
  },
  taskList: {
    flex: 1,
    marginTop: 10,
  },
  taskItem: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  taskText: {
    fontSize: 18,
  },
  completedTask: {
    textDecorationLine: "line-through",
    color: "#aaa",
  },
  taskActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  completeButton: {
    backgroundColor: "#4caf50",
    borderRadius: 50,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  completeButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  iconButton: {
    marginHorizontal: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 15,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    backgroundColor: "#4a90e2",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  modalButtonText: {
    color: "#fff",
    textAlign: "center",
  },
});
