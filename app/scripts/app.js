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
    'Grid',
    'Keyboard'
  ])
  .controller('GameController', function(GameManager, KeyboardService) {
    this.game = GameManager;

    this.newGame = function() {
      KeyboardService.init();
      this.game.newGame();
      this.startGame();
    };

    this.startGame = function() {
      var self = this;

      KeyboardService.on(function(key) {
        self.game.move(key);
      });
    };

    this.newGame();
  });
