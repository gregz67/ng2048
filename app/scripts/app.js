'use strict';

/**
 * @ngdoc overview
 * @name twentyfortyeightApp
 * @description
 * # twentyfortyeightApp
 *
 * Main module of the application.
 */
angular
  .module('twentyfortyeightApp', [
    'ngCookies',
    'Game',
    'Grid'
  ])
  .controller('GameController', function(GameManager) {
    this.game = GameManager;

    this.newGame = function() {
      this.game.newGame();
    };

    this.newGame();
  });
