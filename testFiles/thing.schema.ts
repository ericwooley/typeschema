
/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript, and typeschemagen.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

import Ajv from 'ajv'
const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
const validate = ajv.compile({
  "title": "Example Schema",
  "type": "object",
  "properties": {
    "firstName": {
      "type": "string"
    },
    "lastName": {
      "type": "string"
    },
    "age": {
      "description": "Age in years",
      "type": "integer",
      "minimum": 0
    },
    "hairColor": {
      "enum": [
        "black",
        "brown",
        "blue"
      ],
      "type": "string"
    }
  },
  "additionalProperties": false,
  "required": [
    "firstName",
    "lastName"
  ]
});

export const validateExampleSchema = (data: any): Ajv.ErrorObject[] => {
  const valid = validate(data)
  if(valid) return []
  return validate.errors;
}

export const isExampleSchema = (data: any): data is ExampleSchema => {
  const errors = validateExampleSchema(data)
  return !!errors.length;
}

export interface ExampleSchema {
  firstName: string;
  lastName: string;
  /**
   * Age in years
   */
  age?: number;
  hairColor?: "black" | "brown" | "blue";
}
