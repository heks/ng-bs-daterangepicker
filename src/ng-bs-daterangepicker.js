/**
 * @license ng-bs-daterangepicker v0.0.1
 * (c) 2013 Luis Farzati http://github.com/luisfarzati/ng-bs-daterangepicker
 * License: MIT
 */
(function (angular) {
'use strict';

angular.module('ngBootstrap', [])
.directive('input',['$parse', function ($parse) {
	return {
		restrict: 'E',
		require: '?ngModel',
		link: function ($scope, $element, $attributes, ngModel) {
			if ($attributes.type !== 'daterange' || ngModel === null ) return;

			var options = {};
			options.format = $attributes.format || 'YYYY-MM-DD';
			options.separator = $attributes.separator || ' - ';
			options.minDate = $attributes.minDate && moment($attributes.minDate);
			options.maxDate = $attributes.maxDate && moment($attributes.maxDate);
			options.dateLimit = $attributes.limit && moment.duration.apply(this, $attributes.limit.split(' ').map(function (elem, index) { return index === 0 && parseInt(elem, 10) || elem; }) );
			options.ranges = $attributes.ranges && $parse($attributes.ranges)($scope);
			options.locale = $attributes.locale && $parse($attributes.locale)($scope);

			$attributes.$observe('opens',function(nV) {
				options.opens = nV || "right";
				$element.daterangepicker(options, function(start, end) {
					$scope.$apply(function () {
						ngModel.$setViewValue({ startDate: start, endDate: end });
						ngModel.$render();
					});
				});	
			});

			$scope.$on('$destroy', function() {
				$(".daterangepicker").remove();
			});

			function format(date) {
				return date.format(options.format);
			}

			function formatted(dates) {
				return [format(dates.startDate), format(dates.endDate)].join(options.separator);
			}

			ngModel.$formatters.unshift(function (modelValue) {
				if (!modelValue) return '';
				return modelValue;
			});

			ngModel.$parsers.unshift(function (viewValue) {
				return viewValue;
			});

			ngModel.$render = function () {
				if (!ngModel.$viewValue || !ngModel.$viewValue.startDate) return;
				$element.val(formatted(ngModel.$viewValue));
			};

			$scope.$watch($attributes.ngModel, function (modelValue) {
				if (!modelValue || (!modelValue.startDate)) {
					ngModel.$setViewValue({ startDate: moment().startOf('day'), endDate: moment().startOf('day') });
					return;
				}
				$element.data('daterangepicker').startDate = modelValue.startDate;
				$element.data('daterangepicker').endDate = modelValue.endDate;
				$element.data('daterangepicker').updateView();
				$element.data('daterangepicker').updateCalendars();
				$element.data('daterangepicker').updateInputText();
			});		
		}
	};
}]);

})(angular);
