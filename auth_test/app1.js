// function simplestTemplate(templateId, data) {
//     var resultTemplate = document.getElementById(templateId).innerHTML;
//     var dataKeys = Object.keys(data);
//     for (var key in dataKeys) {
//         var reg = RegExp('%' + dataKeys[key] + '%', 'g');
//         resultTemplate = resultTemplate
//             .replace(reg, data[dataKeys[key]])
//     }
//     return resultTemplate;
// }
//
// var f = (function () {
//     function changeAppState(state) {
//         document.body.className = 'state-' + state;
//     }
//
//     function getStatus() {
//         return new Promise(function(resolve, reject) {
//             VK.Auth.getLoginStatus(function(data) {
//                 if (!data.session) {
//                     reject(data);
//                 }
//                 resolve(data.session);
//             });
//         });
//     }
//
//     function login() {
//         return new Promise(function(resolve, reject) {
//             VK.Auth.login(function(data) {
//                 if (data.status !== 'connected') {
//                     reject(data);
//                 }
//                 resolve(data.session);
//             }, 2);
//         });
//     }
//
//     function getMyFriends() {
//         return new Promise(function(resolve, reject) {
//             VK.Api.call('friends.get', {order: 'random', count: 5, fields: 'nickname,photo_100'}, function (data) {
//                 if (!data.response) {
//                     reject(data);
//                 }
//                 resolve(data.response);
//             });
//         });
//     }
//
//     function getUserParams(id) {
//         return new Promise(function(resolve, reject) {
//             VK.Api.call('users.get', {user_id: id, fields: 'nickname,photo_100'}, function(data) {
//                 if(!data.response) {
//                     reject(data);
//                 }
//                 resolve(data.response[0]);
//             });
//         });
//     }
//
//     function showInfo(userId) {
//         getUserParams(userId)
//             .then(function (userData) {
//                 var userHtml = simplestTemplate('user-template', userData);
//                 document.querySelector('.js-user-info').innerHTML = userHtml;
//                 return getMyFriends();
//             })
//             .then(function (friends) {
//                 var friendsHtml = friends.map(function (friendData) {
//                     return simplestTemplate('friend-template', friendData)
//                 }).join('');
//                 document.querySelector('.js-friends-list').innerHTML = friendsHtml;
//                 changeAppState('success');
//             })
//             .catch(function (e) {
//                 console.error(e.message);
//             });
//     }
//
//     function addListeners() {
//         document.querySelector('.js-login').addEventListener('click', function () {
//             changeAppState('loading');
//             login()
//                 .then(function (session) {
//                     showInfo(session.mid);
//                 })
//                 .catch(function (e) {
//                     console.error(e);
//                     changeAppState('error');
//                 });
//         });
//     }
//
//     return {
//         init: function (id) {
//             VK.init({
//                 apiId: id
//             });
//
//             getStatus()
//                 .then(function (session) {
//                     if (!session.sid) {
//                         throw new Error('No authorised')
//                     }
//                     showInfo(session.mid);
//                 })
//                 .catch(function () {
//                     changeAppState('login');
//                     addListeners();
//                 });
//         }
//     }
// })();
//
// document.addEventListener('DOMContentLoaded', function () {
//     window.f.init(7500252);
// });
(function () {
    const login = () => {
        VK.Auth.login(function (response) {
            if (response.session) {
                showAuthData(response.session);

                if (response.settings) {
                    console.log(response.settings);
                    // Выбранные настройки доступа пользователя если они были запрошены
                }
            } else {
                // Пользователь нажал кнопку Отмена в окне авторизации
            }
        });
    }


    const showAuthData = (data) => {
        $('body').append('<p>expire: ' + data.expire +'</p>');
        $('body').append('<p>mid: ' + data.mid +'</p>');
        $('body').append('<p>fio: ' + data.user.first_name + ' ' + data.user.last_name +'</p>');
        $('body').append('<p>userDomain: ' + data.user.domain +'</p>');
        $('body').append('<p>-----------------------------------------------</p>');
    }
    const showFriends = (data) => {

        for(var i = 0; i < data.length; ++i) {
            $('body').append('<ol>' +
            '<li>' +
            data[i].first_name + ' ' + data[i].last_name +
            '/<li>' +
            '</ol>'
        )

        }
    }

    const friends = () => {
        VK.Api.call('users.get', {user_id: id, fields: 'nickname,photo_100'}, function (data) {

            if (data.response) {
                showFriends(data.response)
            }
                })
    };

    const btn = document.querySelector('.js-login');
    btn.addEventListener('click', function () {
        login();
        friends()
    })

})();