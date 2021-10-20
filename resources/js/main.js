// DOM
const playground = document.querySelector('.playground ul');

// Settings
const ROWS = 20;
const COLS = 10;

// Variables
let score = 0;
let duration = 500; // 블럭이 떨어지는 시간
let downInterval;
let tempMovingItem; // 무빙을 실행하기 전에 잠시 담아주는 용도

const BLOCKS = {
  /**
   * 좌표 템플릿
   *[[],[],[],[]],
    [[],[],[],[]],
    [[],[],[],[]],
    [[],[],[],[]]
   */
  tree: [
    [[1,0],[0,1],[1,1],[2,1]], // 4개의 배열은 방향키를 돌렸을 때 각 모양을 가짐, 그 안에는 또다른 배열 좌표값(x, y)을 가지고 있음
    [[0,0],[0,1],[0,2],[1,1]],
    [[0,0],[1,0],[1,1],[2,0]],
    [[0,1],[1,0],[1,1],[1,2]]
  ],
  square: [
    [[0,0],[0,1],[1,0],[1,1]],
    [[0,0],[0,1],[1,0],[1,1]],
    [[0,0],[0,1],[1,0],[1,1]],
    [[0,0],[0,1],[1,0],[1,1]],
  ]

};
// 무빙아이템이 실질적으로 다음 블럭의 타입과 좌표등 가지고 있는 객체가 됨
const movingItem = {
  type: "square", // 블럭 타입
  direction: 0, // 방향키를 눌렀을때 좌우로 회전시키는 용도
  top:18,       // top은 좌표 기준으로 어디까지 내려와있는지 등 표현해주는 역할
  left: 8       // top과 마찬가지로 좌우 좌표 값을 표현해주는 역할
};


init();

// functions 
function init() { // 처음 시작될 때 실행
  for (let i = 0; i < ROWS; i++) {
    tempMovingItem = {...movingItem}; // 스프레드 operator movingItem안에 있는 값만 가져와서 넣어줌 (movingItem의 값이 변하더라도 temp는 값이 안변함)
    prependNewLine(); // 게임 보드판 생성하는 함수
  }
  renderBlocks();
}

function prependNewLine() {
  const li = document.createElement('li');
  const ul = document.createElement('ul');

  for (let j = 0; j < COLS; j++) {
    const matrix = document.createElement('li');
    ul.prepend(matrix);
  }
  
  li.prepend(ul);
  playground.prepend(li);
}

function renderBlocks() { // 블럭을 렌더링 해주는 함수
  // 블럭을 선택해서 좌표값에 맞는 모양대로 그림을 그려주는 역할
  const { type, direction, top, left } = tempMovingItem;  // 각각의 프로퍼티들을 바로 바로 변수처럼 사용하기 위해서 destruction 사용
  const movingBlocks = document.querySelectorAll('.moving'); // moving 클래스를 가진 모든 엘리먼트
  movingBlocks.forEach(moving => {
    moving.classList.remove(type, 'moving') // moving을 가진 클래스를 삭제
    moving.style.outline = 'none';          // 블럭 이동 시 기존 outling 안보이게 설정
  })

  BLOCKS[type][direction].forEach(block => {  // 반복문 돌려서 각각의 클래스를 선택 후 그리기
    console.log(block);
    const x = block[0] + left;
    const y = block[1] + top;
    const target = playground.childNodes[y].childNodes[0].childNodes[x];
    
    target.classList.add(type, "moving"); // 매트릭스에 클래스이름 추가, "moving"이라는 클래스도 추가해서 무빙을 가지고 있는 클래스만 컬러를 가질 수 있도록 함 
    target.style.outline = '1px solid rgba(0, 0, 0, 0.3)';  
  });
}

function moveBlock(moveType, amount) {  // moveType은 렌더링을 할때 tempMovingItem을 통해서 하기 때문에 tempMovingItem을 바꿔주면 됨
  tempMovingItem[moveType] += amount;
  
  renderBlocks();
}

// event handlering
document.addEventListener('keydown', e => { 
  // 각각의 키는 keyCode를 가지고 있음
  switch(e.keyCode) {   // 39(우), 37(좌), 38(상), 40(하)
    case 39:  // 오른쪽 방향키 
      moveBlock("left", 1);
      break;
    case 37:  // 왼쪽 방향키
      moveBlock("left", -1)
      break;
    case 40:  // 아래 방향키
      moveBlock("top", 1)
    default: 
      break;
  }
});





