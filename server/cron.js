const cron = require('cron');
const https = require('https');

const url= `https://studynotion-zfck.onrender.com/api/v1/course/getallcategories`;
const job = new cron.CronJob('*/12 * * * *',function(){
    https.get(url,(res)=>{
        if(res.statusCode === 200){
            console.log('Server Restarted');
        }
        else{
            console.error('Failed to start server');
        }
    }).on('error',(err)=>{
    })
})

module.exports = job;