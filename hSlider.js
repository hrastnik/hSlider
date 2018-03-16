var hSlider = (function() {
  class Slider {
    get activeSlide() {
      return slides[this.activeSlideIndex];
    }

    setSlide(newActiveSlideIndex) {
      this.activeSlideIndex = newActiveSlideIndex;
    }

    constructor() {
      this.activeSlideIndex = 0;
      this.oldActiveSlideIndex = -1;
      this.slides = [];

      this.slider = document.querySelector(".hSlider");
      this.buttons = this.slider.querySelectorAll(".hButton");
      const slides = this.slider.querySelectorAll(".hSlide");

      slides.forEach(slide => {
        this.slides.push(slide);
      });

      // Update numbers
      this.disposeUpdateNumbers = mobx.autorun(() => {
        const numbers = this.slider.querySelectorAll(".hNumber");

        numbers.forEach(numberElement => {
          numberElement.innerHTML = this.numberFormatter(this.activeSlideIndex);
        });
      });

      // Update slides distance to active slide
      this.disposeSliderUpdate = mobx.autorun(() => {
        const slides = this.slider.querySelectorAll(".hSlide");
        const activeIndex = this.activeSlideIndex;
        const numSlidesHalf = Math.floor(slides.length / 2);

        this.updateSlideData(slides[activeIndex], 0, "active");

        for (var i = 1; i < numSlidesHalf + 1; i++) {
          var nextSlideIndex =
            (activeIndex + i + slides.length) % slides.length;
          var prevSlideIndex =
            (activeIndex - i + slides.length) % slides.length;

          var distToActive = i;

          this.updateSlideData(slides[prevSlideIndex], -distToActive, "prev");
          this.updateSlideData(slides[nextSlideIndex], distToActive, "next");
        }
      });

      // Hook up button handlers
      this.nextButtons = this.slider.querySelectorAll(".hButtonNext");
      this.handleNextButtonClick = this.handleNextButtonClick.bind(this);
      this.nextButtons.forEach(button => {
        button.addEventListener("click", this.handleNextButtonClick);
      });

      this.prevButtons = this.slider.querySelectorAll(".hButtonPrev");
      this.handlePrevButtonClick = this.handlePrevButtonClick.bind(this);
      this.prevButtons.forEach(button => {
        button.addEventListener("click", this.handlePrevButtonClick);
      });
    }

    updateSlideData(slide, dist, relpos) {
      var oldDist = slide.getAttribute("data-d");
      var oldRelPos = slide.getAttribute("data-relpos");
      slide.setAttribute("data-d", dist);
      slide.setAttribute("data-relpos", relpos);

      this.onSlidePosChange(slide, {
        distance: dist,
        state: relpos,
        oldDistance: oldDist,
        oldState: oldRelPos,
        slider: this.slider,
        slides: this.slides,
        nextButtons: this.nextButtons,
        prevButtons: this.prevButtons
      });
    }

    handleNextButtonClick() {
      this.oldActiveSlideIndex = this.activeSlideIndex;
      this.activeSlideIndex = (this.activeSlideIndex + 1) % this.slides.length;
    }

    handlePrevButtonClick() {
      this.oldActiveSlideIndex = this.activeSlideIndex;
      this.activeSlideIndex =
        (this.activeSlideIndex - 1 + this.slides.length) % this.slides.length;
    }

    onSlidePosChange(slide, config) {}

    numberFormatter(activeSlideIndex) {
      return activeSlideIndex;
    }

    destroy() {
      this.disposeUpdateNumbers();
      this.disposeSliderUpdate();

      this.nextButtons.forEach(button => {
        button.removeEventListener("click", this.handleNextButtonClick);
      });

      this.prevButtons.forEach(button => {
        button.removeEventListener("click", this.handlePrevButtonClick);
      });
    }
  }

  return mobx.decorate(Slider, {
    activeSlideIndex: mobx.observable,
    activeSlide: mobx.computed,
    setSlide: mobx.action,
    handleNextButtonClick: mobx.action,
    handlePrevButtonClick: mobx.action
  });
})();
