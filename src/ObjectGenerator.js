//This class is used for objects generation
ObjectGenerator = function(difficulty) {
    this.difficulty = difficulty;
    this.lastPattern = null;

    this.STAR_INSTANCES = 20;
    this.AMMO_INSTANCES = 5;

    //create pools of items for recycling purposes
    this.starsPool = [];
    for (var i = 0; i< this.STAR_INSTANCES; i++) {
      this.starsPool.push(new GeneratedItem(GeneratedItemEnum.STAR, 0, 0));
    }

    this.ammoPool = [];
    for (var i = 0; i< this.AMMO_INSTANCES; i++) {
      this.ammoPool.push(new GeneratedItem(GeneratedItemEnum.AMMO, 0, 0));
    }
};

ObjectGenerator.prototype = Object.create(Object.prototype);
ObjectGenerator.prototype.constructor = ObjectGenerator;

ObjectGenerator.prototype.generateStar = function() {
    //get first non-active item from the pool and return it
    for (var i = 0; i< this.starsPool.length; i++) {
      var star = this.starsPool[i];
      if (!star.alive) {
        star.revive();
        star.spawnItem();

        return star;
      }
    }

    return null;
};

ObjectGenerator.prototype.generateAmmo = function() {
  //get first non-active item from the pool and return it
  for (var i = 0; i< this.ammoPool.length; i++) {
    var ammo = this.ammoPool[i];
    if (!ammo.alive) {
      ammo.revive();
      ammo.spawnItem();

      return ammo;
    }
  }

  return null;
};
