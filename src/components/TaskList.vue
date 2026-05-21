<template>
  <h2 class="mb-3">Meine Aufgaben</h2>

  <div class="btn-group mb-2">
    <button
      class="btn btn-sm"
      :class="filter === 'alle' ? 'btn-primary' : 'btn-outline-primary'"
      @click="filter = 'alle'"
    >
      Alle
    </button>
    <button
      class="btn btn-sm"
      :class="filter === 'offen' ? 'btn-warning' : 'btn-outline-warning'"
      @click="filter = 'offen'"
    >
      Offen
    </button>
    <button
      class="btn btn-sm"
      :class="filter === 'erledigt' ? 'btn-success' : 'btn-outline-success'"
      @click="filter = 'erledigt'"
    >
      Erledigt
    </button>
  </div>

  <button class="btn btn-sm btn-outline-secondary ms-2 mb-2" @click="sortByTitle()">
    Nach Titel sortieren
  </button>

  <table class="table table-striped table-hover">
    <thead class="table-dark">
      <tr>
        <th>Titel</th>
        <th>Beschreibung</th>
        <th>Status</th>
        <th>Aktionen</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="filteredTasks.length === 0">
        <td colspan="4" class="text-center text-muted">Keine Aufgaben vorhanden</td>
      </tr>
      <tr v-for="task in filteredTasks" :key="task.id">
        <td v-if="editingId === task.id">
          <input v-model="editTitle" class="form-control form-control-sm" type="text" />
        </td>
        <td v-else>{{ task.title }}</td>

        <td v-if="editingId === task.id">
          <input v-model="editDescription" class="form-control form-control-sm" type="text" />
        </td>
        <td v-else>{{ task.description }}</td>

        <td>
          <button
            class="btn btn-sm"
            :class="task.completed ? 'btn-success' : 'btn-warning'"
            @click="toggleCompleted(task)"
          >
            {{ task.completed ? 'Erledigt' : 'Offen' }}
          </button>
        </td>

        <td>
          <template v-if="editingId === task.id">
            <button class="btn btn-sm btn-success me-1" @click="saveEdit(task)">Speichern</button>
            <button class="btn btn-sm btn-secondary" @click="cancelEdit()">Abbrechen</button>
          </template>
          <template v-else>
            <button class="btn btn-sm btn-primary me-1" @click="startEdit(task)">Bearbeiten</button>
            <button class="btn btn-sm btn-danger" @click="deleteTask(task)">Löschen</button>
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

const emit = defineEmits(['taskDeleted'])

const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL
const filter = ref('alle')
const editingId = ref<number | null>(null)
const editTitle = ref('')
const editDescription = ref('')

const filteredTasks = computed(() => {
  if (filter.value === 'offen') {
    return props.tasks.filter((t) => !t.completed)
  } else if (filter.value === 'erledigt') {
    return props.tasks.filter((t) => t.completed)
  }
  return props.tasks
})

function sortByTitle() {
  props.tasks.sort((a, b) => a.title.localeCompare(b.title))
}

async function toggleCompleted(task: Task) {
  const endpoint = baseUrl + '/tasks/' + task.id
  const data = {
    title: task.title,
    description: task.description,
    completed: !task.completed,
  }

  try {
    await axios.put(endpoint, data)
    task.completed = !task.completed
  } catch (err) {
    console.log('error', err)
  }
}

function startEdit(task: Task) {
  editingId.value = task.id ?? null
  editTitle.value = task.title
  editDescription.value = task.description
}

function cancelEdit() {
  editingId.value = null
}

async function saveEdit(task: Task) {
  const endpoint = baseUrl + '/tasks/' + task.id
  const data = {
    title: editTitle.value,
    description: editDescription.value,
    completed: task.completed,
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
