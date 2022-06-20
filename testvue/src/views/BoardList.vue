<template>
	<div class="board">
		<h1>This is an board list page</h1>
        <div class="buttons">
            <div class="right">
                <router-link :to="{name: 'BoardWrite'}" class="button blue"><span>쓰기</span></router-link>
            </div>
        </div>
		<table>
			<colgroup>
				<col style="width:10%">
				<col style="width:*">
				<col style="width:15%">
				<col style="width:25%">
			</colgroup>
			<thead>
				<tr>
					<th scope="col">번호</th>
					<th scope="col">제목</th>
					<th scope="col">작성자</th>
					<th scope="col">작성일</th>
				</tr>
			</thead>
			<tbody>
                <tr v-for="boardItem in boardList" :key="boardItem.no">
                    <td><span @click="boardNoClick(boardItem)">{{boardItem.no}}</span></td>
                    <td><router-link :to="{name: 'BoardView', query: {boardNo: boardItem.no}}">{{boardItem.subject}}</router-link></td>
                    <td>{{boardItem.writer}}</td>
                    <td>{{boardItem.writedate}}</td>
                </tr>
			</tbody>
		</table>
	</div>
</template>

<script>
export default {
	name : 'BoardList',
    data() {
        return {
            boardList: []
        }
    },
    methods: {
        getBoardList() {
            this.axios.get('http://localhost:9000/boards').then((res) => {
                this.boardList = res.data.data;
            }).catch((err) => {
                console.log(err);
            })
        },
        boardNoClick(boardItem) {
            this.$router.push({name : 'BoardView', query : {boardNo : boardItem.no}});
        }
    },
    mounted() {
        this.getBoardList();
    }
};
</script>

<style scoped>
.board { width:800px; margin: 20px auto; }
.board table { width:100%; border-top:2px solid #1d4281; border-spacing:0; }
.board table th { padding:8px 10px 10px 10px; vertical-align:middle; color:#1d4281; font-size:14px; border-bottom:1px solid #ccc; background:#f8f8f8; }
.board table td { padding:7px 10px 9px 10px; text-align:center; vertical-align:middle; border-bottom:1px solid #ccc; font-size:14px; line-heighT:150%; }
.board table td:nth-child(1) span { cursor: pointer; }
.buttons { position:relative; height:32px; margin-bottom:20px; }
.buttons > div.right { position:absolute; height:32px; right:0; }
.buttons > div > a.button { display:inline-block; min-width:95px; height:32px; line-height:32px; vertical-align:middle; font-size:13px; text-align:center; text-decoration:none; border-radius:20px; }
.buttons > div > .button.blue { color:#fff; border-color:#0099d2 !important; background:#0099d2 !important; }
</style>
