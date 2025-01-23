const cron = require('cron');
const https = require('https');

const url= `https://studynotion-zfck.onrender.com/api/v1/course/getallcategories`;
const job = new cron.CronJob('*/14 * * * *',function(){
    ('restarting server');
    https.get(url,(res)=>{
        if(res.statusCode === 200){
            ('Server Restarted');
        }
        else{
            console.error('Failed to start server');
        }
    }).on('error',(err)=>{
        ('Error')
    })
})

module.exports = job;