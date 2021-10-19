

/**
 * 테트리스 보드는 셀들로 구성되어 있고, 각 셀은 채워져 있거나 그렇지 않을 수 있다.
비어있는 셀은 0으로 표시하고 색상은 1-7을 사용해 표시하며 초기 보드의 모든 셀은 0 이다.
게임 보드는 행렬로 이뤄져있고 행을 나타내기 위해 숫자형의 배열을 사용한다.
 */

class Board { 
  grid;
  // 보드 초기화 
  reset() {
    this.grid = this.getEmptyBorad();
  }
  // 행(20) 만큼 length를 가진 객체를 생성, row를 0으로 배열로 만들기
  getEmptyBorad() {
    return Array.from(
      {length: ROWS}, () => Array(COLS).fill(0)
    );
  }
}