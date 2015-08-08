class GA {
  constructor() { //initial values
    this.populationLimit = 20;

    var a, b, c, queueSize;

    this.population = [];

    for(var i = 0; i < this.populationLimit; i++) { // todo: fill by random?
      a = this.getRandomInt(0, 65535);
      b = this.getRandomInt(0, 65535);
      c = this.getRandomInt(0, 65535);
      queueSize = this.getRandomInt(1, 15);

      this.population.push({a : a, b: b, c: c, queueSize: queueSize, target: 0});
    }
    this.nextItemToUse = 0;
  }

  getRandomInt(min, max)
  {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  toFloating(intNum) {
    return (intNum/65536) * 10 - 5;
  }

  getItem() {
    if(this.nextItemToUse >= this.populationLimit) {
      this.proceedGAPart();
      this.nextItemToUse = this.population.length / 2; // first half of population already has target value. We are not interested to repeat it.
    }

    console.log("Going to check population member " + this.nextItemToUse);
    return {a: this.toFloating(this.population[this.nextItemToUse].a),
            b: this.toFloating(this.population[this.nextItemToUse].b),
            c: this.toFloating(this.population[this.nextItemToUse].c),
            queueSize: this.population[this.nextItemToUse].queueSize};
  }

  setItemTargetValue(value) {
    this.population[this.nextItemToUse].target = value;
    this.nextItemToUse++;
  }

  proceedGAPart() { // use all those GA staff
    this.removeWorse();
    this.crossover();
    this.mutate();
  }

  executeCrossover(str1, str2) {
    if(str1.length != str2.length) {
      console.log("ERROROROROROOORRRR!");
    }
    var res1 = '';
    var res2 = '';
    for(var k = 0; k < str1.length; k++) {
      if((k % 2) == 0) {
        res1 += str1[k];
        res2 += str2[k];
      }
      else {
        res1 += str2[k];
        res2 += str1[k];
      }
    }

    return {first : res1, second : res2};
  }

  dumpPopulation() {
    for(var i = 0; i < this.population.length; i++) {
      console.log("population[" + i + "]: a/b/c/target " + this.population[i].a + "/" + this.population[i].b + "/" + this.population[i].c + "/" + this.population[i].target);
    }
  }

  binaryRepresentation(num) {
    var asString = num.toString(2);

    var leadingZeroesToAdd = 16 - asString.length;
    var toAdd = '';
    for(var i = 0; i < leadingZeroesToAdd; i++) {
      toAdd += '0';
    }
    return toAdd + asString;
  }


  crossover() {
    console.log("starting crossover. length" + this.population.length);
    var itemsToCrossover = this.population.length / 2;
    for(var i = 0; i < itemsToCrossover; i++) {
      var j = i + itemsToCrossover;

//      console.log("item " + i + " + item " + j);

      var firstBinaryStringA = this.binaryRepresentation(this.population[i].a);
      var secondBinaryStringA = this.binaryRepresentation(this.population[j].a);

      var firstBinaryStringB = this.binaryRepresentation(this.population[i].b);
      var secondBinaryStringB = this.binaryRepresentation(this.population[j].b);

      var firstBinaryStringC = this.binaryRepresentation(this.population[i].c);
      var secondBinaryStringC = this.binaryRepresentation(this.population[j].c);

      var firstQueueSize = this.binaryRepresentation(this.population[i].queueSize);
      var secondQueueSize = this.binaryRepresentation(this.population[i].queueSize);

      var res1 = this.executeCrossover(firstBinaryStringA, secondBinaryStringA);
      var res2 = this.executeCrossover(firstBinaryStringB, secondBinaryStringB);
      var res3 = this.executeCrossover(firstBinaryStringC, secondBinaryStringC);
      var resQueue = this.executeCrossover(firstQueueSize, secondQueueSize);

      var a1 = parseInt(res1.first, 2);
      var a2 = parseInt(res1.second, 2);
      var b1 = parseInt(res2.first, 2);
      var b2 = parseInt(res2.second, 2);
      var c1 = parseInt(res3.first, 2);
      var c2 = parseInt(res3.second, 2);
      var queueSize1 = parseInt(resQueue.first, 2);
      var queueSize2 = parseInt(resQueue.second, 2);


      this.population.push({a:a1, b:b1,c:c1,queueSize: queueSize1, target:0});
      this.population.push({a:a2, b:b2,c:c2,queueSize: queueSize2, target:0});
    }

    console.log("after crossover:");
    this.dumpPopulation();
  }

  mutate() {
    for(var i = 0; i < this.population.length; i++) {
      if(this.getRandomInt(0, 20) <= 1) {
        // do the mutation
      }
    }
  }

  removeWorse(){ //removes half worst elements
    this.population.sort(function(a,b) {
      return a.target < b.target ? 1 : -1;
    });
//    console.log("now population length is: " + this.population.length);
//    console.log("firstA: " + this.population[0].a);

    this.population = this.population.splice(0, this.population.length/2);

//    console.log("now population length is: " + this.population.length);
//    console.log("firstA: " + this.population[0].a);
  }
}


module.exports = GA;