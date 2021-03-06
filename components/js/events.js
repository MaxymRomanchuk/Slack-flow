let router = require('express').Router();
const requests = require('./requests');
const appHome = require('../json/appHome.json');
const db = require('./db');

function verifyURL(response, challenge) {
    response.type('application/x-www-form-urlencoded');
    response.send(challenge);
}

async function openAppHome(user_id, team_id, tab) {
    if(tab !== 'home') return;

    let user = await db.get(team_id, user_id);
    let workspace_token = user ? user.bot_access_token : 
                                 (await db.get(team_id)).bot_access_token;

    requests.viewPublish(user_id, appHome, workspace_token);
}

router.post('/', async (req, res, next) => {
    try {
        let body = req.body;
        if(body.type === 'url_verification') {
            verifyURL(res, body.challenge);
        } else if(body.event.type === 'app_home_opened'){
            openAppHome(body.event.user, body.team_id, body.event.tab);
        }
        res.status(200);
        res.end();
        
    } catch (error) {
        console.log(error);
    }
});

module.exports.eventRouter = router;