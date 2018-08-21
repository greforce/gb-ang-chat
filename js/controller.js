app.controller('myCtrl', function($scope) {

  $scope.loginStatus = 'Зарегистрируйтесь или залогиньтесь';
  $scope.chatStatus = 'Не залогинен';
  $scope.loginButtonDisabled = false;
  $scope.sendButtonDisabled = true;
  $scope.logoutButtonDisabled = true;

  $scope.messages = [];

  tokens = {
    auth_sid: '',
    auth_token: '',
  }

  var stopUpdate;

  $scope.test = function() {
    const request = {
      "jsonrpc": "2.0",
        "method": "test",
        "params": {
          "key":"value"
        },
        "id": 100500
    }

    const fetchData = {
      method: 'POST',
      body: JSON.stringify(request)
    }
    fetch('http://chat.easycs.ru', fetchData)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
    });
  }


  $scope.register = function() {
    const requestId = String(Date.now()) + parseInt(Math.random() * 1000);

    const request = {
      "jsonrpc": "2.0",
      "method": "register",
      "params": {
        "nickname": $scope.userName,
        "password": $scope.userPassword,
        "email": $scope.userEmail,
        "display_name": $scope.userDisplayName
      },
      "id": requestId
    }

    const fetchData = {
      method: 'POST',
      body: JSON.stringify(request)
    }

    fetch('http://chat.easycs.ru', fetchData)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.hasOwnProperty('error')) {
          $scope.chatStatus = result.error.code + ': ' + result.error.message;
          $scope.$apply();
        } else if (result.hasOwnProperty('status') && result.status === 500) {
          $scope.chatStatus = result.name + ' ' + result.status;
          $scope.$apply();
        } else {
          $scope.chatStatus = 'Логин: ' + $scope.userName;
          $scope.loginStatus = 'Вы зарегистрированы И ЗАЛОГИНЕНЫ!';
          $scope.userName = '';
          $scope.userPassword = '';
          $scope.userEmail = '';
          $scope.userDisplayName = '';
          tokens.auth_sid = result.result.auth_sid;
          tokens.auth_token = result.result.auth_token;
          $scope.loginButtonDisabled = true;
          $scope.logoutButtonDisabled = false;
          $scope.sendButtonDisabled = false;
          $scope.$apply();
          if (typeof stopUpdate !== 'undefined') {
            clearInterval(stopUpdate);
          }
          stopUpdate = setInterval(() => {
            getMessages();
          }, 1000);
        }
      });


  }

  // auth_sid: "23f9ed2a8e18d9c89bbd47c09d06b84a"
  // auth_token: "fe991dba5948df7b32bf00cd1819c4771f0d1990"
  // gregory
  // secret

  $scope.login = function() {
    const requestId = String(Date.now()) + parseInt(Math.random() * 1000);

    const request = {
      "jsonrpc": "2.0",
      "method": "login",
      "params": {
        "nickname": $scope.userLogin,
        "password": $scope.userLoginPass
      },
      "id": requestId
    }

    const fetchData = {
      method: 'POST',
      body: JSON.stringify(request)
    }
    console.log(request);
    fetch('http://chat.easycs.ru', fetchData)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.hasOwnProperty('error')) {
          $scope.chatStatus = result.error.code + ': ' + result.error.message;
          $scope.$apply();
        } else if (result.hasOwnProperty('status') && result.status === 500) {
          $scope.chatStatus = result.name + ' ' + result.status;
          $scope.$apply();
        } else {
          $scope.chatStatus = 'Логин: ' + $scope.userLogin;
          $scope.loginStatus = 'Вы ЗАЛОГИНЕНЫ!';
          $scope.userLogin = '';
          $scope.userLoginPass = '';
          tokens.auth_sid = result.result.auth_sid;
          tokens.auth_token = result.result.auth_token;
          $scope.loginButtonDisabled = true;
          $scope.logoutButtonDisabled = false;
          $scope.sendButtonDisabled = false;
          $scope.$apply();
          if (typeof stopUpdate !== 'undefined') {
            clearInterval(stopUpdate);
          }
          stopUpdate = setInterval(() => {
            getMessages();
          }, 1000);
        }
    });
  }

  $scope.sendMessage = function() {
    const requestId = String(Date.now()) + parseInt(Math.random() * 1000);

    const request = {
      "jsonrpc": "2.0",
      "method": "send_msg",
      "params": {
        "auth_sid": tokens.auth_sid,
        "auth_token": tokens.auth_token,
        "to": "all",
        "message": $scope.userMessage
      },
      "id": requestId
    }

    const fetchData = {
      method: 'POST',
      body: JSON.stringify(request)
    }
    console.log(request);
    fetch('http://chat.easycs.ru', fetchData)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.hasOwnProperty('error')) {
          $scope.msgStatus = result.error.code + ': ' + result.error.message;
          $scope.$apply();
        } else if (result.hasOwnProperty('status') && result.status === 500) {
          $scope.msgStatus = result.name + ' ' + result.status;
          $scope.$apply();
        } else {
          $scope.msgStatus = 'Сообщение отправлено в чат';
          $scope.userMessage = '';
          $scope.$apply();
        }
    });
  }

  function getMessages() {
    const requestId = String(Date.now()) + parseInt(Math.random() * 1000);

    const request = {
      "jsonrpc": "2.0",
      "method": "get_msg",
      "params": {
        "auth_sid": tokens.auth_sid,
        "auth_token": tokens.auth_token,
        "limit":50,
        "offset":0
      },
      "id": requestId
    }

    const fetchData = {
      method: 'POST',
      body: JSON.stringify(request)
    }
    fetch('http://chat.easycs.ru', fetchData)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.hasOwnProperty('error')) {
          $scope.chatWindowStatus = result.error.code + ': ' + result.error.message;
          $scope.$apply();
        } else if (result.hasOwnProperty('status') && result.status === 500) {
          $scope.chatWindowStatus = result.name + ' ' + result.status;
          $scope.$apply();
        } else {
          $scope.messages = result.result.messages.slice(-30).sort((itemA, itemB) => itemB.id - itemA.id);
          console.log($scope.messages);
          $scope.chatWindowStatus = 'Чат обновлен ' + Date();
          $scope.$apply();
        }
    });
  }

  $scope.logout = function() {
    $scope.loginButtonDisabled = false;
    $scope.logoutButtonDisabled = true;
    $scope.sendButtonDisabled = true;
    $scope.loginStatus = 'Зарегистрируйтесь или залогиньтесь';
    $scope.chatStatus = 'Не залогинен';

    if (typeof stopUpdate !== 'undefined') {
      clearInterval(stopUpdate);
    }
  }


});
