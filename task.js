let axios = require("axios");

async function getTask(user_id, reference) {
  try {
    let res = await axios.get(
      `https://api.onetime.dog/tasks?user_id=${user_id}&reference=${reference}`
    );

    return res.data;
  } catch (err) {
    return console.log(err);
  }
}

async function verifyTask(user_id, reference) {
  try {
    let task = await getTask(user_id, reference);
    for (let slug of task) {
      let config = {
        url: `https://api.onetime.dog/tasks/verify?task=${slug.slug}&user_id=${user_id}&reference=${reference}`,
        method: "POST",
        headers: {
          accept: "application/json",
          "accept-language": "en-US,en;q=0.9",
          "cache-control": "no-cache",
          "content-type": "text/plain;charset=UTF-8",
          pragma: "no-cache",
          priority: "u=1, i",
          "sec-ch-ua":
            '"Not/A)Brand";v="8", "Chromium";v="126", "Microsoft Edge";v="126", "Microsoft Edge WebView2";v="126"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
          Referer: "https://onetime.dog/",
          "Referrer-Policy": "strict-origin-when-cross-origin",
        },
      };

      if (slug.slug != "invite-frens") {
        // subscribe-dogs;

        let response = await axios(config);
        if (response.data.success) {
          console.log("Completed task " + slug.slug);
        } else {
          console.log(slug.slug, response.data.error_code);
        }
        delay(5);
        let total = await getRewardsUser(user_id);
        console.log("Balance: " + total);
      }
    }
  } catch (err) {
    return console.log(err);
  }
}

async function delay(delays = 0) {
  return await new Promise((resolve) => setTimeout(resolve, delays * 1000));
}

async function getRewardsUser(user_id) {
  try {
    let res = await axios.get(
      `https://api.onetime.dog/rewards?user_id=${user_id}`
    );
    return res.data.total;
  } catch (err) {
    return console.log(err.message);
  }
}

verifyTask("user_id", "reference");
