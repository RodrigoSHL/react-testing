import TextField from '@mui/material/TextField'
import { Button, InputLabel, Select } from '@mui/material';
import { React, useState } from 'react';
import { saveTask } from '../../services/TaskServices';
import { CREATED_STATUS, ERROR_SERVER_STATUS, INVALID_REQUEST_STATUS } from '../../consts/httpStatus';



export const Form = () => {
  const [sendData, setSendData] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState('');
  const [formErrors, setFormErrors] = useState({
    name: '',
    description: '',
    state: '',
  });

  const validateField = ({name, value}) => {
    setFormErrors((prevState) => ({
      ...prevState,
      [name]: value.length ? '' : `The ${name} is required`,
    }))
  }

  const validateForm = ({name,description,state}) => {
    validateField({name:'name',value: name});
    validateField({name:'description',value: description});
    validateField({name:'state',value: state});
  }

  const handleFetchErrors = async (err) => {
    if(err.status === ERROR_SERVER_STATUS){
      setServerError('Unexpected error, please try again')
    }
    if(err.status === INVALID_REQUEST_STATUS){
      const data = await err.json();
      setServerError(data.message)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSendData(true);

    const {name,description,state} =  e.target.elements;

    validateForm({name: name.value, description: description.value, state: state.value});

    try {
      const response = await saveTask({
        name: name.value, 
        description: description.value, 
        state: state.value
      });

      if(!response.ok) {
        throw response
      }

      if(response.status === CREATED_STATUS) {
        e.target.reset();
        setIsSuccess(true);
      } 
    } catch (err) {
      handleFetchErrors(err);
    }
    setSendData(false);
  }

  const handleBlur = (e) => {
    const {name, value} = e.target;
    validateField({name, value});
  }

  return (
    <>
      <h1>Create task</h1>
      {
        isSuccess && <p>Task saved</p>
      }
      {
        <p>{serverError}</p>
      }
      <form onSubmit={handleSubmit}>
          <TextField
            label="name" 
            id="name"
            name="name"
            helperText={formErrors.name}
            onBlur={handleBlur}

          />
          <TextField
            label="description" 
            id="description"
            name="description"
            helperText={formErrors.description}
            onBlur={handleBlur}
          />
          <InputLabel htmlFor="state">State</InputLabel>
          <Select
            native
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
