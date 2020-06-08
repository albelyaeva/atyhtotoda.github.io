var f = (function () {
    const template = (templateId, data) => {
        let resultTemplate = document.getElementById(templateId).innerHTML;
        let dataKeys = Object.keys(data);
        for (let key in dataKeys) {
            let reg = RegExp('%' + dataKeys[key] + '%', 'g');
            resultTemplate = resultTemplate
                .replace(reg, data[dataKeys[key]])
        }
        return resultTemplate;
    };

    const appState = (state) => {
        document.body.className = 'state-' + state;
    };

    const currentStatus = () => {
        return new Promise(function(resolve, reject) {
            VK.Auth.getLoginStatus(function(data) {
                if (!data.session) {
                    reject(data);
                }
                resolve(data.session);
            });
        });
    };

    const login = () => {
        return new Promise(function(resolve, reject) {
            VK.Auth.login(function(data) {
                if (data.status !== 'connected') {
                    reject(data);
                }
                resolve(data.session);
            }, 2);
        });
    };

    const getFriends = () => {
        return new Promise(function(resolve, reject) {
            VK.Api.call('friends.get', {order: 'random', count: 5, fields: 'nickname,photo_100', v: 5.73}, function (data) {
                if (!data.response) {
                    reject(data);
                }
                resolve(data.response);
            });
        });
    };

    const getUserParams = (id) => {
        return new Promise(function(resolve, reject) {
            VK.Api.call('users.get', {user_id: id, fields: 'nickname,photo_100', v: 5.73}, function(data) {
                if(!data.response) {
                    reject(data);
                }
                resolve(data.response[0]);
            });
        });
    };


    const userInfo = (id) => {
        getUserParams(id)
            .then(function (userData) {
                var userHtml = template('user-template', userData);
                document.querySelector('.js-user-info').innerHTML = userHtml;
                return getFriends();
            })
            .then(function (friends) {
                var friendsHtml = friends.items.map(function (friendData) {
                    return template('friend-template', friendData)
                }).join('');
                document.querySelector('.js-friends-info').innerHTML = friendsHtml;
            })
            .catch(function (e) {
                console.error(e.message);
            });
    };
     const listeres = () => {
        document.querySelector('.js-login').addEventListener('click', function () {
            login()
                .then(function (session) {
                    userInfo(session.mid);
                })
                .catch(function (e) {
                    console.error(e);
                    appState('error');

                });
        });
    };

    return {
        init: function () {
            VK.init({
                apiId: 7500252
            });
            currentStatus()
                .then(function (session) {
                    if (!session.sid) {
                        throw new Error('No authorisation')
                    }
                    userInfo(session.mid);
                })
                .catch(function () {
                    appState('login');
                    listeres();
                });
        }
    }
})();

document.addEventListener('DOMContentLoaded', function () {
    window.f.init();
});