import { isEmpty, isObject, isArray, isString } from 'lodash';

export function slackResponse(dataRes: any) {
  const { req, body, response } = dataRes;
  const { status, message, errors, data } = response;
  const { user_id, user_name, command, text } = body;
  const timeStamp = req.headers['x-slack-request-timestamp'];

  const headerContent =
    `*Command*: ${command} ${text} \n` +
    `*CreatedBy*: <@${user_id}|${user_name}> \n` +
    `*Time*: <!date^${timeStamp}^ {date_num} {time_secs}| 2014-02-18 6:39:42 AM PST>`;
  const headerTemplate = {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: headerContent,
    },
  };

  const divider = {
    type: 'divider',
  };

  let bodyContent = `:star: :star: :star: \n \n`;
  if (status != 200) {
    bodyContent +=
      `*Status*: \`${status}\` \n` +
      `*Message*: \`${message}\` \n` +
      `*Errors*: \`${JSON.stringify(errors) || null}\``;
  }

  if (!isEmpty(data)) {
    if (isObject(data)) {
      for (const [key, value] of Object.entries(data)) {
        bodyContent += `*${key}*: ${value}`;
      }
    }

    if (isArray(data)) {
      const result = data.map((val) => {
        `*${val} \n`;
      });
      bodyContent += result;
    }

    if (isString(data)) {
      bodyContent += data;
    }
  }

  const bodyTemplate = {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: bodyContent,
    },
  };

  return {
    blocks: [headerTemplate, divider, bodyTemplate],
  };
}
