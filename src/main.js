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
    let taskTo = request.params.taskTo;
    const title = request.params.title;
    const alert = request.params.alert;
    const priority = request.params.priority;
    // var User = Parse.Object.extend("_User");
    // var userQuery = new Parse.Query(User);
    // userQuery.equalTo("statusUser", 0);
    // userQuery.equalTo("objectId", {
    //     __type: 'Pointer',
    //     className: '_User',
    //     objectId: delegasi
    // });
  
    var query = new Parse.Query(Parse.Installation);
    query.equalTo("userId", taskTo);
    // query.matchesKeyInQuery("userId", "objectId", userQuery);
    
    
  
    query.equalTo("deviceType", "android");
  
    Parse.Push.send({
      where: query,
      data: {

        title: title,
        alert: alert,
        priority: priority,
        badge: 1,
        sound: 'default'

        // title: request.params.title,
        // alert: request.params.alert,
        // priority: request.params.priority,
        // badge: 1,
        // sound: 'default'
    
        // title: request.params.title,
        // timeDate: request.params.timeDate,
        // detail: request.params.detail,
        // badge: 1,
        // sound: 'default'
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