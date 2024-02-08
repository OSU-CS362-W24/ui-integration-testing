/**
 * @jest-environment jsdom
 */

const fs = require("fs")
const domTesting = require('@testing-library/dom')
require('@testing-library/jest-dom')
const userEvent = require("@testing-library/user-event").default

function initDomFromFiles(htmlPath, jsPath) {
	const html = fs.readFileSync(htmlPath, 'utf8')
	document.open()
	document.write(html)
	document.close()
	jest.isolateModules(function() {
		require(jsPath)
	})
}

test("a photo card is added when the button is clicked with appropriate inputs", async function() {
	// Arrange:
	initDomFromFiles(`${__dirname}/photos.html`, `${__dirname}/photos.js`)
	
	// Acquire the two input fields
	const urlInput = domTesting.getByLabelText(document, "Photo URL")
	const captionInput = domTesting.getByLabelText(document, "Caption")
	
	// Acquire the button
	const addPhotoButton = domTesting.getByRole(document, "button")

	// Acquire the list of photo cards (currently empty)
	const photoCardList = domTesting.getByRole(document, "list")

	// Act:
	const user = userEvent.setup()
	await user.type(urlInput, "https://hips.hearstapps.com/hmg-prod/images/apple-pie-index-6425bd0363f16.jpg?crop=0.8888888888888888xw:1xh;center,top&resize=1200:*")
	await user.type(captionInput, "That's a tasty apple pie!")
	await user.click(addPhotoButton)

	// Assert:
	// Assert that the list is not empty
	expect(photoCardList).not.toBeEmptyDOMElement()

	// Get the images in the list
	const photoCards = domTesting.queryAllByRole(photoCardList, "listitem")

	expect(photoCards).toHaveLength(1)
	
	const img = domTesting.queryByRole(photoCards[0], "img")
	expect(img).not.toBeNull()
	expect(img).toHaveAttribute("src", "https://hips.hearstapps.com/hmg-prod/images/apple-pie-index-6425bd0363f16.jpg?crop=0.8888888888888888xw:1xh;center,top&resize=1200:*")
	
	expect(domTesting.queryByText(photoCards[0], "That's a tasty apple pie!")).not.toBeNull()
})
