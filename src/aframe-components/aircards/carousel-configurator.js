const CarouselGenerator = {
  init () {
    const scene = this.el.sceneEl
    // Carousel is the overall container, slides is the container for the individual cards
    // and indicators is the container for the number of cards and active card
    const carousel = document.createElement('div')
    carousel.setAttribute('id', 'carouselContainer')
    const slides = document.createElement('div')
    slides.setAttribute('id', 'cardContainer')
    const indicators = document.createElement('div')
    indicators.setAttribute('id', 'indicatorContainer')
    // When resetting the carousel, set innerHTML for slides and indicators to null.
    // Then repopulate with desired card length and content
    scene.addEventListener('resetCarousel', () => {
      // Make this dynamic by grabbing a JSON's array length
      const slideCount = 5
      slides.innerHTML = ''
      indicators.innerHTML = ''
      // Create a custom CSS property for the overall container with the slide count.
      carousel.style.setProperty('--slide-count', slideCount.toString())
      // Start populating the slides container with individual cards
      // Replace the contents with JSON array strings
      for (let i = 1; i < slideCount + 1; i++) {
        const currCard = document.createElement('div')
        currCard.setAttribute('class', 'carousel_item')
        const cardTitle = document.createElement('h1')
        cardTitle.innerHTML = 'Placeholder Title Here'
        const cardDescription = document.createElement('p')
        cardDescription.innerHTML = 'Placeholder Content Here'
        currCard.appendChild(cardTitle)
        currCard.appendChild(cardDescription)
        // set the id of the current card equal to the slide number
        currCard.setAttribute('id', `card${i}`)
        // Append the card to the slides container
        slides.appendChild(currCard)
        // Add a span element for the card
        const indicatorSpan = document.createElement('span')
        indicatorSpan.setAttribute('id', `indicator${i}`)
        indicatorSpan.setAttribute('class', 'indicator')
        indicators.appendChild(indicatorSpan)
      }
      // Make sure that the first indicator is the active indicator
      indicators.firstElementChild.setAttribute('class', 'activeIndicator')
      // Make sure that the first card is in view
      document.getElementById('card1').scrollIntoView()
      // emit an event to tell the system that the carousel has been generated
      scene.emit('carouselGenerated')
    })
  }
}

const CarouselObserver = {
  init () {
    let prevActiveIndicator = 'indicator1'
    const scene = this.el.sceneEl
    let alreadyPosted = false
    scene.addEventListener('carouselGenerated', () => {
      document.getElementById('slides').addEventListener('scroll', () => {
        // console.log('scrolling)
      })
      const cards = document.querySelectorAll('.carousel_item')

      const handleIntersection = function (entries) {
        for (const entry in entries) {
          const currentCardNum = entry.target.id.replace('card', '')
          let currentActiveindicator = `indicator${currentCardNum}`
          if (entry.isIntersecting) {
            document.getElementById(currentActiveindicator).classList.remove('activeIndicator')
            alreadyPosted = false
          } else {
            document.getElementById(currentActiveindicator).classList.remove('activeIndicator')
            currentActiveindicator = prevActiveIndicator
            if (!alreadyPosted) {
              alreadyPosted = true
              setTimeout(() => {
                const indicatorId = document.querySelector('.activeIndicator').id.replace('indicator', '')
                console.log(indicatorId)
                const indicatorIdInt = parseInt(indicatorId)
                scene.emit('carouselCardNumChanged', indicatorIdInt)
              }, 1000)
            }
          }
          prevActiveIndicator = currentActiveindicator
        }
      }
      for (let i = 0; i < cards.length; i++) {
        const observer = new IntersectionObserver(handleIntersection)
        observer.observe(cards[i])
      }
    })
  }
}

export { CarouselGenerator, CarouselObserver }
