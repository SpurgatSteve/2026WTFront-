<template>
  <main>
    <h1>WebTech Todo-App</h1>
    <!-- Zeigt Ladetext während Daten geholt werden -->
    <p v-if="loading">Daten werden geladen...</p>
    <!-- Zeigt Fehlermeldung wenn Backend nicht erreichbar -->
    <p v-if="error">{{ error }}</p>
    <!-- TaskList bekommt die tasks vom Backend als Prop -->
    <TaskList :tasks="tasks" />
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import TaskList from '@/components/TaskList.vue'

// ref() erstellt reaktive Variablen - Vue aktualisiert die Anzeige automatisch
const tasks = ref<Array<{ title: string; description: string; completed: boolean }>>([])
const loading = ref(true)
const error = ref('')

// Funktion die Daten vom Backend holt (asynchroner GET-Request)
function loadTasks() {
  const endpoint = 'http://localhost:8080/tasks'
  const requestOptions = {
    method: 'GET',
    redirect: 'follow' as RequestRedirect
  }

  fetch(endpoint, requestOptions)
      .then(response => response.json())
      .then(data => {
        // Daten vom Backend in die reaktive Variable schreiben
        data.forEach((task: { title: string; description: string; completed: boolean }) => {
          tasks.value.push(task)
        })
        loading.value = false
      })
      .catch(err => {
        console.log('error', err)
        error.value = 'Backend nicht erreichbar'
        loading.value = false
      })
}

// onMounted: wird aufgerufen wenn die Komponente zum ersten Mal gerendert wird
// Hier laden wir die Daten vom Backend
onMounted(() => {
  loadTasks()
})
</script>
