import { createStore } from 'vuex';
import scoreStore from '@/store/modules/score.js';

export default createStore({
	modules: {
		scoreStore: scoreStore
	}
});