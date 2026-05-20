<template>
  <main>
    <h1>WebTech Todo-App</h1>
    <p v-if="loading">Daten werden geladen...</p>
    <p v-if="error">{{ error }}</p>
    <TaskList :tasks="tasks" />
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import type { AxiosResponse } from 'axios'
import TaskList from '@/components/TaskList.vue'

type Task = {
  title: string
  description: string
  completed: boolean
}

const tasks = ref<Task[]>([])
const loading = ref(true)
const error = ref('')

const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL

async function loadTasks() {
  const endpoint = baseUrl + '/tasks'

  try {
    const response: AxiosResponse = await axios.get(endpoint)
    const responseData: Task[] = response.data
    responseData.forEach((task: Task) => {
      tasks.value.push(task)
    })
    loading.value = false
  } catch (err) {
    console.log('error', err)
    error.value = 'Backend nicht erreichbar'
    loading.value = false
  }
}

onMounted(async () => {
  await loadTasks()
})
</script>
