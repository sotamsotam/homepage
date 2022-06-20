import axios from 'axios';

const loginStore = {
	namespaced: true,
	state: {
        memberId: '',
        accessToken: ''
	},
	getters: {
        isLogin(state) {
            return state.accessToken == '' ? false : true;
        }
	},
	mutations: {
        setMemberId(state, memberId) {
            state.memberId = memberId
        },
        setAccessToken(state, accessToken) {
            state.accessToken = accessToken;
        },
        reset(state) {
            state.memberId = '';
            state.accessToken = ''
        }
	},
	actions: {
        async doLogin({commit}, memberInfo) {
            let result = false;
            let resultErr = null;
            try {
                let res = await axios.post('http://localhost:9000/members/login', memberInfo);
                if(res.data.success == true) {
                    console.log("로그인 되었습니다");
                    commit('setMemberId', memberInfo.id);
                    commit('setAccessToken', res.data.accessToken);
                    result = true;
                }else {
                    console.log("로그인되지 않았습니다");
                    let err = new Error("Request failed with status code 401");
                    err.response = {data:{"success": false, "errormessage": "로그인되지 않았습니다"}};
                    resultErr = err;
                }
            }catch(err) {
                console.log(err);
                if(!err.response) {
                    err.response = {data: {"success": false, "errormessage": err.message}};
                    resultErr = err;
                }
            }
            return new Promise((resolve, reject) => {
                if(result) {
                    resolve();
                }else {
                    reject(resultErr)
                }
            })
        },
        doLogout({commit}) {
            commit('reset');
        }
	}
};

export default loginStore;