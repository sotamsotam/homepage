import { createStore } from 'vuex';
import scoreStore from '@/store/modules/score.js';
import loginStore from '@/store/modules/login.js';

export default createStore({
	modules: {
		scoreStore: scoreStore,
        loginStore: loginStore
	}
});