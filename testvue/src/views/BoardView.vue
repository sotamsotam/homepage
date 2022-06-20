<template>
	<div class="board">
		<h1>This is an board view page</h1>
		<table>
			<colgroup>
				<col style="width:18.5%">
				<col style="width:">
			</colgroup>
			<tbody>
				<tr>
					<th scope="row">제목</th>
					<td class="title">{{boardItem.subject}}</td>
				</tr>
				<tr>
					<th scope="row">내용</th>
					<td>{{boardItem.content}}</td>
				</tr>
				<tr>
					<th scope="row">작성자</th>
					<td>{{boardItem.writer}}</td>
				</tr>
				<tr>
					<th scope="row">작성일자</th>
					<td>{{boardItem.writedate}}</td>
				</tr>
			</tbody>
		</table>
        <div class="buttons">
            <div class="right">
                <button class="button" @click="boardListClick">목록</button>
            </div>
            <div class="left">
                <button class="button" v-if="isEditable" @click="boardEditClick">수정</button>
                <button class="button" v-if="isEditable" @click="boardDeleteClick">삭제</button>
            </div>
        </div>
	</div>
</template>

<script>
export default {
	name : 'BoardView',
    data() {
        return {
            boardItem: {}
        }
    },
    computed: {
        isEditable() {
            var result = false;
            var isLogin = this.$store.getters['loginStore/isLogin'];
            if (isLogin) {
                const writer = this.$store.state.loginStore.memberId;
                if (writer == this.boardItem.writer) {
                    result = true;
                }
            }
            return result;
        }
    },
    methods: {
        getBoardItem() {
            this.axios.get('http://localhost:9000/boards/' + this.$route.query.boardNo).then((res) => {
                this.boardItem = res.data.data;
            }).catch((err) => {
                console.log(err);
            })
        },
        boardListClick() {
            this.$router.go(-1);
        },
        boardEditClick() {
            this.$router.push({name: 'BoardEdit', query: {boardNo: this.boardItem.no}});
        },
        boardDeleteClick() {
            let result = confirm("정말 삭제하시겠습니까?");
            if(result) {
                this.axios.delete('http://localhost:9000/boards/' + this.$route.query.boardNo).then((res) => {
                    if(res.data.success == true) {
                        alert("삭제되었습니다");
                        this.$router.push({name: 'BoardList'});
                    }
                }).catch((err) => {
                    console.log(err); 
                    alert("오류가 발생하였습니다");
                })
            }
        }
    },
    mounted() {
        this.getBoardItem();
    }
};
</script>

<style scoped>
.board { width:800px; margin: 20px auto; }
.board table { width:100%; border-top:2px solid #1d4281; border-spacing:0; }
.board table th { padding:8px 10px 10px 10px; vertical-align:middle; color:#1d4281; font-size:14px; border-bottom:1px solid #ccc; background:#f8f8f8; }
.board table td { padding:7px 20px 9px 20px; text-align:left; vertical-align:middle; border-bottom:1px solid #ccc; font-size:14px; line-heighT:150%; }
.board table td.title { font-weight: bold; }
.buttons { position:relative; height:32px; margin-top:20px; }
.buttons > div.right { position:absolute; height:32px; right:0; }
.buttons > div > button { overflow:visible; cursor:pointer; min-width:125px; height:32px; margin:0 2px; padding:0 15px; line-height:32px; font-size:14px; border:1px solid #dfdfdf; background:#fff; border-radius:10px; }
.buttons > div.left { position:absolute; height:32px; left:0; }
</style>