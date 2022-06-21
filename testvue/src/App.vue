<template>
<div>
	<header>
		<nav class="navbar navbar-expand-sm navbar-light bg-light">
			<div class="container-fluid">
				<router-link to="/" class="navbar-brand">
					<img alt="Vue logo" src="./assets/logo.png" style="height:25px;" />
					My Blog
				</router-link>
				<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
					<span class="navbar-toggler-icon"></span>
				</button>
				<div class="collapse navbar-collapse" id="navbarContent">
					<ul class="navbar-nav me-auto">
						<li class="nav-item">
							<router-link to="/" class="nav-link">Home</router-link>
						</li>
						<li class="nav-item">
							<router-link to="/about" class="nav-link">About</router-link>
						</li>
						<li class="nav-item">
							<router-link :to="{name: 'BoardList'}" class="nav-link">Board</router-link>
						</li>
						<li class="nav-item">
							<router-link :to="{name: 'Score'}" class="nav-link">Score</router-link>
						</li>
					</ul>
					<div class="navbar-info">
						<div v-if="isLogin">
							{{this.$store.state.loginStore.memberId}}님, 안녕하세요.
							<span @click="Logout()">로그아웃</span>
						</div>
						<div v-else>
							<router-link :to="{ name: 'Login', query: { returnUrl: '/' }}" v-show="isLogin == false">로그인</router-link>
						</div>
					</div>
				</div>
			</div>
		</nav>
	</header>
	<main>
		<router-view/>
	</main>
	<footer>
	</footer>
</div>
</template>

<script>
export default {
	name : 'App',
	methods : {
		Logout() {
			this.$store.dispatch("loginStore/doLogout");
			this.$router.push('/');
		}
	},
	computed : {
		isLogin() {
			return this.$store.getters['loginStore/isLogin'];
		}
	},
	mounted() {
	// 콘텐츠가 펼치기 전에 호출
	document.querySelector('#navbarContent').addEventListener('show.bs.collapse', function () {
		console.log("show.bs.collapse");
	});
	// 콘텐츠가 펼친 후에 호출
	document.querySelector('#navbarContent').addEventListener('shown.bs.collapse', function () {
		console.log("shown.bs.collapse");
	});
	// 콘텐츠가 접기 전에 호출
	document.querySelector('#navbarContent').addEventListener('hide.bs.collapse', function () {
		console.log("hide.bs.collapse");
	});
	// 콘텐츠가 접고 난 후에 호출
	document.querySelector('#navbarContent').addEventListener('hidden.bs.collapse', function () {
		console.log("hidden.bs.collapse");
	});
}
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav.navbar-transparent {
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 100;
}

nav .navbar-nav a.nav-link {
  font-weight: bold;
  color: #2c3e50 !important;
  text-align:initial;
}

nav .navbar-nav a.router-link-exact-active {
  color: #42b983 !important;
}

.navbar-info a { font-weight:bold; color:#2c3e50 !important; text-decoration:none; }
.navbar-info span { font-weight:bold; color:#2c3e50; cursor:pointer; }

@media (max-width: 576px) {
  .navbar-info { background-color:#eee; padding:10px 10px; }
}
</style>