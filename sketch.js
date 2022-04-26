//training charRNN model tutorial >> https://github.com/ml5js/training-charRNN
//text corpus from >> https://www.gutenberg.org/ebooks/2591
// CSS ref https://www.w3schools.com/css/css_form.asp

let pages = 0

let minX, minY, maxX, maxY;
let sq1, sq2;

let grimmData
let listWords

let inputName
let inputLines

let welcomeText = "Please enter a name for yourself."
let introTxt = "more txt abt like what to do idk tbd"

let database //firebase
let disclaimer = "Your inputs will be stored in a public database. Please do not enter any sensitive information!"
let ref
let currentName

//charRNN
let charRNN
let tempSeed = "the king said "
let tempVal = 0.5
let charLength = 25
let data = {}

let optionsArr = []
let storyLines
let storyArr = ["Once upon a time"]
let starter = "Once upon a time..."
let counter = 0



function preload() {
  grimmData = loadStrings("grimmStories.txt")
  // console.log(grimmData)
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  cursor(ARROW)


  grimmData = join(grimmData, " ")
  listWords = splitTokens(grimmData, " ")

  // console.log(listWords)

  minX = floor(height / 20);
  minY = floor(height / 20);
  maxX = floor((floor(width - height / 20) - minX) / 5) * 5 + minX;
  maxY = floor((floor(height * 19 / 20) - minY) / 5) * 5 + minY;

  sq1 = {
    x: floor((floor(width * 18 / 20) - minX) / 5) * 5 + minX,
    y: maxY,
    dx: -5,
    dy: 0,
  };

  sq2 = {
    x: floor((floor(width * 2 / 20) - minX) / 5) * 5 + minX,
    y: minY,
    dx: 5,
    dy: 0,
  };



  inputLines = createInput()
  inputLines.size(width / 2, height / 8)
  inputLines.position(width / 2 - inputLines.width / 2, height / 2-inputLines.height)
  inputLines.hide()

  inputName = createInput()
  inputName.size(width / 3, height / 12)
  inputName.position(width / 2 - inputName.width / 2, height / 2)
  inputName.hide()

  //-----LSTM generator------
  charRNN = ml5.charRNN('grimmModel', modelReady)



  //-----Firebase setup------
  configFirebase()
  database = firebase.database()
  ref = database.ref("stories")
  ref.on("value", gotData)
}

//------Firebase functions------

function configFirebase() {
  const firebaseConfig = {
    apiKey: "AIzaSyAHRmKsixa5X9q0GoATxHBTjT_LoIhws3Y",
    authDomain: "chatbot-final-5b0e8.firebaseapp.com",
    databaseURL: "https://chatbot-final-5b0e8-default-rtdb.firebaseio.com",
    projectId: "chatbot-final-5b0e8",
    storageBucket: "chatbot-final-5b0e8.appspot.com",
    messagingSenderId: "12954650545",
    appId: "1:12954650545:web:9b7087b1acabdfc2435f90",
    measurementId: "G-9C8MNC4XED"
  };
  firebase.initializeApp(firebaseConfig);
}

function gotData(data) {
  let incomingData = data.val(); // val() returns an object with all the data
  let keys = Object.keys(incomingData); // Object.keys return an array of unique keys
  let latestKey = keys[keys.length - 1]; // we only need the latest data
  srcText = incomingData[latestKey].stories; // get the (specific) array from the latest data
  console.log(incomingData)
}

function storeName() {
  if (inputName.value()) {
    currentName = inputName.value()
    // console.log(currentName)
    welcomeText = "Hello " + currentName.toString() + ". Please click NEXT to continue writing a story."

    let nameVal = {
      nickname: currentName
    }
    ref.push(nameVal)
  }

  inputName.value("")
}

function toFirebase() {
  if (inputLines.value()) {
    storyArr.push(inputLines.value())
    tempSeed = inputLines.value()

    // console.log(storyArr)
  }
  inputLines.value("")
  ref.push(storyArr[storyArr.length - 1])

}


//------charRNN functions------

function modelReady() {
  console.log("model ready")
}

function generate() {
  data = {
    seed: tempSeed,
    temperature: tempVal,
    length: charLength
  }

  charRNN.generate(data, charGotData)

}
function generate2() {
  data = {
    seed: tempSeed,
    temperature: tempVal,
    length: charLength
  }

  charRNN.generate(data, charGotData2)

}
function generate3() {
  data = {
    seed: tempSeed,
    temperature: tempVal,
    length: charLength
  }

  charRNN.generate(data, charGotData3)

}

function charGotData(err, result) {
  if (err) {
    console.error(err);
    return;
  }
  // console.log("data1: ",data)

  //------filtering out any extra nonword characters------
  const botGen = result.sample
  let tempBotArr = splitTokens(botGen, " ")
  // console.log("this is tempBotArr",tempBotArr)

  const listSet = new Set(listWords)
  if (!listSet.has(tempBotArr[0])) {
    tempBotArr.shift()
  }
  if (!listSet.has(tempBotArr[tempBotArr.length - 1])) {
    tempBotArr.pop()
  }

  const filteredBotGen = join(tempBotArr, " ")
  optionsArr.push(filteredBotGen)
  // storyArr.push(filteredBotGen)
  // ref.push(storyArr[storyArr.length-1])

  // console.log("botGen:",botGen,", filtered:",filteredBotGen,", storyArr:",storyArr)
  generate2()
}

function charGotData2(err, result) {
  if (err) {
    console.error(err);
    return;
  }

  //------filtering out any extra nonword characters------
  const botGen = result.sample
  let tempBotArr = splitTokens(botGen, " ")

  const listSet = new Set(listWords)
  if (!listSet.has(tempBotArr[0])) {
    tempBotArr.shift()
  }
  if (!listSet.has(tempBotArr[tempBotArr.length - 1])) {
    tempBotArr.pop()
  }

  const filteredBotGen = join(tempBotArr, " ")
  optionsArr.push(filteredBotGen)

  // storyArr.push(filteredBotGen)
  // ref.push(storyArr[storyArr.length-1])

  // console.log("botGen:",botGen,", filtered:",filteredBotGen,", storyArr:",storyArr)
  generate3()
}
function charGotData3(err, result) {
  if (err) {
    console.error(err);
    return;
  }

  //------filtering out any extra nonword characters------
  const botGen = result.sample
  let tempBotArr = splitTokens(botGen, " ")

  const listSet = new Set(listWords)
  if (!listSet.has(tempBotArr[0])) {
    tempBotArr.shift()
  }
  if (!listSet.has(tempBotArr[tempBotArr.length - 1])) {
    tempBotArr.pop()
  }

  const filteredBotGen = join(tempBotArr, " ")

  optionsArr.push(filteredBotGen)


  // storyArr.push(filteredBotGen)
  // ref.push(storyArr[storyArr.length-1])

  // console.log("botGen:",botGen,", filtered:",filteredBotGen,", storyArr:",storyArr)
  console.log(optionsArr,filteredBotGen)
}


//------general functions------

function switchPages() {
  if (pages == 4) {
    pages = 0
    resetAll()
    background(103, 128, 151)
  } else {
    pages++
    background(103, 128, 151)
  }

}

function mousePressed() {
  if (mouseX > width * 20 / 23 - height / 8 && mouseX < width * 20 / 23 + height / 8 && mouseY > height * 10 / 12 - height / 18 && mouseY < height * 10 / 12 + height / 18) {
    switchPages()
  }
}

function keyPressed() {
  if (keyCode === ENTER && pages == 1 && inputName.value()) {
    storeName()

  } else if (keyCode === ENTER && pages == 2 && inputLines.value()) {
    storyArr[0].replace("...", "")
    counter = 1
    toFirebase()
    
    generate()

    // console.log("optionsArr: ",optionsArr)

  }
}

function resetAll() {
  gotData()
  welcomeText = "Please enter a name for yourself."
  storyArr = ["Once upon a time..."]
  counter = 0
  cursor(ARROW)

}



function draw() {
  switch (pages) {
    case 0: page0overview()
      break;
    case 1: page1name()
      break;
    case 2: page2main()
      break;
    case 3: page3view()
      break;
    case 4: page4stats()
      break;
  }
}

function page0overview() {

  allBackground()
  nextButton()

  fill(230, 245, 255)
  noStroke()
  textFont("Courier New")
  textAlign(CENTER)

  textSize(35)
  text("Welcome to <title TBA>", width / 2, height * 1 / 5)

  textSize(30)
  text("This is a collaborative writing experience between you and a machine learning model trained on the Grimms' Fairy Tales.", width * 1 / 2, height * 4 / 7, width * 4 / 5, height * 1 / 2)

  text(introTxt, width / 2, height * 4 / 7)



}

function page1name() {
  allBackground()
  nextButton()

  inputName.show()
  textAlign(CENTER)
  textSize(30)
  text(welcomeText + "\nPress ENTER to record your name, and the NEXT button to move on", width / 2, height * 2 / 5)

  textSize(20)
  text(disclaimer, width / 2, height * 3 / 4 + inputName.height * 2, width * 2 / 3, height / 2)



}

function page2main() {
  allBackground()

  inputName.hide()
  inputLines.show()

  let opacity2=10
  value = 0, 15, 30

  textSize(20)
  text("Press ENTER after writing to record your story.", width / 2, height * 2 / 6, width / 2, height / 3)

  cursor(ARROW)

  textAlign(CENTER)
  if (counter == 0) {
    text(starter, width / 2, height * 1 / 3)
  } else if (counter == 1) {
    allBackground()
    noStroke()
    fill(103, 128, 151)
    rect(width / 2, height * 2 / 6, width / 2, height / 3)
    nextButton()
    textSize(20)
    text("Select a machine generated option below, or NEXT to move on.", width / 2, height * 2 / 6, width / 2, height / 3)

    for (i = 0; i < storyArr.length; i++) {
      textSize(25)
      text(storyArr[i], width / 2, height * 1 / 3 + 20 * i)
    }
  }
  for (i = 0; i < 3; i++) {
    if(optionsArr.length>0){
      rectMode(CORNER)

      if (
        mouseX > width / 7 + (i * width) / 4 &&
        mouseX < width / 7 + (i * width) / 4 + width / 5 &&
        mouseY > (height * 4) / 7 &&
        mouseY < (height * 4) / 7 + (height * 1) / 8
      ) {
        // fill(0,50)
        // circle(mouseX,mouseY,20)
        cursor(HAND);
        value = 0, 15, 30;
        opacity2 = 30;
      } else {
        value = 255;
        opacity2 = 0;
        
      }
      stroke(230, 245, 255, 100)
    rectMode(CORNER)
    fill(value, opacity2);
    rect(
      width / 7 + (i * width) / 4,
      (height * 4) / 7,
      width / 5,
      (height * 1) / 8
    );
      for(i=0;i<3;i++){
        textSize(15)
        noStroke()
        fill(230, 245, 255)
        textAlign(CENTER)
        text(optionsArr[i],width / 7 + (i * width) / 4,(height * 5) / 8,width/5,(height * 1) / 8)
      }
    }else{
      stroke(230, 245, 255, 100)
      rectMode(CORNER)
      fill(value, 30);
      rect(
        width / 7 + (i * width) / 4,
        (height * 4) / 7,
        width / 5,
        (height * 1) / 8 
      );
    }
  }
}

function page3view() {
  allBackground()
  nextButton()

  inputLines.hide()

  textAlign(CENTER)
  const joined = join(storyArr, " ")
  text(currentName + "\n" + joined, width / 2, height / 2, width * 4 / 5, height * 5 / 9)

  console.log("joined: ", joined)
  // text(joined,width/2,height/8,width*7/8,height*7/8)
}

function page4stats() {
  allBackground()
  nextButton()

}

function allBackground() {
  background(0, 5)

  rectMode(CORNER)
  noFill()
  strokeWeight(3)
  stroke(120, 175, 230, 150)
  rect(minX, minY, floor(width - height * 2 / 20), floor((floor(height * 19 / 20) - minY) / 5) * 5)

  rectMode(CENTER)
  moveSq(sq1);
  drawSq(sq1);

  moveSq(sq2);
  drawSq(sq2);
}

function moveSq(sq) {

  rectMode(CENTER)
  if (sq.dx < 0 && sq.x <= minX) {
    // Hitting left wall
    // Switch to going up
    sq.dx = 0;
    sq.dy = -5;
  } else if (sq.dy < 0 && sq.y <= minY) {
    // Hitting the top wall
    // Switch to going right
    sq.dx = 5;
    sq.dy = 0;
  } else if (sq.dx > 0 && sq.x >= maxX) {
    // Hitting the right wall
    // Switch to going down
    sq.dx = 0;
    sq.dy = 5;
  } else if (sq.dy > 0 && sq.y >= maxY) {
    // Hitting the bottom wall
    // Switch to going left
    sq.dx = -5;
    sq.dy = 0;
  }

  sq.x += sq.dx;
  sq.y += sq.dy;
}

function drawSq(sq) {
  rectMode(CENTER)

  background(115, 150, 179, 10)
  noStroke()
  fill(210, 230, 255, 200);
  square(sq.x, sq.y, 7);
}

function nextButton() {
  rectMode(CENTER)
  let opacity = 0
  if (mouseX > width * 20 / 23 - height / 8 && mouseX < width * 20 / 23 + height / 8 && mouseY > height * 10 / 12 - height / 18 && mouseY < height * 10 / 12 + height / 18) {
    opacity = 30
    cursor(HAND)
  } else {
    opacity = 0
    cursor(ARROW)
  }
  noStroke()
  fill(103, 128, 151)
  rect(width * 20 / 23, height * 10 / 12, height / 4, height / 9)

  noStroke()
  fill(0, 15, 30, opacity)
  rect(width * 20 / 23, height * 10 / 12, height / 4, height / 9)

  stroke(230, 245, 255, 100)
  strokeWeight(3)
  noFill()
  rect(width * 20 / 23, height * 10 / 12, height / 4 + 5, height / 9 + 5)

  noStroke()
  fill(230, 245, 255)
  textSize(30)
  text("NEXT", width * 20 / 23, height * 84 / 100)
}

