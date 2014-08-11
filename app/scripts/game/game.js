'use strict';

angular.module('Game', [ 'Grid', 'ngCookies'])
  .service('GameManager', function($q, $timeout, GridService) {

    this.grid = GridService.grid;
    this.tiles = GridService.tiles;

    // create a new game
    this.newGame = function() {
      GridService.buildEmptyGameBoard();
      GridService.buildStartingPosition();
    };

    // handle the move action
    this.move = function() {

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