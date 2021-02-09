
const express = require('express')
const { groupToChunks, 
	numberToDollars, 
	numberToWords, 
	isValid 
} = require('./lib')

const port = process.env.PORT || 3000
const app = express()
app.use(express.json())

app.post('/numberToDollars', async (req, res) => {
	const { number } = req.body

	// simple validation
	if (!isValid(number)) {
		res.json({
			error: true,
			message: 'Invalid Number'
		})
		
		return
	}

	const chunks = groupToChunks(number)
	const dollars = numberToDollars(chunks)

	res.json({ dollars })
})

app.post('/numberToWords', async (req, res) => {
	const { number } = req.body

	// simple validation
	if (!isValid(number)) {
		res.json({
			error: true,
			message: 'Invalid Number'
		})

		return
	}

	const chunks = groupToChunks(number)
	const words = numberToWords(chunks)

	res.json({ words })
})

app.listen(port, () => {
	console.log(`listening on ${port}`)
})
