import React from 'react'
import {screen, render, fireEvent} from '@testing-library/react'

import Form from '../form/Form'

beforeEach(()=> render(<Form/>))

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
    it('should display validation messages', () => {
        expect(screen.queryByText(/the name is required/i)).not.toBeInTheDocument()
        expect(screen.queryByText(/the description is required/i)).not.toBeInTheDocument()
        expect(screen.queryByText(/the state is required/i)).not.toBeInTheDocument()

        fireEvent.click(screen.getByRole('button', {name:/submit/i}))

        expect(screen.queryByText(/the name is required/i)).toBeInTheDocument()
        expect(screen.queryByText(/the description is required/i)).toBeInTheDocument()
        expect(screen.queryByText(/the state is required/i)).toBeInTheDocument()


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