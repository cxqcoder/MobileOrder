var myapp = angular.module('kaifanla', ['ng', 'ngRoute', 'ngAnimate']);
myapp.config(function($routeProvider) {
	$routeProvider.when('/', {
		templateUrl: 'zym/start.html',
		controller: 'startCtrl'
	}).when('/main', {
		templateUrl: 'zym/main.html',
		controller: 'mainCtrl'
	}).when('/detail/:did', {
		templateUrl: 'zym/detail.html',
		controller: 'detailCtrl'
	}).when('/personal', {
		templateUrl: 'zym/personal.html',
		controller: 'personalCtrl'
	}).when('/order/:did', {
		templateUrl: 'zym/order.html',
		controller: 'orderCtrl'
	}).when('/start', {
		templateUrl: 'zym/start.html',
		controller: 'startCtrl'
	}).when('/cebian', {
		templateUrl: 'zym/cebian.html',
		controller: 'cebianCtrl'
	}).when('/infor', {
		templateUrl: 'zym/infor.html',
		controller: 'inforCtrl'
	}).otherwise({
		redirectTo: '/main'
	})
});
myapp.controller('parentCtrl', ['$scope', '$location', function($scope, $location) {
	$scope.jump = function(url) {
		$location.path(url);
	}
}]);
myapp.controller('inforCtrl', ['$scope', '$location', function($scope, $location) {
	$scope.jump = function(url) {
		$location.path(url);
	}
}])
myapp.controller('cebianCtrl', ['$scope', '$location', function($scope, $location) {
	$scope.jump = function(url) {
		$location.path(url);
	}
}])
myapp.controller('startCtrl', ['$scope', function($scope) {
	var cout = 0;
	var time = 3;
	var t = setInterval(function() {
		$("img").removeClass("now").eq(cout).addClass("now");
		cout++;
		cout = cout > 2 ? 0 : cout;
		console.log(cout);
		$(".start p span").text(time);
		time--;
		if(time == -1) {
			clearInterval(t);
			$(".start").click();
		}
	}, 1000)
}]);
myapp.controller('mainCtrl', ['$scope', '$http', function($scope, $http) {
	$scope.hasmore = true;
	$http.get("data/dish_getbypage.php?start=0").success(function(data) {
		$scope.menulsit = data;

	})
	$scope.loadmore = function() {
		$http.get("data/dish_getbypage.php?start=" + $scope.menulsit.length).success(function(data) {
			$scope.menulsit = $scope.menulsit.concat(data);
			if(data.length < 5) {
				$scope.hasmore = false;
			}
		})
	}
	$scope.$watch("kw", function() {
		if($scope.menulsit) {
			$http.get("data/dish_getbykw.php?kw=" + $scope.kw).success(function(data) {
				$scope.menulsit = data;
			})
		}

	})
}]);
myapp.controller('detailCtrl', ['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {
	$scope.foodid = $routeParams.did;
	$http.get("data/dish_getbyid.php?id=" + $scope.foodid).success(function(data) {
		$scope.food = data[0];
	})
}]);
myapp.controller('personalCtrl', ['$scope', '$http', function($scope, $http) {
	$http.get("data/order_getbyphone.php?phone=" + sessionStorage.getItem("phone")).success(function(data) {
		$scope.myOrders = data;
	})
}]);

myapp.controller('orderCtrl', ['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {
	$scope.orderList = {
		"did": $routeParams.did
	};
	$("#uname").focus(function() {
		$("#err1").text("请输入您的姓名！")
	})
	$("#uname").blur(function() {
		if($(this).val().length==0) {
			$("#err1").text("输入为空，请重新输入！")
		} else {
			$("#err1").text("输入成功！")
		}

	})
	$("#telphone").focus(function() {
		$("#err2").text("请输入您的手机号码！")
	})
	$("#telphone").blur(function() {
		var re = /^((13[0-9])|(14[57])|(15([0-3]|[5-9]))|(18[05-9]))\d{8}$/;
		if(!re.test($(this).val())) {
			$(this).val("").focus();
			$("#err2").text("号码格式不合格！");
		} else {
			$("#err2").text("号码格式合格！")
		}
	})
	$scope.submitOrder = function() {

		if($("#uname").val().length == 0 || $("#telphone").val().length == 0 || $("#addr").val().length == 0) {
			alert("请填写订餐信息！")
		} else {
			sessionStorage.setItem("phone", $scope.orderList.phone);
			$scope.args = $.param($scope.orderList);
			$http.get('data/order_add.php?' + $scope.args).success(function(data) {
				if(data[0].msg == "succ") {
					$scope.msgBox = "订餐成功！您的订单编号为：" + data[0].oid + "。您可以在用户中心查看订单状态。"
				} else {
					$scope.errBox = "订餐失败！"
				}
			})
		}

	}
}]);