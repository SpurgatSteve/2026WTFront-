<template>
  <h2>Meine Aufgaben</h2>

  <!-- Filter-Buttons -->
  <div class="filter-buttons">
    <button :class="{ active: filter === 'alle' }" @click="filter = 'alle'">Alle</button>
    <button :class="{ active: filter === 'offen' }" @click="filter = 'offen'">Offen</button>
    <button :class="{ active: filter === 'erledigt' }" @click="filter = 'erledigt'">Erledigt</button>
  </div>

  <!-- Sortierung -->
  <div class="sort-buttons">
    <button @click="sortByTitle()">Nach Titel sortieren</button>
  </div>

  <table>
    <thead>
    <tr>
      <th>Titel</th>
      <th>Beschreibung</th>
      <th>Status</th>
      <th>Aktionen</th>
    </tr>
    </thead>
    <tbody>
    <tr v-if="filteredTasks.length === 0">
      <td colspan="4">Keine Aufgaben vorhanden</td>
    </tr>
    <tr v-for="task in filteredTasks" :key="task.id">
      <!-- Bearbeiten-Modus -->
      <td v-if="editingId === task.id">
        <input v-model="editTitle" type="text">
      </td>
      <td v-else>{{ task.title }}</td>

      <td v-if="editingId === task.id">
        <input v-model="editDescription" type="text">
      </td>
      <td v-else>{{ task.description }}</td>

      <td>
        <button @click="toggleCompleted(task)" :class="{ completed: task.completed }">
          {{ task.completed ? 'Erledigt' : 'Offen' }}
        </button>
      </td>

      <td class="actions">
        <template v-if="editingId === task.id">
          <button class="save-btn" @click="saveEdit(task)">Speichern</button>
          <button class="cancel-btn" @click="cancelEdit()">Abbrechen</button>
        </template>
        <template v-else>
          <button class="edit-btn" @click="startEdit(task)">Bearbeiten</button>
          <button class="delete-btn" @click="deleteTask(task)">Loeschen</button>
        </template>
      </td>
    </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import axios from 'axios'

type Task = {
  id?: number
  title: string
  description: string
  completed: boolean
}

const props = defineProps<{
  tasks: Task[]
}>()

const emit = defineEmits(['taskUpdated', 'taskDeleted'])

const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL
const filter = ref('alle')
const editingId = ref<number | null>(null)
const editTitle = ref('')
const editDescription = ref('')

// Computed: filtert die Tasks je nach ausgewaehltem Filter
const filteredTasks = computed(() => {
  if (filter.value === 'offen') {
    return props.tasks.filter(t => !t.completed)
  } else if (filter.value === 'erledigt') {
    return props.tasks.filter(t => t.completed)
  }
  return props.tasks
})

// Nach Titel sortieren
function sortByTitle() {
  props.tasks.sort((a, b) => a.title.localeCompare(b.title))
}

// Task als erledigt/offen markieren (PUT)
async function toggleCompleted(task: Task) {
  const endpoint = baseUrl + '/tasks/' + task.id
  const data = {
    title: task.title,
    description: task.description,
    completed: !task.completed
  }

  try {
    await axios.put(endpoint, data)
    task.completed = !task.completed
  } catch (err) {
    console.log('error', err)
  }
}

// Bearbeiten starten
function startEdit(task: Task) {
  editingId.value = task.id ?? null
  editTitle.value = task.title
  editDescription.value = task.description
}

// Bearbeiten abbrechen
function cancelEdit() {
  editingId.value = null
}

// Bearbeitung speichern (PUT)
async function saveEdit(task: Task) {
  const endpoint = baseUrl + '/tasks/' + task.id
  const data = {
    title: editTitle.value,
    description: editDescription.value,
    completed: task.completed
  }

  try {
    await axios.put(endpoint, data)
    task.title = editTitle.value
    task.description = editDescription.value
    editingId.value = null
  } catch (err) {
    console.log('error', err)
  }
}

// Task loeschen (DELETE)
async function deleteTask(task: Task) {
  const endpoint = baseUrl + '/tasks/' + task.id

  try {
    await axios.delete(endpoint)
    emit('taskDeleted', task.id)
  } catch (err) {
    console.log('error', err)
  }
}
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}
th, td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}
th {
  background-color: #f4f4f4;
}
.filter-buttons, .sort-buttons {
  margin: 0.5rem 0;
}
.filter-buttons button, .sort-buttons button {
  padding: 6px 12px;
  margin-right: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  cursor: pointer;
}
.filter-buttons button.active {
  background-color: #4CAF50;
  color: white;
  border-color: #4CAF50;
}
.completed {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
}
.actions button {
  margin-right: 4px;
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.edit-btn { background-color: #2196F3; color: white; }
.delete-btn { background-color: #f44336; color: white; }
.save-btn { background-color: #4CAF50; color: white; }
.cancel-btn { background-color: #9e9e9e; color: white; }
input {
  padding: 4px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
}
</style>
