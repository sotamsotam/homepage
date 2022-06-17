<template>
	<div class="score">
		<div></div>
		<div>랜덤 점수 : </div>
		<div>합계 점수 : </div>
		<div class="result"></div>
		<div class="buttons">
			<button class="button blue">실행</button>
			<button class="button">새로고침</button>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Score',
   
};
</script>

<style scoped>
.result { padding: 10px 10px; font-size:20px; color:red; }
.buttons { position:relative; height:32px; margin-top:20px; }
.buttons > .button { overflow:visible; cursor:pointer; min-width:125px; height:32px; margin:0 2px; padding:0 15px; line-height:32px; font-size:14px; border:1px solid #dfdfdf; background:#fff; border-radius:10px; }
.buttons > .button.blue { color:#fff; border-color:#0099d2 !important; background:#0099d2 !important; }
</style>