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
    const id = event.pathParameters.id; //cloudwatch 로그에 있는 request event 객체에 있는 정보 사용

    var params = {
      TableName: tableName,
      Key: {
        id: id,
      },
    };

    await documentClient.delete(params).promise();

    response = {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
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
