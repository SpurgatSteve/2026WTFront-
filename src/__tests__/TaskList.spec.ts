import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TaskList from '../components/TaskList.vue'

// Test: TaskList Komponente rendert korrekt
describe('TaskList', () => {
  // Test: Zeigt "Keine Aufgaben" wenn Liste leer ist
  it('zeigt Hinweis wenn keine Tasks vorhanden', () => {
    const wrapper = mount(TaskList, {
      props: {
        tasks: [],
      },
    })
    expect(wrapper.text()).toContain('Keine Aufgaben vorhanden')
  })

  // Test: Rendert Tasks korrekt mit v-for
  it('rendert Tasks in der Tabelle', () => {
    const tasks = [
      { id: 1, title: 'Test Task', description: 'Beschreibung', completed: false },
      { id: 2, title: 'Zweiter Task', description: 'Zweite Beschreibung', completed: true },
    ]
    const wrapper = mount(TaskList, {
      props: {
        tasks: tasks,
      },
    })
    expect(wrapper.text()).toContain('Test Task')
    expect(wrapper.text()).toContain('Zweiter Task')
    expect(wrapper.text()).toContain('Offen')
    expect(wrapper.text()).toContain('Erledigt')
  })

  // Test: Zeigt richtige Anzahl an Tabellenzeilen
  it('zeigt richtige Anzahl an Tasks', () => {
    const tasks = [
      { id: 1, title: 'Task 1', description: 'Beschreibung 1', completed: false },
      { id: 2, title: 'Task 2', description: 'Beschreibung 2', completed: false },
      { id: 3, title: 'Task 3', description: 'Beschreibung 3', completed: true },
    ]
    const wrapper = mount(TaskList, {
      props: {
        tasks: tasks,
      },
    })
    const rows = wrapper.findAll('tbody tr')
    expect(rows.length).toBe(3)
  })
})
