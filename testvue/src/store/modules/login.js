import axios from 'axios';

const loginStore = {
	namespaced: true,
	state: {
        memberId: '',
        accessToken: '',
        refreshToken: ''
	},
	getters: {
        // 로그인 여부를 가져옵니다.
        isLogin(state) {
            return state.refreshToken == '' ? false : true; 
        },
        // accessToken이 만료되었는지 여부를 가져옵니다.
        isAccessTokenExpire(state) {
            let expire = false;
            // accessToken에서 .(도트)로 분리하여 payload를 가져옵니다.
            let base64Payload = state.accessToken.split('.')[1];
            // URL과 호환되지 않는 문자를 base64 표준 문자로 교체합니다.
            base64Payload = base64Payload.replace(/-/g, '+').replace(/_/g, '/');
            // atob() 메소드로 복호화합니다.
            base64Payload = atob(base64Payload);
            // JSON 객체로 변환합니다.
            var payloadObject = JSON.parse(base64Payload);
            // accessToken의 만료 시간을 확인합니다.
            var currentDate = new Date().getTime() / 1000;
            if (payloadObject.exp <= currentDate) {
                console.log("token expired");
                expire = true;
            } else {
                console.log("token valid");
            }
            return expire;
        }
    },
	mutations: {
        setMmemberId(state, memberId) {
            state.memberId = memberId
        },
        setAccessToken(state, accessToken) {
            state.accessToken = accessToken;
        },
        setRefreshToken(state, refreshToken) {
            state.refreshToken  = refreshToken;
        },
        reset(state) {
            state.memberId = '';
            state.accessToken = '';
            state.refreshToken = '';
            localStorage.removeItem("testvue.login");
        },
        saveStateToStorage(state) {
            // localStorage.setItem("testvue.login.memberId", state.memberId);
            // localStorage.setItem("testvue.login.accessToken", state.accessToken);
            // localStorage.setItem("testvue.login.refreshToken", state.refreshToken);
            localStorage.setItem("testvue.login", JSON.stringify(state));
        },
        readStateFromStorage(state) {
            // if (localStorage.getItem("testvue.login.memberId") != null) {
            //     state.memberId = localStorage.getItem("testvue.login.memberId");
            // }
            // if (localStorage.getItem("testvue.login.accessToken") != null) {
            //     state.accessToken = localStorage.getItem("testvue.login.accessToken");
            // }
            // if (localStorage.getItem("testvue.login.refreshToken") != null) {
            //     state.refreshToken = localStorage.getItem("testvue.login.refreshToken");
            // }
            if (localStorage.getItem("testvue.login") != null) {
                let storage = JSON.parse(localStorage.getItem("testvue.login"));
                if (storage.memberId != null) {
                    state.memberId = storage.memberId;
                }
                if (storage.accessToken != null) {
                    state.accessToken = storage.accessToken;
                }
                if (storage.memberId != null) {
                    state.refreshToken = storage.refreshToken;
                }
            }
        }
	},
	actions: {
        async doLogin({ commit }, memberInfo) {
            let result = false;
            let resultErr = null;
            try {
                let res = await axios.post("http://localhost:9000/members/login", memberInfo);
                if (res.data.success == true) {
                    console.log("로그인되었습니다.");
                    commit('setMmemberId', memberInfo.id);
                    commit('setAccessToken', res.data.accessToken);
                    commit('setRefreshToken', res.data.refreshToken);
                    commit('saveStateToStorage');
                    axios.defaults.headers.common['Access-Token'] = res.data.accessToken;
                    result = true;
                } else {
                    console.log("로그인되지 않았습니다.");
                    let err = new Error("Request failed with status code 401");
                    err.status = 401;
                    err.response = {data:{"success":false, "errormessage":"로그인되지 않았습니다."}};
                    resultErr = err;
                }
            } catch(err) {
                if (!err.response) {
                    err.response = {data:{"success":false, "errormessage":err.message}};
                }
                resultErr = err;
            }
            return new Promise((resolve, reject) => {
                if (result) {
                    resolve();
                } else {
                    reject(resultErr);
                }
            });
        },
        async doRefreshToken({commit, state}) {
            let result = false;
            let resultErr = null;
            if (state.accessToken != "") {
                let token = { id: state.memberId, accessToken : state.accessToken, refreshToken : state.refreshToken };
                try {
                    let res = await axios.post("http://localhost:9000/members/refresh", token);
                    if (res.data.success == true) {
                        console.log("Access-Token이 갱신되었습니다.");
                        commit('setAccessToken', res.data.accessToken);
                        console.log(res.data.accessToken);
                        axios.defaults.headers.common['Access-Token'] = res.data.accessToken;
                        result = true;
                    } else {
                        console.log("Access-Token이 갱신되지 않았습니다.");
                        let err = new Error("Request failed with status code 401");
                        err.status = 401;
                        err.response = {data:{"success":false, "errormessage":"Access-Token이 갱신되었습니다."}};
                        resultErr = err;
                    }
                } catch(err) {
                    if (!err.response) {
                        err.response = {data:{"success":false, "errormessage":err.message}};
                    }
                    resultErr = err;
                }
            } else {
                let err = new Error("Access-Token does not exist");
                err.status = 401;
                err.response = {data:{"success":false, "errormessage":"Access-Token이 없습니다."}};
                resultErr = err;
            }
            return new Promise((resolve, reject) => {
                if (result) {
                    resolve();
                    } else {
                        reject(resultErr);
                    }
            });
        },
        doReadStateFromStorage({commit}) {
            commit('readStateFromStorage');
        },
        doLogout({commit}) {
            commit('reset');
            delete axios.defaults.headers.common['Access-Token'];
        }
	}
};

export default loginStore;