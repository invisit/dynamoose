import "source-map-support/register";

import * as ModelNS from "./Model";
import {Model, ModelOptionsOptional} from "./Model";
import { Schema, SchemaDefinition, SchemaSettings, toDynamoDefinition } from "./Schema"
import {Condition} from "./Condition";
import transaction from "./Transaction";
import aws = require("./aws");
import Internal = require("./Internal");
import utils = require("./utils");
import logger = require("./logger");
import {Document, AnyDocument} from "./Document";
import ModelStore = require("./ModelStore");
import {ModelType} from "./General";

const model = <T extends Document = AnyDocument>(
	name:string,
	schema?:Schema | SchemaDefinition | (Schema | SchemaDefinition)[],
	options:ModelOptionsOptional = {},
	schemaSettings: Partial<SchemaSettings> = {}
):ModelType<T> => {
	let model:Model<T>;
	let storedSchema:Model<T>;
	if (name) {
		storedSchema = ModelStore<T>(name);
	}
	// TODO: this is something I'd like to do. But is a breaking change. Need to enable this and uncomment it in a breaking release. Also will need to fix the tests as well.
	/* if (schema && storedSchema) {
    throw new CustomError.InvalidParameter(`Model with name ${name} has already been registered.`);
  } else */
	if (!schema && storedSchema) {
		model = storedSchema;
	} else {
		model = new Model(name, schema, options, schemaSettings);
	}
	const returnObject:any = model.Document;
	const keys = utils.array_flatten([
		Object.keys(model),
		Object.keys(Object.getPrototypeOf(model)),
		Object.getOwnPropertyNames(Object.getPrototypeOf(model))
	]).filter((key) => !["constructor", "name"].includes(key));
	keys.forEach((key) => {
		if (typeof model[key] === "object") {
			const main = (key:string):void => {
				utils.object.set(returnObject, key, {});
				const value = utils.object.get(model as any, key);
				if (value === null || value.constructor !== Object && value.constructor !== Array) {
					utils.object.set(returnObject, key, value);
				} else {
					Object.keys(value).forEach((subKey):void => {
						const newKey = `${key}.${subKey}`;
						const subValue:any = utils.object.get(model as any, newKey);
						if (typeof subValue === "object") {
							main(newKey);
						} else {
							utils.object.set(returnObject, newKey, typeof subValue === "function" ? subValue.bind(model) : subValue);
						}
					});
				}
			};
			main(key);
		} else if (typeof model[key] === "function") {
			returnObject[key] = model[key].bind(model);
		} else {
			returnObject[key] = model[key];
		}
	});
	return returnObject as any;
};
model.defaults = {
	...require("./Model/defaults").custom
};

const UNDEFINED = Internal.Public.undefined;
const THIS = Internal.Public.this;

export = {
	"Model":ModelNS,
	model,
	toDynamoDefinition,
	Schema,
	Condition,
	transaction,
	aws,
	logger,
	UNDEFINED,
	THIS
};
