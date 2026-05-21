<template>
  <main>
    <h1>WebTech Todo-App</h1>

    <div class="create-form">
      <input v-model="titleField" placeholder="Titel" type="text" />
      <input
        v-model="descriptionField"
        placeholder="Beschreibung"
        type="text"
        @keyup.enter="save()"
      />
      <button type="button" @click="save()">Speichern</button>
    </div>

    <p v-if="loading">Daten werden geladen...</p>
    <p v-if="error">{{ error }}</p>

    <TaskList :tasks="tasks" @taskDeleted="removeTask" />
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import type { AxiosResponse } from 'axios'
import TaskList from '@/components/TaskList.vue'

type Task = {
  id?: number
  title: string
  description: string
  completed: boolean
}

const tasks = ref<Task[]>([])
const loading = ref(true)
const error = ref('')
const titleField = ref('')
const descriptionField = ref('')

const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL

async function loadTasks() {
  const endpoint = baseUrl + '/tasks'

  try {
    const response: AxiosResponse = await axios.get(endpoint)
    tasks.value = response.data
    loading.value = false
  } catch (err) {
    console.log('error', err)
    error.value = 'Backend nicht erreichbar'
    loading.value = false
  }
}

async function save() {
  if (titleField.value.trim() === '') return

  const endpoint = baseUrl + '/tasks'
  const data: Task = {
    title: titleField.value,
    description: descriptionField.value,
    completed: false,
  }

  try {
    const response: AxiosResponse = await axios.post(endpoint, data)
    tasks.value.push(response.data)
    titleField.value = ''
    descriptionField.value = ''
  } catch (err) {
    console.log('error', err)
    error.value = 'Task konnte nicht gespeichert werden'
  }
}

// Task aus der lokalen Liste entfernen nach dem Loeschen
function removeTask(taskId: number) {
  tasks.value = tasks.value.filter((t) => t.id !== taskId)
}

onMounted(async () => {
  await loadTasks()
})
</script>

<style scoped>
.create-form {
  margin-bottom: 1rem;
}
.create-form input {
  padding: 8px;
  margin-right: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.create-form button {
  padding: 8px 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.create-form button:hover {
  background-color: #45a049;
}
</style>
