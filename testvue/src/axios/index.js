import axios from 'axios';
import store from '@/store';

axios.interceptors.response.use(function (response) {
		// 응답 데이터로 처리
		return response;
	}, async function (error) {
		// 응답 오류에 대한 처리
		//console.log(error.response);
		// 에러가 발생한 요청 정보를 가져옵니다.
		var axiosRequest = error.config;
		if (error.response && !axiosRequest._retry) {
			axiosRequest._retry = true;
			// 응답코드가 403이고 응답 메시지가 "Authentication fail"때만 처리합니다.
			if (error.response.status == 403 && error.response.data.errormessage == "Authentication fail") {
				// 로그인되었는지 확인한다.
				var isLogin = store.getters['loginStore/isLogin'];
				if (isLogin) {
					// accessToken이 만료되면 토큰 재발급을 진행합니다.
					try {
						// accessToken 재발급 요청
						await store.dispatch("loginStore/doRefreshToken");
						// 재발급된 accessToken으로 해더를 수정합니다.
						axiosRequest.headers['Access-Token'] = store.state.loginStore.accessToken;
						// 다시 요청 정보로 요청(request)합니다.
						return axios(axiosRequest);
					} catch(err) {
						alert("다시 로그인을 해주시기 바랍니다.\n" + err.response.data.errormessage);
					}
				}
			}
		}
		return Promise.reject(error);
	});

export default axios;