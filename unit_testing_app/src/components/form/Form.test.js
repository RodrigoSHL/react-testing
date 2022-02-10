import React from 'react'
import {screen, render, fireEvent, waitFor} from '@testing-library/react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'

import Form from '../form/Form'
import { CREATED_STATUS,ERROR_SERVER_STATUS } from '../../consts/httpStatus'

//Se usa mock server worker (msw) para simular un endpoint 
const server = setupServer(
    rest.post('http://localhost:3000/tasks', (req, res, ctx) => {
        const {name, description, state} = req.body;
        if( name && description && state) {
            return res(ctx.status(CREATED_STATUS))
        }
        return res(ctx.status(ERROR_SERVER_STATUS))
    }),
)
  
beforeAll(() => server.listen())

afterAll(() => server.close())

beforeEach(()=> render(<Form/>))

afterEach(() => server.resetHandlers())

describe('When the form is mounted', () => {
    it('there must be a created product form page', () => {
        expect(
            screen.getByRole('heading', {name: /create task/i})
        ).toBeInTheDocument()
    })

    it('should exist the fields: task, description and state {in progress, completed, not completed}', () => {
        expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/state/i)).toBeInTheDocument()

        expect(screen.queryByText(/in progress/i)).toBeInTheDocument()
        expect(screen.queryByText(/not completed/i)).toBeInTheDocument()
        expect(screen.queryByText(/ok/i)).toBeInTheDocument()

    })

    it('should exists the submit button', () => {
        expect(screen.getByRole('button',{name: /submit/i})).toBeInTheDocument()
        

    })
})

describe('When the user submits the form without values', () => {
    it('should display validation messages', async () => {
        expect(screen.queryByText(/the name is required/i)).not.toBeInTheDocument()
        expect(screen.queryByText(/the description is required/i)).not.toBeInTheDocument()
        expect(screen.queryByText(/the state is required/i)).not.toBeInTheDocument()

        fireEvent.click(screen.getByRole('button', {name:/submit/i}))

        expect(screen.queryByText(/the name is required/i)).toBeInTheDocument()
        expect(screen.queryByText(/the description is required/i)).toBeInTheDocument()
        expect(screen.queryByText(/the state is required/i)).toBeInTheDocument()

        await waitFor(() =>
            expect(screen.getByRole('button', {name:/submit/i})).not.toBeDisabled()
        )
    })
})

describe('When the user blurs an empty field', () => {
    it('should display validation error message for the input name', () => {
        expect(screen.queryByText(/the name is required/i)).not.toBeInTheDocument()

        fireEvent.blur(screen.getByLabelText(/name/i), {
            target: {name: 'name', value: ''}
        })

        expect(screen.queryByText(/the name is required/i)).toBeInTheDocument()
    })

    it('should display validation error message for the input description', () => {
        expect(screen.queryByText(/the description is required/i)).not.toBeInTheDocument()

        fireEvent.blur(screen.getByLabelText(/description/i), {
            target: {name: 'description', value: ''}
        })

        expect(screen.queryByText(/the description is required/i)).toBeInTheDocument()
    })
    
})

describe('When the user submit form and the server return created status', () => {
    it('should the submit button be disabled until request is done', async () => {
        const submitBtn = screen.getByRole('button', {name:/submit/i});
        expect(submitBtn).not.toBeDisabled()
        
        fireEvent.click(submitBtn)

        expect(submitBtn).toBeDisabled()

        await waitFor(() =>
            expect(submitBtn).not.toBeDisabled())
    })    

    it('the form must display the success message "Task saved" and clean the fields values', async () => {
        const nameInput = screen.getByLabelText(/name/i);
        const descriptionInput = screen.getByLabelText(/description/i);
        const stateInput = screen.getByLabelText(/state/i);

        fireEvent.change(nameInput, {target: {name: 'name', value: 'tasking test'},})
        fireEvent.change(descriptionInput, {target: {name: 'name', value: 'task complete without observations'}})
        fireEvent.change(stateInput, {target: {name: 'name', value: '3'}})

        fireEvent.click(screen.getByRole('button', {name:/submit/i}));

        await waitFor(() => expect(screen.getByText(/task saved/i)).toBeInTheDocument())

        expect(nameInput).toHaveValue('')
        expect(descriptionInput).toHaveValue('')
        expect(stateInput).toHaveValue('')
    })  
})

