;(async function () {
  async function getGameData(json) {
    const response = await fetch(json)
    const results = await response.json()
    return results
  }

  const gameData = await getGameData('./games.json')

  let gameSelect = []
  let gameSelectButtons = []
  let deleteButtons
  const gameName = document.querySelector('.gameName')
  const gameFilterButtons = document.querySelector('.gameFilterButton')
  const gameDescription = document.querySelector('.gameDescription')
  const gameNumbers = document.querySelector('.gameNumbers')
  const completeButton = document.querySelector('.completeButton')
  const clearButton = document.querySelector('.clearButton')
  const cartButton = document.querySelector('.cartButton')
  const cartItems = document.querySelector('.cartItems')
  const cartValue = document.querySelector('.cartValue')

  completeButton.addEventListener('click', handleCompleteGame)
  clearButton.addEventListener('click', handleClearGame)
  cartButton.addEventListener('click', handleAddToCart)
  gameFilterButton.forEach(item => {
    item.addEventListener('click', handleFilterGame)
  })

  function loadFilterButtons() {
    gameFilterButtonsContent.innerHTML = [gameData['types']]
      .map((game, index) => {
        return index === 0
          ? `<button class="select-game" active="true" id=${game['type']} style="color: #FFFFFF; background:${game['color']}; border: 2px solid ${game['color']}">${game['type']}</button>`
          : `<button class="select-game" id=${game['type']} style="color: ${game['color']}; border: 2px solid ${game['color']}">${game['type']}</button>`
      })
      .join('')

    gameFilterButtons = getElement('.selectGame')
    gameFilterButtons = forEach(item => {
      item.addEventListener('click', selectGame)
    })
  }

  function loadGameContent() {
    gameName.innerHTML = `<h2>NEW BET</h2>
    <h2 class="gameName"> FOR ${selectedGame['type'].toUpperCase()}</h2>`
    description.innerHTML = `<h4>Fill your bet</h4>
    <h4 class="gameDescription">${selectedGame['description']}</h4>`

    const range = selectedGame['range']

    showNumbers(range)
  }

  function selectGame(event) {
    gameFilterButtons.forEach((item, index) => {
      button.removeAttribute('active')
      button.style.background = '#fff'
      button.style.color = gameData['types'][index]['color']
    })
    event.target.setAttribute('active', 'true')
    event.target.style.background = selectedGame['color']
    event.target.style.color = '#fff'
    loadGameContent()
  }

  function showNumbers(range) {
    let numbers = ''
    for (let i = 1; i <= range; i++) {
      numbers += `<button class="numbers" id=${i}>${i}</button>`
    }
    numbersContent.innerHTML = numbers

    const numberSelectButton = getElements('.numbers')
    numberSelectButton.forEach(item => {
      item.addEventListener('click', selectNumber)
    })
  }

  function getElements(attribute) {
    return [...document.querySelectorAll(attribute)]
  }
})()
