
const { chunkWords, onesWords, tensWords, teenWords } = require('./words')

exports.isValid = number => {
	const numericValue = parseInt(number)
	return numericValue > 0
}

// group a number into a chunk of maximum 3 digits
exports.groupToChunks = value => {
	let [nonDecimal, decimal = ''] = value.split('.')
	let chunks = []

	// truncate the decimal value
	decimal = decimal.substring(0, 2)

	let i
	for (i = nonDecimal.length; i >= 3; i-=3) {
		const newGroup = nonDecimal.substring(i - 3, i)
		chunks = [newGroup, ...chunks]
	}

	// push the remaining chunk if any
	const lastChunk = nonDecimal.substring(0, i)
	if (lastChunk) {
		chunks = [ lastChunk, ...chunks ]
	}

	return { chunks, decimal }
}

// change one chunk to a word
const chunkToWord = chunk => {
	const chunkLength = chunk.length
	const chunkArray = chunk.split('').map(s => parseInt(s))
	const number = parseInt(chunk)

	const chunkToWords = [];

	// handle teen numbers separately (10 to 19)
	if (chunkLength >= 2 && chunk[chunkLength - 2] == 1) {

		if (chunkLength == 3) {
			const onesWord = onesWords[chunkArray[0]]

			if (onesWord) {
				chunkToWords.push(onesWords[chunkArray[0]])
				chunkToWords.push('hundred')
			}
		}

		chunkToWords.push(teenWords[number%100 - 10])

	} else {

		switch(chunkLength) {
			case 3:
				const hundredsWord = onesWords[chunk[chunkLength - 3]] // the last digit

				// only if this digit is not zero
				if (hundredsWord) { 
					chunkToWords.push(hundredsWord)
					chunkToWords.push('hundred')
				}
			case 2:
				const tensWord = tensWords[chunk[chunkLength - 2]]

				if (tensWord) {
					chunkToWords.push(tensWord)
				}
			case 1:
				const onesWord = onesWords[chunk[chunkLength - 1]]

				if (onesWord) {
					chunkToWords.push(onesWord)
				}
		}

	}

	return chunkToWords
}

// change to dollars including cents
exports.numberToDollars = ({ chunks, decimal }) => {
	let words = []

	chunks.forEach((chunk, i) => {
		const len = chunks.length
		words = [ ...words, ...chunkToWord(chunk) ]

		const chunkNumber = parseInt(chunk)
		if (chunkNumber) {
			words.push(chunkWords[len - i - 1])
		}
	})

	// add cents
	if (decimal) {
		words.push('and')
		words = [ ...words, ...chunkToWord(decimal)]
		words.push('cents')
	}
	
	return words.join(' ')
}

// change to words excluding cents
exports.numberToWords = ({ chunks, decimal }) => {
	let words = []

	chunks.forEach((chunk, i) => {
		const len = chunks.length
		words = [ ...words, ...chunkToWord(chunk) ]

		const chunkNumber = parseInt(chunk)
		if (chunkNumber) {
			words.push(chunkWords[len - i - 1])
		}
	})
	
	return words.join(' ')
}
