import TextField from '@mui/material/TextField'
import { Button, InputLabel, Select } from '@mui/material';
import { React, useState } from 'react';
import { waitFor } from '@testing-library/react';

export const Form = () => {
  const [sendData, setSendData] = useState(false);

  const [formErrors, setFormErrors] = useState({
    name: '',
    description: '',
    state: ''
  })

  const validateField = ({name, value}) => {
    setFormErrors((prevState) => ({...prevState, [name]: value.length ? '' : `The ${name} is required`}))
  }

  const validateForm = ({name,description,state}) => {
    validateField({name:'name',value: name.value});
    validateField({name:'description',value: description.value});
    validateField({name:'state',value: state.value});

  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSendData(true);

    const {name,description,state} =  e.target.elements
    validateForm({name,description,state})

    await fetch('/tasks', {
      method: 'POST',
      body: JSON.stringify({})
    })
    setSendData(false)
  }

  const handleBlur = (e) => {
    const {name, value} = e.target
    setFormErrors({...formErrors, [name]: value.length ? '' : `The ${name} is required`})
  }

  return (
    <>
      <h1>Create task</h1>
      <form onSubmit={handleSubmit}>
          <TextField
            label="name" 
            id="name"
            helperText={formErrors.name}
            onBlur={handleBlur}
            name="name"
          />
          <TextField
            label="description" 
            id="description"
            name="description"
            onBlur={handleBlur}
            helperText={formErrors.description}

          />
          <InputLabel htmlFor="state">State</InputLabel>
          <Select
            native
            value=""
            inputProps={{
              name: 'state',
              id: 'state'
            }}
          >
            <option aria-label='None' value=""/>
            <option value="1">In progress</option>
            <option value="2">Ok</option>
            <option value="3">Not completed</option>
  
          </Select>
          {formErrors.state.length && <p>{formErrors.state}</p>}
          <Button 
            type='submit'
            disabled={sendData}
          >
            Submit
          </Button>
      </form>
    </>
  )
}


export default Form;
