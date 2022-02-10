import axios from 'axios';

export const saveTask = ({name, description, state}) =>
axios({
  method: 'post',
  url: 'http://localhost:3000/tasks',
  data: {
    name: name,
    description: description,
    state: state
  }
});


export const getTasks = async () => {
  try {
    const response = await axios.get('http://localhost:3000/tasks');
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}



export default {
    saveTask, getTasks
}