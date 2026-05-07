<template>
  <main>
    <h1>WebTech Todo-App</h1>
    <TaskList :tasks="tasks" />
  </main>
</template>

<script setup lang="ts">
import TaskList from '@/components/TaskList.vue'

const tasks = [
  { title: 'Aufgabe 1', description: 'Erste Aufgabe', completed: false },
  { title: 'Aufgabe 2', description: 'Zweite Aufgabe', completed: true },
  { title: 'Aufgabe 3', description: 'Dritte Aufgabe', completed: false }
]
</script>
