;(async function () {
  async function getGameData(json) {
    const response = await fetch(json)
    const results = await response.json()
    return results
  }

  const gameData = await getGameData('./games.json')
  let selectedGame = []

  let selectGameButtons = []
  let deleteButtons
  const gameDescription = document.querySelector('.gameDescription')
  const gameName = document.querySelector('.gameName')
  const gameFilterButton = document.querySelector('.gameFilterButton')
  const gameNumbers = document.querySelector('.gameNumbers')
  const clearButton = document.querySelector('.clearButton')
  const cartButton = document.querySelector('.cartButton')
  const cartItems = document.querySelector('.cartItems')
  const completeButton = document.querySelector('.completeButton')
  const saveButton = document.querySelector('.saveButton')
  const cartValue = document.querySelector('.cartValue')

  clearButton.addEventListener('click', clearGame)
  cartButton.addEventListener('click', addToCart)
  completeButton.addEventListener('click', getRandomNumbers)
  saveButton.addEventListener('click', saveCart)
  selectGameButtons.forEach(item => {
    item.addEventListener('click', selectGame)
  })

  function loadFilterButtons() {
    gameFilterButton.innerHTML = [...gameData['types']]
      .map((game, index) => {
        return index === 0
          ? `<button class="selectGame" active="true" id=${game['type']} style="color: #FFFFFF; background:${game['color']}; border-color: ${game['color']}">${game['type']}</button>`
          : `<button class="selectGame" id=${game['type']} style="color: ${game['color']}; border-color: ${game['color']}">${game['type']}</button>`
      })
      .join('')

    selectGameButtons = getElements('.selectGame')
    selectGameButtons.forEach(item => {
      item.addEventListener('click', selectGame)
    })

    getSelectedGame()
  }

  function loadGameContent() {
    gameName.innerHTML = `<h2>NEW BET</h2>
    <h2 class="gameName">FOR ${selectedGame['type'].toUpperCase()}</h2>`
    gameDescription.innerHTML = `<h4 style="margin-top: 28px;">Fill your bet</h4>
    <h4 class="gameDescription">${selectedGame['description']}</h4>`

    const range = selectedGame['range']

    showNumbers(range)
  }

  function selectGame(event) {
    selectGameButtons.forEach((item, index) => {
      item.removeAttribute('active')
      item.style.background = '#FFFFFF'
      item.style.color = gameData['types'][index]['color']
    })
    event.target.setAttribute('active', 'true')
    getSelectedGame()
    event.target.style.background = selectedGame['color']
    event.target.style.color = '#FFFFFF'
    loadGameContent()
  }

  function showNumbers(range) {
    let numbers = ''
    for (let i = 1; i <= range; i++) {
      numbers += `<button class="numbers" id=${i}>${i}</button>`
    }
    gameNumbers.innerHTML = numbers

    const numbersSelectButton = getElements('.numbers')
    numbersSelectButton.forEach(item => {
      item.addEventListener('click', selectNumber)
    })
  }

  function getElements(attribute) {
    return [...document.querySelectorAll(attribute)]
  }

  function selectNumber(event) {
    const selectedButtons = getElements('[selected]').length

    if (event.target.hasAttribute('selected')) {
      event.target.style.background = '#adc0c4'
      return event.target.removeAttribute('selected')
    }

    if (selectedButtons === selectedGame['max-number']) {
      return window.alert(
        'Você já selecionou a quantidade máxima de números por jogo, caso queira trocar algum número você precisa primeiro desmarcar algum.'
      )
    }
    event.target.style.background = selectedGame['color']
    event.target.setAttribute('selected', 'true')
  }

  function clearGame() {
    const numbers = getElements('[selected]')

    numbers.forEach(item => {
      item.style.background = '#adc0c4'
      item.removeAttribute('selected')
    })
  }

  function getSelectedGame() {
    const activeGame = selectGameButtons.find(item => {
      return item.hasAttribute('active')
    }).id
    selectedGame = gameData['types'].find(item => {
      return item['type'] === activeGame
    })
  }

  async function addToCart() {
    const selectedNumbers = getElements('[selected]').map(item => {
      return item.id
    })

    if (selectedNumbers.length < selectedGame['min-number'])
      return window.alert(
        `You need to mark at least ${selectedGame['min-number']} numbers`
      )

    await fetch('http://localhost:3000/games', {
      mode: 'cors',
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        game: selectedGame['type'],
        numbers: selectedNumbers,
        price: selectedGame['price'],
        color: selectedGame['color'],
      }),
    })
    loadCartContent()
    clearGame()
  }

  function formatValue(value) {
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
    return formatter.format(value)
  }

  async function loadCartContent() {
    const cartData = await getData('http://localhost:3000/games')
    let cartGames
    ;[...cartData].length
      ? (cartGames = cartData
          .map(item => {
            return `<div class="gameCard"><button class="deleteButton" id=${
              item.id
            }><i class="material-icons-outlined">delete</i></button><div class="cartDivisor" style="background: ${
              item['color']
            }" game=${
              item['game']
            }></div><div class="gameInfos"><h4 class="cartNumbers">${item[
              'numbers'
            ].join(', ')}</h4><div class="gameNamePrice"><h4 game=${
              item['game']
            } style="color: ${item['color']}">${
              item['game']
            }</h4><h4 class="gamePrice">${formatValue(
              item['price']
            )}</h4></div></div></div>`
          })
          .join(''))
      : (cartGames = '')

    cartGames === ''
      ? (cartItems.innerHTML = '<h2>CART EMPTY</h2>')
      : (cartItems.innerHTML = `<h2>CART</h2> ${cartGames}`)

    addEventListenerToDeleteButtons()

    const finalValue = await getFinalValue()

    finalValue
      ? (cartValue.innerHTML = `<h2>CART</h2>
    <h2 class="cartTotal">TOTAL: ${formatValue(finalValue)}</h2>`)
      : (cartValue.innerHTML = `<h2>CART</h2>
      <h2 class="cartTotal">TOTAL: R$ 00,00`)
  }

  function addEventListenerToDeleteButtons() {
    deleteButtons = getElements('.deleteButton')

    deleteButtons.forEach(item => {
      item.addEventListener('click', deleteGame)
    })
  }

  async function getFinalValue() {
    const cartData = await getData('http://localhost:3000/games')
    if (![...cartData].length) {
      return 0
    }
    return [
      ...cartData.map(item => {
        return item['price']
      }),
    ].reduce((acc, cur) => {
      return acc + cur
    })
  }

  async function deleteGame(event) {
    await fetch(`http://localhost:3000/games/${event.currentTarget.id}`, {
      method: 'DELETE',
    })
    await loadCartContent()
  }

  function getRandomNumbers() {
    const numbers = getElements('.numbers')
    const selectedNumbers = getElements('[selected]')

    if (selectedNumbers.length == selectedGame['max-number']) {
      return window.alert('Seu jogo está completo')
    }

    let randomNumbers = selectedNumbers.map(item => {
      return Number(item.id)
    })

    for (let i = 1; i < selectedGame['max-number']; i) {
      const random = Math.floor(Math.random() * (selectedGame['range'] - 1)) + 1
      randomNumbers.push(random)
      randomNumbers = [...new Set(randomNumbers)]
      i = randomNumbers.length
    }

    const activatedButtons = numbers.filter(item => {
      return randomNumbers.includes(Number(item.id))
    })

    activatedButtons.forEach(item => {
      item.style.background = selectedGame['color']
      item.setAttribute('selected', 'true')
    })
  }

  async function saveCart() {
    const cartValue = await getFinalValue()
    if (cartValue < gameData['min-cart-value']) {
      return window.alert(
        `The minimum value to make the purchase is ${formatValue(
          gameData['min-cart-value']
        )}`
      )
    }
  }

  loadFilterButtons()
  loadGameContent()
  loadCartContent()
})()
