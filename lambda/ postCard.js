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
    const id = event.requestContext.requestId; //cloudwatch 로그에 있는 request event 객체에 있는 정보 사용
    const body = JSON.parse(event.body);

    var params = {
      TableName: tableName,
      Item: {
        id: id,
        title: body.title,
        category: body.category,
      },
    };

    await documentClient.put(params).promise();

    //api게이트웨이와 통합하기 위한 필수 속성들은 statusCode, body
    response = {
      statusCode: 201,
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
