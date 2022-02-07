import TextField from '@mui/material/TextField'
import { Button, Container, InputLabel, Select, Grid, Typography } from '@mui/material';
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
      
      console.table(response)
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
    <Container maxWidth="xs">
      <Grid container>

      </Grid>
      
      <Typography component="h1" variant="h5" align="center">Create task</Typography>
      {
        isSuccess && <p>Task saved</p>
      }
      {
        <p>{serverError}</p>
      }
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="name" 
              id="name"
              name="name"
              helperText={formErrors.name}
              onBlur={handleBlur}
              error={formErrors.name.length > 0}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="description" 
              id="description"
              name="description"
              helperText={formErrors.description}
              onBlur={handleBlur}
              error={formErrors.description.length > 0}

            />
          </Grid>
          <Grid item xs={12}>
            <InputLabel htmlFor="state">State</InputLabel>
            <Select
              error={formErrors.state.length > 0}
              fullWidth
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
            {formErrors.state.length > 0 && <p>{formErrors.state}</p>}

          </Grid>
          <Grid item xs={12}>
            <Button 
              color='primary'
              fullWidth
              type='submit'
              disabled={sendData}
            >
              Submit
            </Button>
            
          </Grid>   
        </Grid>
      </form>
    </Container>
  )
}


export default Form;
