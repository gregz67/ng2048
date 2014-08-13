'use strict';

angular.module('Game', [ 'Grid', 'ngCookies'])
  .service('GameManager', function($q, $timeout, GridService, $cookieStore) {

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
    };

    // handle the move action
    this.move = function(direction) {
      var game = this;
      var f = function() {
        var hasMoved = false,
          hasWon = false,
          positions = GridService.traversalDirections(direction);

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
              var cell = GridService.calculateNextPosition(tile, direction),
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
                game.updateScore(game.currentScore + newValue);
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
      return $q.when(f());
    };

    this.getHighScore = function() {
      return parseInt($cookieStore.get('ng-2048.highScore')) || 0;
    };

    // update the score
    this.updateScore = function(newScore) {
      this.currentScore = newScore;
      if (this.currentScore > this.getHighScore()) {
        this.highScore = newScore;
        // set on the cookie
        $cookieStore.put('ng-2048.highScore', newScore);
      }
    };

    this.movesAvailable = function() {
      return GridService.anyCellsAvailable() || GridService.tileMatchesAvailable();
    };

  });