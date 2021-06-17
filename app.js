const ajax = new XMLHttpRequest()
const numbers = document.getElementById('numbers')
const cardList = document.getElementById('cart-list')
const totalPrice = document.getElementById('total-price')
const gamesList = document.getElementById('game-types')
const gameDescription = document.getElementById('description')
const clearGameButton = document.getElementById('clearGameButton')
const completeGameButton = document.getElementById('completeGameButton')
const addToCartButton = document.getElementById('addToCartButton')
const deleteCartButton = document.getElementById('deleteCartButton')

addToCartButton.addEventListener('click', handleAddToCart)
clearGameButton.addEventListener('click', handleClearGame)
completeGameButton.addEventListener('click', handleCompleteGame)
// deleteCartButton.addEventListener('click', handleDeleteCart)

let data = []
let selectedNumber = []
let cart = []
let currentGameMaxNumbers = 0
let currentGameRange = 0
let currentGamePrice = 0
let currentGameType = ''

function getData() {
  ajax.open('GET', 'games.json')
  ajax.send()
  ajax.addEventListener('readystatechange', () => {
    if (ajax.readyState === 4 && ajax.status === 200) {
      data = JSON.parse(ajax.responseText)
      gamesList.innerHTML = [...data.types]
        .map((game, index) => {
          return index === 0
            ? `
                        <button
                          id="${game.type}"
                          active="true"
                          class="gameButton ${game.type}"
                          onclick="handlePickGame(${game['max-number']},${game.range},'${game.type}',${game.price},'${game.description}')">
                          ${game.type}
                          </button>`
            : `
                        <button
                          id="${game.type}"
                          class="gameButton ${game.type}"
                          onclick="handlePickGame(${game['max-number']},${game.range},'${game.type}',${game.price},'${game.description}')">
                          ${game.type}
                        </button>
                        `
        })
        .join('')
    }
  })
}

function formatCurrency(value) {
  return (value = value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }))
}

number = document.querySelector('input#number')

function handleSelectNumber(index, maxLimit) {
  let newEntry = index + 1

  if (selectedNumber.includes(newEntry)) {
    selectedNumber.splice(selectedNumber.indexOf(newEntry), 1)
    selectedNumber.sort((a, b) => a - b)
    number[index].classList.remove('numberSelected')
  } else if (selectedNumber.length >= maxLimit) {
    alert(`Ja foram selecionado a quantidade maxima de números: ${maxLimit}`)
  } else {
    selectedNumber.push(newEntry)
    selectedNumber.sort((a, b) => a - b)
    number[index].classList.add('numberSelected')
  }
}

function handleCompleteGame() {
  const min = 1
  let max = currentGameMaxNumbers
  let range = currentGameRange
  let currentArray = []

  for (i = 1; i <= range; i++) {
    currentArray.push(i)
  }

  if (selectedNumber.length === 0) {
    for (let i = 0; i < max; i++) {
      let randomNum = Math.floor(Math.random() * range) + min
      let check = selectedNumber.includes(randomNum)

      if (check === false) {
        selectedNumber.push(randomNum)
        number[randomNum - 1].classList.add('numberSelected')
      } else {
        while (check === true) {
          randomNum = Math.floor(Math.random() * range) + min
          check = selectedNumber.includes(randomNum)
          if (check === false) {
            selectedNumber.push(randomNum)
            number[randomNum - 1].classList.add('numberSelected')
          }
        }
      }
    }
  }

  if (selectedNumber.length > 0) {
    let changedMax = max - selectedNumber.length
    for (let i = 0; i < changedMax; i++) {
      let randomNum = Math.floor(Math.random() * range) + min
      let check = selectedNumber.includes(randomNum)

      if (check === false) {
        selectedNumber.push(randomNum)
        number[randomNum - 1].classList.add('numberSelected')
      } else {
        while (check === true) {
          randomNum = Math.floor(Math.random() * range) + min
          check = selectedNumber.includes(randomNum)
          if (check === false) {
            selectedNumber.push(randomNum)
            number[randomNum - 1].classList.add('numberSelected')
          }
        }
      }
    }
  }
}

function handleClearGame() {
  selectedNumber.forEach(item => {
    number[item - 1].classList.remove('numberSelected')
  })
  selectedNumber = []
}

function handleAddToCart() {
  const listOfNumbers = selectedNumber.sort((a, b) => a - b).join()

  let cardClass = ''
  if (currentGameMaxNumbers === 15) {
    cardClass = 'cartCardLotofacil'
  }
  if (currentGameMaxNumbers === 6) {
    cardClass = 'cartCardMegasena'
  }
  if (currentGameMaxNumbers === 5) {
    cardClass = 'cartCardQuina'
  }

  cardList.innerHTML += `
                          <div class="cartCard" id="card-${currentGameMaxNumbers}">
                              <img src="assets/trash.svg" class="cartCardIcon" id="deleteCartButton"/>
                              <div class="${cardClass}Content">
                                  <span class="cartCardNumbers">
                                    ${listOfNumbers}
                                  </span>
                                  <div class="cartCardGame">
                                    <strong class="${cardClass}">${currentGameType}</strong>
                                    <p class="cartCardPrice">${formatCurrency(
                                      currentGamePrice
                                    )}</p>
                                  </div>
                              </div>
                          </div>
                          `
  cart.push({
    id: currentGameMaxNumbers,
    price: currentGamePrice,
  })
  calculateTotal()
}

function handleDeleteCart(id) {
  const item = document.getElementById(`card-${id}`)
  item.parentNode.removeChild(item)
  cart.map((item, index) => {
    if (item.id === id) {
      cart.splice(index, 1)
    }
  })
  calculateTotal()
}

function calculateTotal() {
  let cartTotal = 0
  cart.map(item => {
    cartTotal += item.price
    return cartTotal
  })
  totalPrice.innerHTML = formatCurrency(cartTotal)
}

function handlePickGame(maxNumber, range, type, price, description) {
  renderNumbers(maxNumber, range)
  gameDescription.innerHTML = description
  currentGameMaxNumbers = maxNumber
  currentGameRange = range
  currentGameType = type
  currentGamePrice = price
}

function renderNumbers(maxNumber, maxRange) {
  numbers.innerHTML = ''
  selectedNumber = []

  for (let index = 0; index < maxRange; index++) {
    let html = `<input type="button" class="gameNumber" value="${
      index + 1
    }" id="number" onclick="handleSelectNumber(${index},${maxNumber})">`
    numbers.innerHTML += html
  }
}

getData()
