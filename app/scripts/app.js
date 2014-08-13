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
    'ngAnimate',
    'angular-gestures',
    'Game',
    'Grid',
    'Keyboard',
    'Gestures'
  ])
  .controller('GameController', function(GameManager, KeyboardService, GesturesService, $scope) {
    this.game = GameManager;

    this.newGame = function() {
      KeyboardService.init();
      GesturesService.init();
      this.game.newGame();
      this.startGame();
    };

    this.startGame = function() {
      var self = this;

      KeyboardService.on(function(direction) {
        self.game.move(direction);
      });

      GesturesService.on(function(direction) {
        self.game.move(direction);
      });
    };

    this.newGame();

    $scope.handleGesture = angular.noop;

  });
