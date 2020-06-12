var f = (function () {
    const template = (templateId, data) => {
        let resultTemplate = document.getElementById(templateId).innerHTML;
        let dataKeys = Object.keys(data);
        console.log(dataKeys)
        for (let key in dataKeys) {
            let reg = RegExp('%' + dataKeys[key] + '%', 'g');
            console.log(reg)
            resultTemplate = resultTemplate
                .replace(reg, data[dataKeys[key]])
        }
        return resultTemplate;
    };

    const appState = (state) => {
        document.body.className = 'state-' + state;
    };

    const currentStatus = () => {
        return new Promise(function (resolve, reject) {
            VK.Auth.getLoginStatus(function (data) {
                if (!data.session) {
                    reject(data);
                }
                resolve(data.session);
            });
        });
    };

    const login = () => {
        return new Promise(function (resolve, reject) {
            VK.Auth.login(function (data) {
                if (data.status !== 'connected') {
                    reject(data);
                }
                resolve(data.session);
            }, 2);
        });
    };

    const getFriends = () => {
        return new Promise(function (resolve, reject) {
            VK.Api.call('friends.get', {
                order: 'random',
                // count: 5,
                fields: 'nickname,photo_100',
                v: 5.73
            }, function (data) {
                if (!data.response) {
                    reject(data);
                }
                resolve(data);
            });
        });
    };

    const getUserParams = (id) => {
        return new Promise(function (resolve, reject) {
            VK.Api.call('users.get', {user_id: id, fields: 'nickname,photo_100', v: 5.73}, function (data) {
                if (!data.response) {
                    reject(data);
                }
                resolve(data.response[0]);
            });
        });
    };


    const userInfo = (id) => {
        getUserParams(id)
            .then(userData => {
                let userHtml = template('user-template', userData);
                document.querySelector('.js-user-info').innerHTML = userHtml;
                let res = [];
                let i = 0;
                getFriends()
                    .then(data => {
                        //         data.response.items.filter(function (n) {
                        //     return n['deactivated'] === undefined;
                        // });

                        data.response.items.forEach(n => {
                            if (n.deactivated === undefined) {
                                if (i < 5) {
                                    res.push(n);
                                    i++
                                }
                            }
                        })

                        // });

                        return res;

                    })
                    .then(function (friends) {
                        let friendsHtml = friends.map(function (friendData) {
                            return template('friend-template', friendData)
                        }).join('');
                        document.querySelector('.js-friends-info').innerHTML = friendsHtml;
                    })
                    .catch(function (e) {
                        console.error(e.message);
                    });
            })
    }

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
                    document.querySelector('.js-login').addEventListener('click', function () {
                        login()
                            .then(function (session) {
                                userInfo(session.mid);
                                appState('success');
                            })
                            .catch(function (e) {
                                console.error(e);
                                appState('error');

                            });
                    });
                });
        }
    }
})();

document.addEventListener('DOMContentLoaded', function () {
    window.f.init();
});