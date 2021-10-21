import BLOCKS from './blocks.js';

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


// 무빙아이템이 실질적으로 다음 블럭의 타입과 좌표등 가지고 있는 객체가 됨
const movingItem = {
  type: "tree", // 블럭 타입
  direction: 0, // 방향키를 눌렀을때 좌우로 회전시키는 용도
  top: 10,       // top은 좌표 기준으로 어디까지 내려와있는지 등 표현해주는 역할
  left: 0       // top과 마찬가지로 좌우 좌표 값을 표현해주는 역할
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

function renderBlocks(moveType ='') { // 블럭을 렌더링 해주는 함수 , moveType = ''은  함수 호출시 인자값을 안줬을때 공백으로 초기화
  // 블럭을 선택해서 좌표값에 맞는 모양대로 그림을 그려주는 역할
  const { type, direction, top, left } = tempMovingItem;  // 각각의 프로퍼티들을 바로 바로 변수처럼 사용하기 위해서 destruction 사용
  const movingBlocks = document.querySelectorAll('.moving'); // moving 클래스를 가진 모든 엘리먼트
  
  movingBlocks.forEach(moving => {
    moving.style.outline = 'none';          // 블럭 이동 시 기존 outling 안보이게 설정
    moving.classList.remove(type, 'moving') // moving을 가진 클래스를 삭제
  })
  
  BLOCKS[type][direction].some(block => {  // 반복문 돌려서 각각의 클래스를 선택 후 그리기, 중간에 빈 값이 있으면 나머지 것들을 렌더링할 필요가 없음. forEach는 반복문이 중간에 멈출 수가 없음. 이럴 경우 some을 사용
    // 블록 위치 (좌표) 설정 
    const x = block[0] + left;
    const y = block[1] + top;
    const target = playground.childNodes[y]
    ? playground.childNodes[y].childNodes[0].childNodes[x]  // ul.li[y].ul[0].li[x]
    : null ;  
    const isAvailable = checkEmpty(target);

    if(isAvailable) {
      target.classList.add(type, "moving"); // 매트릭스에 클래스이름 추가, "moving"이라는 클래스도 추가해서 무빙을 가지고 있는 클래스만 이동가능 하도록 함 
      target.style.outline = '1px solid rgba(0, 0, 0, 0.5)';  
    } else {
      tempMovingItem = {...movingItem}
      setTimeout(() => {  // setTimeout을 하게 되면 함수가 다 실행 되고, 즉 이벤트 루프에 예약된 이벤트들이 다 실행이 된 후에 스택에 집어넣음 0초를 주더라도 함수 실행 후 이벤트 스택이 넘치는 것을 방지
        renderBlocks();       
        if (moveType === 'top') {
          seizeBlock();
        }
      }, 0)
      return true;
    }
  });
  // BLOCKS[type][direction].some를 정상적으로 실행 후 무빙아이템 업데이트
  movingItem.left = left;
  movingItem.top = top;
  movingItem.direction = direction;
}

function moveBlock(moveType, amount) {  // moveType은 렌더링을 할때 tempMovingItem을 통해서 하기 때문에 tempMovingItem을 바꿔주면 됨
  tempMovingItem[moveType] += amount;
  renderBlocks(moveType); // moveBlock이 됐을 때만 moveType을 인자로 넘겨줌
}

function checkEmpty(target) { // target을 한번 더 체크해주는 함수
  if(!target || target.classList.contains('seized')) {  // classList.contains()는 클래스를 가지고 있는지 포함하고 있는지 없는지 확인해주는 메서드
    return false;
  }
  return true;
}

function seizeBlock() {
  const movingBlocks = document.querySelectorAll('.moving'); // moving 클래스를 가진 모든 엘리먼트
  movingBlocks.forEach(moving => {
    moving.classList.remove('moving') // moving을 가진 클래스를 삭제
    moving.classList.add('seized');
  })
  generateNewBlock();
}

function changeDirection() { // 블럭 회전
  const changeBlock = tempMovingItem.direction;
  changeBlock === 3 ? tempMovingItem.direction = 0 : tempMovingItem.direction += 1;
  // 아래 코드를 삼항연산자로 간결하고 표현하기
  // tempMovingItem.direction += 1;
  // if (tempMovingItem.direction === 4) {
  //   tempMovingItem.direction = 0;
  // }
  renderBlocks()
}

function generateNewBlock() { // 블럭 시즈 후 무빙아이템 프로퍼티들 초기화 후 새로운 블럭 생성
  movingItem.top = 0;
  movingItem.left = 3;
  movingItem.direction = 0;
  tempMovingItem = {...movingItem} 
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
      break;
    case 38: {  // 윗 방향키
      changeDirection();
      break;
    }
    default: 
      break;
  }
});






