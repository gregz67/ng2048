'use strict';

angular.module('Game', [ 'Grid', 'ngCookies'])
  .service('GameManager', function($q, $timeout, GridService) {

    this.winningValue = 2048;

    this.grid = GridService.grid;
    this.tiles = GridService.tiles;

    // create a new game
    this.newGame = function() {
      GridService.buildEmptyGameBoard();
      GridService.buildStartingPosition();
      this.reinit();
    };

    this.reinit = function() {
      this.gameOver = false;
      this.won = false;
      this.currentScore = 0;
      this.highScore = 0; // TODO
    };

    // handle the move action
    this.move = function(key) {
      var game = this,
        hasMoved = false,
        hasWon = false;
      var positions = GridService.traversalDirections(key);

      if (game.won) {
        return false;
      }

      // Update Grid
      GridService.prepareTiles();

      positions.x.forEach(function(x) {
        positions.y.forEach(function(y) {
          var originalPosition = { x: x, y: y};
          var tile = GridService.getCellAt(originalPosition);

          if (tile) {
            var cell = GridService.calculateNextPosition(tile, key),
              next = cell.next;

            if (next && next.value === tile.value && !next.merged) {
              // handle merge
              var newValue = tile.value * 2;
              // create new tile
              var mergedTile = GridService.newTile(tile, newValue);
              mergedTile.merged = [tile, cell.next];

              // insert the new tile
              GridService.insertTile(mergedTile);
              // remove old tile
              GridService.removeTile(tile);
              // move location of mergedTile into the next position
              GridService.moveTile(mergedTile, next);
              // update the score
            //  game.updateScore(game.currentScore + newValue);
              // check for win
              if (mergedTile.value >= game.winningValue) {
                hasWon = true;
              }
              hasMoved = true;
            } else {
              // move tile
              GridService.moveTile(tile, cell.newPosition);
            }

            if (!GridService.samePositions(originalPosition, cell.newPosition)) {
              hasMoved = true;
            }

          }
        });
      });

      if (hasWon && !game.won) {
        game.won = true;
      }

      if (hasMoved) {
        GridService.randomlyInsertNewTile();

        if (game.won || !game.movesAvailable()) {
          game.gameOver = true;
        }
      }
    };

    // update the score
/*
    this.updateScore = function(newScore) {

    };
*/

    this.movesAvailable = function() {
      return GridService.anyCellsAvailable() || GridService.tileMatchesAvailable();
    };

  });