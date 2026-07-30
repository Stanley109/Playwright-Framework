import fs from 'fs/promises'            //fs stands for file sync. a library in node js to interact with file and folders
import path, { dirname } from 'path'    //helps create file paths for convenience
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import toJsonSchema from 'to-json-schema'

const SCHEMA_BASE_PATH = './response-schemas'
//const ajv = new Ajv({ allErrors: true })                //create a new instance of Ajv for schema validation {allErrors: true} allows ajv to continue validate even when it encounters an error
const ajv = addFormats(new Ajv({ allErrors: true }))      //we need to wrap the Ajv instance inside the addFormats because Ajv library by default cannot read 'date-time' formats in schema validation       

export async function validateSchema(dirName:string, fileName:string, responseBody: object, createSchemaFlag: boolean = false){
    const schemaPath = path.join(SCHEMA_BASE_PATH, dirName, `${fileName}_schema.json`)

    //if create schema flag is set to true, generate a new schema
    if(createSchemaFlag){
        try{
            const generatedSchema = toJsonSchema(responseBody)
            await fs.mkdir(path.dirname(schemaPath),{recursive: true})
            await fs.writeFile(schemaPath, JSON.stringify(generatedSchema, null, 4))            
        } catch (error: any){
            throw new Error(`Failed to create schema file: ${error.message}`)
        }
    }

    // loads an existing schema and validate it against the response body
    const schema = await loadSchema(schemaPath)
    const validate = ajv.compile(schema)    //loads the schema then compile it to ready it for validation

    const valid = validate(responseBody)    //validate the response body against the schema
    if(!valid){
        throw new Error(
            `Schema validation failed ${fileName}_schema.json failed:\n`+
            `${JSON.stringify(validate.errors, null, 4)}\n\n`+
            `Actual response body: \n` +
            `${JSON.stringify(responseBody, null, 4)}`
        )
    }
}

async function loadSchema(schemaPath:string){
    try{
        const schemaContent = await fs.readFile(schemaPath, 'utf-8')    //returns a string in a json format
        return JSON.parse(schemaContent)                                //covert json string to json object then return it
    }
    catch(error:any){
        throw new Error(`Failed to read schema file: ${error.message}`)
    }
}