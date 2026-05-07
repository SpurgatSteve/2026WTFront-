
<template>
  <h2>Meine Aufgaben</h2>
  <table>
    <thead>
      <tr>
        <th>Titel</th>
        <th>Beschreibung</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(task, index) in tasks" :key="index">
        <td>{{ task.title }}</td>
        <td>{{ task.description }}</td>
        <td>{{ task.completed ? 'Erledigt' : 'Offen' }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
defineProps<{
  tasks: Array<{ title: string; description: string; completed: boolean }>
}>()
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}
th,
td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}
th {
  background-color: #f4f4f4;
}
</style>

