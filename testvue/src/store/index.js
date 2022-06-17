import { createStore } from 'vuex';

export default createStore({
	state: {
        total: 0,
        score: 0,
        count: 3
	},
	getters: {
        getTotal(state) {
            return state.total;
        },
        getScore(state) {
            return state.score;
        },
        getCountString(state) {
            return "현재카운트가" + state.count + "번 남았습니다"
        },
        getTotalState(state, getters) {
            if(state.count == 0) {
                return getters.getTotal >= 10 ? "성공" : "실패"
            }
        }
	},
	mutations: {
        decrementCount(state) {
            state.count--;
        },
        incrementTotalByRandom(state) {
            const random = Math.floor(Math.random() * 10);
            state.score = random;
            state.total += random;
        },
        reset(state) {
            state.total = 0;
            state.score = 0;
            state.count = 3;
        }
	},
	actions: {
        doScore({commit, state}) {
            if (state.count > 0) {
                commit('decrementCount');
                commit('incrementTotalByRandom');
            }
        },
        reset({commit}) {
            commit('reset');
        }
	}
});