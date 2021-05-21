import { setWorldConstructor } from "@cucumber/cucumber"

class CustomWorld {
  variable: number
  constructor() {
    this.variable = 0;
  }

  setTo(number) {
    this.variable = number;
  }

  incrementBy(number) {
    this.variable += number;
  }
}

setWorldConstructor(CustomWorld);
