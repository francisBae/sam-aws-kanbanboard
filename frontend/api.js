export default class APIHandler {
  constructor() {}

  // TODO: 전체 카드 객체 리스트 반환. 없으면 NULL
  async getCards() {
    const request = new APIRequest("GET", "/kanban/cards");
    const response = await APIProcessor(request);

    if (response !== "Error") {
      console.log(response);
      return response.Items;
    } else {
      return null;
    }
  }

  // TODO: 카드 객체 생성/추가 후 ID 반환
  async postCard(cardObj) {
    let id = Math.round(Math.random() * 10000).toString();
    this.dummyData.push({
      id: id,
      title: cardObj.title,
      category: cardObj.category,
    });

    // return Math.round(Math.random() * 10000).toString();
    console.log(this.dummyData);

    return id;
  }

  // TODO: ID로 카드 검색 후 내용,카테고리 수정
  async putCard(cardObj) {
    this.dummyData = this.dummyData.map((card) => {
      return card.id === cardObj.id
        ? { ...card, category: cardObj.category, title: cardObj.title }
        : card;
    });

    console.log(this.dummyData);
  }

  // TODO: ID로 카드 검색 후 삭제
  async deleteCard(id) {
    this.dummyData = this.dummyData.filter((card) => {
      return card.id !== id;
    });
    console.log(this.dummyData);
  }
}

const HOST = "https://5i6ywbsuw1.execute-api.ap-northeast-2.amazonaws.com/prod"; //aws의 API Gateway 서비스의 prod 에서 가져온다
//HOST를 상수화하여 필요에 따라 동적으로 dev 환경 등 테스트 가능

// TODO: API 요청 컨테이너. Method, Path, Body 속성
class APIRequest {
  constructor(method, path, body = null) {
    //body 없는 경우를 위해 초기값=null
    this.method = method;
    this.url = HOST + path;
    this.body = body;
  }
}

// TODO: API 호출 함수
const APIProcessor = async (request) => {
  try {
    const response = await fetch(request.url, {
      method: request.method, // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, cors, *same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      headers: {
        "Content-Type": "application/json", //HTTP 메시지(요청, 응답 모두)에 담겨 보내는 데이터의 형식 - HTTP 표준 스펙 따르는 브라우저와 웹서버는 Content-Type 헤더 기준으로 HTTP 메시지에 담긴 데이터를 분석 및 파싱
        //이 헤더가 없다면 받아들이는 쪽에서는 단순 텍스트 데이터로 인지하게 됨 (get 방식은 url에 key=value 형태가 포함되어 있어 content-type 없어도 웹서버가 유추 가능은 함)
        Accept: "application/json", //받고자 하는 데이터 타입
        //Accept는 브라우저(클라이언트)에서 웹서버로 요청 시 요청 메시지에 담기는 헤더이다.
        //Accept 헤더는 자신에게 이러한 데이터 타입만 허용하겠다는 뜻
      },
      body: request.body ? JSON.stringify(request.body) : null, // body data type must match "Content-Type" header (이 경우는 json타입)
    });
    console.log(response);

    switch (response.status) {
      case 200:
        return await response.json();
      default:
        console.error(await response.json());
        return "Error";
    }
  } catch (e) {
    console.error(e);
  }
  return "Error";
};
