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
    const id = event.pathParameters.id;
    const body = JSON.parse(event.body);

    // var params = {
    //   TableName: tableName,
    //   Key: { id: id }, //이 id값을 가진 데이터를 찾고 아래 expression 수행
    //   UpdateExpression: "set #a = :x + :y", //alias 통해 어떤 값을 뭘로 업데이트할지..
    //   //   ConditionExpression: "#a < :MAX", //조건문
    //   ExpressionAttributeNames: { "#a": "Sum" }, //Sum 에 x+y 합인 65를 저장
    //   ExpressionAttributeValues: {
    //     ":x": 20,
    //     ":y": 45,
    //     ":MAX": 100,
    //   },
    // };

    var params = {
      TableName: tableName,
      Key: { id: id },
      UpdateExpression: "set #c = :c, #t = :t",
      ExpressionAttributeNames: { "#c": "category", "#t": "title" },
      ExpressionAttributeValues: {
        ":c": body.category,
        ":t": body.title,
      },
    };

    await documentClient.update(params).promise();

    //api게이트웨이와 통합하기 위한 필수 속성들은 statusCode, body
    response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ id: id }),
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
