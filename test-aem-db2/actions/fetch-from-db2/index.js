const {Core} = require("@adobe/aio-sdk");
const ibmdb = require('ibm_db'),
    connStr = 'DATABASE=testdb;HOSTNAME=localhost;PORT=50000;PROTOCOL=TCPIP;UID=DB2INST1;PWD=GD1OJfLGG64HV2dtwK'

const {errorResponse, checkMissingRequestInputs, getBearerToken} = require("../utils");

const test_table_name = "db2inst1.test_svg_table";
const select_statement = "select * from " + test_table_name;

// main function that will be executed by Adobe I/O Runtime
async function main (params) {

    // create a Logger
    const logger = Core.Logger('main', {level: params.LOG_LEVEL || 'info'})
    try {
        logger.info('in fetch-from-db2 index.js file!, main action called');
        console.log('in fetch-from-db2 index.js file!, main action called');

        logger.info('we made it, again, that is awesome!!!!');
        console.log('we made it, again, that is awesome!!!!');

        // check for missing request input parameters and headers
        const requiredParams = []
        const requiredHeaders = ['Authorization']
        const errorMessage = checkMissingRequestInputs(params, requiredParams, requiredHeaders)
        if (errorMessage) {
            // return and log client errors
            return errorResponse(400, errorMessage, logger)
        }

        // extract the user Bearer token from the Authorization header
        //const token = getBearerToken(params)

        ibmdb.open(connStr, function (err, connection) {
            console.log('entered ibmdb.open');
            let response = {};

            connection.query(select_statement, function (err1, rows) {
                console.log('entered connection.query');
                if (err1) {
                    logger.info("err1" + err1);
                } else {
                    console.log('entered else, NO errors :-)');
                    rows.forEach( (row) => {
                        response.push(`id: row.ID, value: row.SVG`);
                        logger.info('id: ' + row.ID + ', col2: ' + row.SVG);
                    });
                }
                connection.close(function(err2) {
                    if (err2) {
                        logger.info(err2);
                    }
                });
            });
            console.log('before returning response');
            return response;

        });
    } catch (error) {
        // log any server errors
        console.log('general catch, error...' + error)
        logger.error(error)
        // return with 500
        return errorResponse(500, 'fetch-from-db2 server error', logger)
    }
}

exports.main = main