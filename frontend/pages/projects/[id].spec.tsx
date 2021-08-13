import { fireEvent, render } from '@testing-library/react'
import React from 'react'
import ProjectDetails from "./[id]"
import {screen} from '@testing-library/dom'

describe("... testing form", () => {
	const testNode = (
			<ProjectDetails></ProjectDetails>
		)
	beforeEach(() => {
		render(testNode);
	})
	it("... test start form", () => {

		let start = screen.getByText("Start")
	})
})