Parse.Cloud.define("notif", (request) => {
    var User = Parse.Object.extend("_User");
    var userQuery = new Parse.Query(User);
    userQuery.equalTo("statusUser", 0);
  
    var query = new Parse.Query(Parse.Installation);
    query.matchesKeyInQuery("userId", "objectId", userQuery);
    query.equalTo("deviceType", "android");
  
    Parse.Push.send({
      where: query,
      data: {
        title: request.params.title,
        alert: request.params.alert,
        priority: request.params.priority,
        badge: 1,
        sound: 'default'
      }
    }, {
      success: function () {
        console.log('##### PUSH OK');
      },
      error: function (error) {
        console.log('##### PUSH ERROR');
      },
      useMasterKey: true
    });
  });


// push notification
Parse.Cloud.define("notifWeb", (request) => {
    var messaging = Parse.Object.extend("Messaging");
    var messagingQuery = new Parse.Query(messaging);

    messagingQuery.equalTo("messagingType", 0);
    messagingQuery.include('ke');
    messagingQuery.equalTo("ke", {
        __type: 'Pointer',
        className: '_User',
        objectId: request.params.delegasi
    });
  
    var query = new Parse.Query(Parse.Installation);
    query.matchesKeyInQuery("userId", "ke", messagingQuery);
    query.equalTo("deviceType", "android");
  
    Parse.Push.send({
      where: query,
      data: {
        title: request.params.title,
        timeDate: request.params.timeDate,
        detail: request.params.detail,
        badge: 1,
        sound: 'default'
      }
    }, {
      success: function () {
        console.log('##### PUSH OK');
      },
      error: function (error) {
        console.log('##### PUSH ERROR');
      },
      useMasterKey: true
    });
  });