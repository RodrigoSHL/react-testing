import React from 'react'
import {screen, render} from '@testing-library/react'

import Form from '../form/Form'


describe('When the form is mounted', () => {
    it('there must be a created product form page', () => {
        render(<Form />);
        expect(
            screen.getByRole('heading', {name: /create product/i})
        ).toBeInTheDocument()
    })
})

