const { createLogger, transports, format } = require('winston');

require('winston-mongodb');
const logger = createLogger({
    transports: [
        new transports.MongoDB({
            level: 'error',
            db: "mongodb+srv://trupti:" +
                process.env.MONGO_ATLAS_PW +
                "@cluster0-uewqf.mongodb.net/test?retryWrites=true&w=majority",
            options: { useUnifiedTopology: true },
            collection: 'logs',
            format: format.combine(format.timestamp(), format.json())
        })
    ]
})

module.exports = logger;