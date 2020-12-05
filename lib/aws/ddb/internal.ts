import * as ddb from "./index";
import log = require("../../logger/emitter");
import {DynamoDB} from "aws-sdk";

// Table
function main (method: "describeTable", params: DynamoDB.DescribeTableInput): Promise<DynamoDB.DescribeTableOutput>;
function main (method: "createTable", params: DynamoDB.CreateTableInput): Promise<DynamoDB.CreateTableOutput>;
function main (method: "updateTable", params: DynamoDB.UpdateTableInput): Promise<DynamoDB.UpdateTableOutput>;
function main (method: "updateTimeToLive", params: DynamoDB.UpdateTimeToLiveInput): Promise<DynamoDB.UpdateTimeToLiveOutput>;
function main (method: "describeTimeToLive", params: DynamoDB.DescribeTimeToLiveInput): Promise<DynamoDB.DescribeTimeToLiveOutput>;

// Item
function main (method: "getItem", params: DynamoDB.GetItemInput): Promise<DynamoDB.GetItemOutput>;
function main (method: "deleteItem", params: DynamoDB.DeleteItemInput): Promise<DynamoDB.DeleteItemOutput>;
function main (method: "updateItem", params: DynamoDB.UpdateItemInput): Promise<DynamoDB.UpdateItemOutput>;
function main (method: "putItem", params: DynamoDB.PutItemInput): Promise<DynamoDB.PutItemOutput>;
function main (method: "batchWriteItem", params: DynamoDB.BatchWriteItemInput): Promise<DynamoDB.BatchWriteItemOutput>;
function main (method: "batchGetItem", params: DynamoDB.BatchGetItemInput): Promise<DynamoDB.BatchGetItemOutput>;

// Document Retriever
function main (method: "query", params: DynamoDB.QueryInput): Promise<DynamoDB.QueryOutput>;
function main (method: "scan", params: DynamoDB.ScanInput): Promise<DynamoDB.ScanOutput>;

// Transaction
function main (method: "transactGetItems", params: DynamoDB.TransactGetItemsInput): Promise<DynamoDB.TransactGetItemsOutput>;
function main (method: "transactWriteItems", params: DynamoDB.TransactWriteItemsInput): Promise<DynamoDB.TransactWriteItemsOutput>;

function main (method: string, params: any): Promise<any> {
	log({"level": "debug", "category": `aws:dynamodb:${method}:request`, "message": JSON.stringify(params, null, 4), "payload": {"request": params}});
	return ddb()[method](params).promise()
		.then(result => {
			log({"level": "debug", "category": `aws:dynamodb:${method}:response`, "message": typeof result === "undefined" ? "undefined" : JSON.stringify(result, null, 4), "payload": {"response": result}});
			return result
		})
	
		
	
}

export = main;
