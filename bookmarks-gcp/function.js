const axios = require('axios');

exports.tweetmarks = (req, res) => {

    const code = req.query.code || req.body.code
    const op = req.query.op || req.query.op

    const getAuthUser = async() => {
        const config = {
            method: 'get',
            url: 'https://api.twitter.com/2/users/me?user.fields=description,profile_image_url,public_metrics,url',
            headers: {
                'Authorization': 'Bearer ' + code
            }
        };
        try {
            const userData = await axios(config);
            console.log(userData.data); //just checking if works
            res.send(userData.data)
        } catch (err) {
            console.error(err)
            res.send(err)
        }

    }

    // time converter is not implemented yet
    const getCreatedTimestamp = function(isoDateTime) {
        const time = new Date(isoDateTime).toLocaleTimeString('en', { timeStyle: 'short', hour12: false, timeZone: 'UTC' });

    }

    const configFirst = {
        method: 'get',
        url: 'https://api.twitter.com/2/users/60002257/bookmarks?tweet.fields=author_id,context_annotations,created_at,public_metrics&expansions=author_id&user.fields=username,public_metrics,url,profile_image_url',
        headers: {
            'Authorization': 'Bearer ' + code
        }
    };

    const marks = []
    const getMarks = async(config) => {

        try {
            const markData = await axios(config);
            //console.log(markData.data); //just checking if works
            var marksCount = markData.data.meta.result_count

            for (var i = 0; i < marksCount; i++) {
                var obj = new Object()
                obj.author_id = markData.data.data[i].author_id
                obj.id = markData.data.data[i].id
                obj.text = markData.data.data[i].text
                var tmp = []
                if (markData.data.data[i].context_annotations != undefined) {
                    for (var k = 0; k < markData.data.data[i].context_annotations.length; k++) {
                        if (tmp.indexOf(markData.data.data[i].context_annotations[k].entity.name) === -1) {
                            tmp.push(markData.data.data[i].context_annotations[k].entity.name)
                        }
                    }
                    obj.annotations = tmp
                }
                //obj.created_at = markData.data.data[i].created_at
                obj.retweet_count = markData.data.data[i].public_metrics.retweet_count
                obj.reply_count = markData.data.data[i].public_metrics.reply_count
                obj.like_count = markData.data.data[i].public_metrics.like_count
                obj.quote_count = markData.data.data[i].public_metrics.quote_count
                for (var j = 0; j < markData.data.includes.users.length; j++) {
                    if (markData.data.data[i].author_id === markData.data.includes.users[j].id) {
                        obj.profile_image_url = markData.data.includes.users[j].profile_image_url
                        obj.name = markData.data.includes.users[j].name
                        obj.username = markData.data.includes.users[j].username
                    }
                }
                marks.push(obj)
            }

            //console.log(marks)
            if (markData.data.meta.next_token) {

                const configPagination = {
                    method: 'get',
                    url: `https://api.twitter.com/2/users/60002257/bookmarks?pagination_token=${markData.data.meta.next_token}&tweet.fields=author_id,context_annotations,created_at,public_metrics&expansions=author_id&user.fields=username,public_metrics,url,profile_image_url`,
                    headers: {
                        'Authorization': 'Bearer ' + code
                    }
                };

                return getMarks(configPagination)
            } else return marks

        } catch (err) {
            console.error(err)
            res.send(err)
        }

    }

    if (op === '0') {
        getAuthUser();
    } else if (op === '1') {
        getMarks(configFirst).then(() => {
            //console.log(marks)
            console.log('Bookmarks retrieved : ' + marks.length)
            res.send(marks)
        })

    } else {
        var msg = "Not a valid input"
        res.status(400).send(msg)
    }

};