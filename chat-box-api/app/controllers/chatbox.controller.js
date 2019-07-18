// Configuring the database
const dbConfig = require('../../config/database.config.js');
const sql = require("mssql/msnodesqlv8");

exports.chat = async(req, res) => {
    let message = req.body.message

    chatbox(dbConfig.connectionString, message)
    .then((result) => {
        let { traLoi } = result.output
        res.send({ traLoi })
    })
    .catch((err) => {
        console.log(err)
        res.send({ traLoi: "" })
    })
};

async function chatbox(connectionString, message) {
    return new Promise(async(resolve, reject) => {
        await sql.connect(connectionString)
        const request = new sql.Request()
        request.input('hoi', sql.NVarChar(sql.MAX), message)
        request.output('traLoi', sql.NVarChar(sql.MAX))
        request.execute('PhanHoi', (err, result) => {
            if (err) {
                sql.close()
                reject(err);
            }
            sql.close()
            resolve(result); 
        })
    })
}