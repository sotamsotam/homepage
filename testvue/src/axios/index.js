import axios from 'axios';
import store from '@/store';

axios.interceptors.response.use(function (response) {
	// 응답 데이터로 처리
	console.log("axios.interceptors.response");
	return response;
}, function (error) {
	// 응답 오류에 대한 처리
	console.log("axios.interceptors.response");
	// accessToken이 만료되었는지 확인합니다.
	var isAccessTokenExpire = store.getters['loginStore/isAccessTokenExpire'];
	console.log("AccessTokenExpire = " + isAccessTokenExpire);
	return Promise.reject(error);
});

export default axios;