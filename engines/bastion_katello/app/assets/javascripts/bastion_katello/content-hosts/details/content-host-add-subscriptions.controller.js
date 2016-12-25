/**
 * @ngdoc object
 * @name  Bastion.content-hosts.controller:ContentHostAddSubscriptionsController
 *
 * @requires $scope
 * @requires $location
 * @requires translate
 * @requires CurrentOrganization
 * @requires Subscription
 * @requires ContentHost
 * @requires SubscriptionsHelper
 *
 * @description
 *   Provides the functionality for the content host details action pane.
 */
angular.module('Bastion.content-hosts').controller('ContentHostAddSubscriptionsController',
    ['$scope', '$location', 'translate', 'Nutupane', 'CurrentOrganization', 'Host', 'HostSubscription', 'Subscription', 'SubscriptionsHelper',
    function ($scope, $location, translate, Nutupane, CurrentOrganization, Host, HostSubscription, Subscription, SubscriptionsHelper) {

        var params = {
            'organization_id': CurrentOrganization,
            'search': $location.search().search || "",
            'sort_order': 'ASC',
            'available_for': 'host',
            'host_id': $scope.$stateParams.hostId
        };

        $scope.nutupane = new Nutupane(Subscription, params);
        $scope.nutupane.setSearchKey('subscriptionSearch');
        $scope.nutupane.masterOnly = true;
        $scope.table = $scope.nutupane.table;

        $scope.isAdding = false;
        $scope.groupedSubscriptions = {};

        $scope.$watch('table.rows', function (rows) {
            $scope.groupedSubscriptions = SubscriptionsHelper.groupByProductName(rows);
        });

        $scope.getAmountSelectorValues = SubscriptionsHelper.getAmountSelectorValues;

        $scope.disableAddButton = function () {
            return $scope.table.numSelected === 0 || $scope.isAdding;
        };

        $scope.addSelected = function () {
            var selected;
            selected = SubscriptionsHelper.getSelectedSubscriptionAmounts($scope.table);

            $scope.isAdding = true;
            HostSubscription.addSubscriptions({id: $scope.$stateParams.hostId, 'subscriptions': selected}, function () {
                Host.get({id: $scope.$stateParams.hostId}, function (host) {
                    $scope.$parent.host = host;
                    $scope.successMessages.push(translate("Successfully added %s subscriptions.").replace('%s', selected.length));
                    $scope.isAdding = false;
                    $scope.nutupane.refresh();
                });
            }, function (response) {
                $scope.errorMessages.push(response.data.displayMessage);
                $scope.isAdding = false;
                $scope.nutupane.refresh();
            });
        };
    }]
);
