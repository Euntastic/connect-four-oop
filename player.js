// Part Three: Make Player a Class
// Right now, the players are just numbers, and we have hard-coded player numbers and colors in the CSS.

// Make it so that there is a Player class. It should have a constructor that takes a string color name (eg, “orange” or “#ff3366”) and store that on the player instance.

// The Game should keep track of the current player object, not the current player number.

// Update the code so that the player pieces are the right color for them, rather than being hardcoded in CSS as red or blue.

// Add a small form to the HTML that lets you enter the colors for the players, so that when you start a new game, it uses these player colors.

class Player{
  constructor(number, color) {
    this.number = number;
    this.color = color;
  }
}