export const saveTask = ({name, description, state}) =>
fetch('/tasks', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({name, description, state}),
})

export default {
    saveTask,
}