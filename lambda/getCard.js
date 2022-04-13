var AWS = require("aws-sdk");
var documentClient = new AWS.DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
});

const tableName = "Cards";

exports.handler = async (event) => {
  console.log("Received: " + JSON.stringify(event, null, 2));
  // TODO implement
  let response = "";

  try {
    var params = {
      TableName: tableName,
      //   FilterExpression: "Year = :this_year", //조회 조건 컬럼 지정
      //   ExpressionAttributeValues: { ":this_year": 2015 }, //컬럼값
    };

    const cards = await documentClient.scan(params).promise();
    //send 콜백 대신 thenable한 promise 사용 (then 사용 가능)
    //콜백 사용 시에는 .scan(params, 콜백함수) 형태
    //원래 promise 시 계속해서 then으로 다음 step 정의해줘야하나 es7 이후부터는 async await 지원
    //기다린 다음에 cards에 결과 저장

    //api게이트웨이와 통합하기 위한 필수 속성들은 statusCode, body
    response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(cards),
    };
  } catch (exception) {
    console.error(exception);
    response = {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ "Message : ": exception }),
    };
  }

  return response;
};
