import { promises as fs } from 'fs'
import { parse } from 'yaml'
import { yellow, red, gray, green } from 'chalk'
import { compile } from 'json-schema-to-typescript'
import { sep } from 'path'
import { log } from './typeschema'
const pascalcase: (str: string) => string = require('pascalcase')
const fileType = (file: string): 'yml' | 'json' => {
  const type = file.split('.').pop()
  if (type !== 'yml' && type !== 'json') {
    throw new Error('File type must be yml or json')
  }
  return type
}
export const changeEnding = (file: string, ending: string) =>
  [...file.split('.').slice(0, -1), ending].join('.')

export const generateValidator = ({ throwError }: { throwError: boolean }) => async (
  file: string
) => {
  try {
    const content = (await fs.readFile(file)).toString()
    const type = fileType(file)
    let parsedContent: { title: string } = { title: '' }
    if (type === 'json') {
      parsedContent = JSON.parse(content)
    } else {
      parsedContent = parse(content)
    }
    const title = pascalcase(parsedContent.title)
    if (!title) throw new Error(`file: ${file}, has no title property`)
    console.log(file, `---\n${JSON.stringify(parsedContent, null, 2)}\n---`)
    const ts = await compile(parsedContent, parsedContent.title, {
      bannerComment: ''
    })
    const validateCode = `
/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript, and typeschema.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

import Ajv from 'ajv'
const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
const validate = ajv.compile(${JSON.stringify(parsedContent, null, 2)});

export const validate${title} = (data: any): Ajv.ErrorObject[] => {
  const valid = validate(data)
  if(valid) return []
  return validate.errors;
}

export const is${title} = (data: any): data is ${title} => {
  const errors = validate${title}(data)
  return !!errors.length;
}`
    const output = [validateCode, ts].join('\n\n')
    log(green(`Compiled: ${title}`), gray(changeEnding(file, 'ts')), `\n---\n${output}\n---\n`)
    await fs.writeFile(changeEnding(file, 'ts'), output)
  } catch (e) {
    if (throwError) throw e
    console.error(yellow('Error compiling:'), gray(file), red(e.message))
  }
}
