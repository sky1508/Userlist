
angular.module('todomvc')
	.controller('TodoCtrl', function TodoCtrl($scope, $routeParams, $filter, store) {
		'use strict';

		var todos = $scope.todos = store.todos;

		$scope.newTodo = '';
		$scope.editedTodo = null;
		$scope.message = "";

		/*called when active/all/completed is pressed to count & sort the data
		$scope.$watch('todos', function () {
			$scope.remainingCount = $filter('filter')(todos, { completed: false }).length;
			$scope.completedCount = todos.length - $scope.remainingCount;
			$scope.allChecked = !$scope.remainingCount;
		}, true);

		//Called after above code to adjust filters clicked by user
		// Monitor the current route for changes and adjust the filter accordingly.
		$scope.$on('$routeChangeSuccess', function () {
			var status = $scope.status = $routeParams.status || '';
			$scope.statusFilter = (status === 'active') ?
				{ completed: false } : (status === 'completed') ?
				{ completed: true } : {};
		});*/

		
		//Called when a new task is entered and enter is pressed
		$scope.addTodo = function () {
			var newTodo = {
				username: $scope.newTodo.username.trim(),
				fullName: $scope.newTodo.fullName.trim(),
				email: $scope.newTodo.email.trim()
				
			};

			if (!newTodo.username) {
				return;
			}

			$scope.saving = true;
			store.insert(newTodo)
				.then(function success() {
					$scope.newTodo = '';
				})
				.finally(function () {
					$scope.message = "New User Added Successfully!";
					$scope.saving = false;
				});
		};

		
		//Called when you click on any task for editing, creates a copy & lets you edit
		$scope.editTodo = function (todo) {
			$scope.editedTodo = todo;
			// Clone the original todo to restore it on demand.
			$scope.originalTodo = angular.extend({}, todo);
		};

		//Called after editing has been done and enter is pressed, 
		//checks the event type as submit or blur if submit then next function is called else no action
		$scope.saveEdits = function (todo, event) {
			// Blur events are automatically triggered after the form submit event.
			// This does some unfortunate logic handling to prevent saving twice.
			if (event === 'blur' && $scope.saveEvent === 'submit') {
				$scope.saveEvent = null;
				return;
			}

			
			//Called after an task is edited & event type is submit
			$scope.saveEvent = event;

			//Called after Reverted method to set reverted property to null
			if ($scope.reverted) {
				// Todo edits were reverted-- don't save.
				$scope.reverted = null;
				return;
			}

			todo.username = todo.username.trim();
			todo.email = todo.email.trim();
			todo.fullName = todo.fullName.trim();
			
			//Checking whether the edited task is same as original task or not, 
			//if same then editedTodois set to null and function returns to blur & submit line
			if (todo.username === $scope.originalTodo.username && todo.email === $scope.originalTodo.email && todo.fullName === $scope.originalTodo.fullName) {
				$scope.editedTodo = null;
				return;
			}

			store[todo.username ? 'put' : 'delete'](todo)
				.then(function success() {}, function error() {
					todo.username = $scope.originalTodo.username;
				})
				.finally(function () {
					$scope.message = "User Updated Successfully!";
					$scope.editedTodo = null;
				});
		};

		//Called when an task is edited but not saved and esc is pressed to revert the edits
		$scope.revertEdits = function (todo) {
			todos[todos.indexOf(todo)] = $scope.originalTodo;
			$scope.editedTodo = null;
			$scope.originalTodo = null;
			$scope.reverted = true;
		};

		
		//Called when a task is deleted
		$scope.removeTodo = function (todo) {
			store.delete(todo);
			$scope.message = "User Deleted Successfully!";
		};

		$scope.clearMessage = function(){
			$scope.message = "";
		};
	});
