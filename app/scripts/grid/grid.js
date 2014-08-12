/* jshint bitwise: false */

'use strict';

angular.module('Grid', [])
  .factory('GenerateUniqueId', function() {
    var generateUid = function() {
      // http://www.ietf.org/rfc/rfc4122.txt
      var d = new Date().getTime();
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c === 'x' ? r : (r&0x7|0x8)).toString(16);
      });
      return uuid;
    };
    return {
      next: function() { return generateUid(); }
    };
  })
  .factory('TileModel', function(GenerateUniqueId) {
    var Tile = function(pos, val) {
      this.x = pos.x;
      this.y = pos.y;
      this.value = val || 2;
      this.merged = null;
      this.id = GenerateUniqueId.next();
    };

    Tile.prototype.reset = function() {
      this.merged = null;
    };

    Tile.prototype.updatePosition = function(newPosition) {
      this.x = newPosition.x;
      this.y = newPosition.y;
    };

    return Tile;

  })
  .service('GridService', function(TileModel) {
    var service = this;
    var vectors = {
      'left': { x: -1, y: 0 },
      'right': { x: 1, y: 0 },
      'up': { x: 0, y: -1 },
      'down': { x: 0, y: 1 }
    };
    // size of the board
    this.size = 4;
    this.numberOfStartingTiles = 2;
    this.grid = [];
    this.tiles = [];

    this.buildEmptyGameBoard = function() {
      // Initialize our grid
      for (var x = 0; x < service.size * service.size; x++) {
        service.grid[x] = null;
      }

      // Initialize our tile array
      // with a bunch of null objects
      this.forEach(function(x, y) {
        service.setCellAt({x: x, y: y}, null);
      });
    };

    this.buildStartingPosition = function() {
      for (var x=0; x < this.numberOfStartingTiles; x++) {
        this.randomlyInsertNewTile();
      }
    };

    this.prepareTiles = function() {
      this.forEach(function(x, y, tile) {
        if (tile) {
          tile.reset();
        }
      });
    };

    this.newTile = function(pos, value) {
      return new TileModel(pos, value);
    };

    this.randomlyInsertNewTile = function() {
      var cell = this.randomAvailableCell(),
        tile = new TileModel(cell, 2);
      this.insertTile(tile);
    };

    // Add a tile to the tiles array
    this.insertTile = function(tile) {
      var pos = this._coordinatesToPosition(tile);
      this.tiles[pos] = tile;
    };

    // Remove a tile from the tiles array
    this.removeTile = function(pos) {
      pos = this._coordinatesToPosition(pos);
      delete this.tiles[pos];
    };

    this.moveTile = function(tile, newPositon) {
      var oldPos = {
        x: tile.x,
        y: tile.y
      };

      // update array location
      this.setCellAt(oldPos, null);
      this.setCellAt(newPositon, tile);

      // update the tile model
      tile.updatePosition(newPositon);
    };

    this.samePositions = function(a, b) {
      return a.x === b.x && a.y === b.y;
    };

    // get all the available tiles positons
    this.availableCells = function() {
      var cells = [], service = this;

      this.forEach(function(x, y) {
        var foundTile = service.getCellAt({x: x, y: y});
        if (!foundTile) {
          cells.push({x: x, y: y});
        }
      });
      return cells;
    };

    this.randomAvailableCell = function() {
      var cells = this.availableCells();
      if (cells.length > 0) {
        return cells[Math.floor(Math.random() * cells.length)];
      }
    };

    this.anyCellsAvailable = function() {
      return this.availableCells().length > 0;
    };

    /*
     * Check to see if there are any matches available
     */
    this.tileMatchesAvailable = function() {
      var totalSize = service.size * service.size;
      for (var i = 0; i < totalSize; i++) {
        var pos = this._positionToCoordinates(i);
        var tile = this.tiles[i];

        if (tile) {
          // Check all vectors
          for (var vectorName in vectors) {
            var vector = vectors[vectorName];
            var cell = { x: pos.x + vector.x, y: pos.y + vector.y };
            var other = this.getCellAt(cell);
            if (other && other.value === tile.value) {
              return true;
            }
          }
        }
      }
      return false;
    };

    this.traversalDirections = function(key) {
      var vector = vectors[key];
      var positions = {
        x: [],
        y: []
      };
      for (var x=0; x < this.size; x++) {
        positions.x.push(x);
        positions.y.push(x);
      }

      // reorder if we are going right
      if (vector.x > 0) {
        positions.x = positions.x.reverse();
      }

      // reorder the y positions if we are going down
      if (vector.y > 0) {
        positions.y = positions.y.reverse();
      }

      return positions;
    };

    this.calculateNextPosition = function(cell, key) {
      var vector = vectors[key];
      var previous;

      do {
        previous = cell;
        cell = {
          x: previous.x + vector.x,
          y: previous.y + vector.y
        };
      } while (this.withinGrid(cell) && this.cellAvailable(cell));

      return {
        newPosition: previous,
        next: this.getCellAt(cell)
      };
    };

    // Run a method for each element in the tiles array
    this.forEach = function(cb) {
      var totalSize = this.size * this.size;
      for (var i = 0; i < totalSize; i++) {
        var pos = this._positionToCoordinates(i);
        cb(pos.x, pos.y, this.tiles[i]);
      }
    };

    // Set a cell at position
    this.setCellAt = function(pos, tile) {
      if (this.withinGrid(pos)) {
        var xPos = this._coordinatesToPosition(pos);
        this.tiles[xPos] = tile;
      }
    };

    // Fetch a cell at a given position
    this.getCellAt = function(pos) {
      if (this.withinGrid(pos)) {
        var x = this._coordinatesToPosition(pos);
        return this.tiles[x];
      } else {
        return null;
      }
    };

    // A small helper function to determine if a position is
    // within the boundaries of our grid
    this.withinGrid = function(cell) {
      return cell.x >= 0 && cell.x < this.size &&
        cell.y >= 0 && cell.y < this.size;
    };

    /*
     * Is a cell available at a given position
     */
    this.cellAvailable = function(cell) {
      if (this.withinGrid(cell)) {
        return !this.getCellAt(cell);
      } else {
        return null;
      }
    };

    /*
     * Helper to convert x to x,y
     */
    this._positionToCoordinates = function(i) {
      var x = i % service.size,
        y = (i - x) / service.size;
      return {
        x: x,
        y: y
      };
    };

    /*
     * Helper to convert coordinates to position
     */
    this._coordinatesToPosition = function(pos) {
      return (pos.y * service.size) + pos.x;
    };

  });