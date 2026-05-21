<template>
  <div class="container mt-4">
    <h1 class="mb-4">WebTech Todo-App</h1>

    <div class="input-group mb-4">
      <input v-model="titleField" class="form-control" placeholder="Titel" type="text">
      <input v-model="descriptionField" class="form-control" placeholder="Beschreibung" type="text" @keyup.enter="save()">
      <button class="btn btn-success" type="button" @click="save()">Speichern</button>
    </div>

    <p v-if="loading" class="text-muted">Daten werden geladen...</p>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <TaskList :tasks="tasks" @taskDeleted="removeTask" />
  </div>
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
    completed: false
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

function removeTask(taskId: number) {
  tasks.value = tasks.value.filter(t => t.id !== taskId)
}

onMounted(async () => {
  await loadTasks()
})
</script>
