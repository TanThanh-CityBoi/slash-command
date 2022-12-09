import { isEmpty, isObject, isArray } from 'lodash';

const _getBodyContent = (response: any) => {
  const { status, message, errors, data } = response;
  let bodyContent = ':star: :star: :star: \n \n';
  if (status != 200) {
    bodyContent +=
      `*Status*: \`${status}\` \n` +
      `*Message*: \`${message}\` \n` +
      `*Errors*: \`${JSON.stringify(errors)}\``;
    return bodyContent;
  }
  if (!isEmpty(data) && isObject(data)) {
    const isArr = isArray(data);
    for (const [key, value] of Object.entries(data)) {
      bodyContent += `*${!isArr ? `${key} : ` : '• '}* \`${value}\` \n`;
    }
    return bodyContent;
  }
  if (isEmpty(data)) {
    return (bodyContent += `*Message:* \`${message}\``);
  }
  return (bodyContent += data);
};

export function slackResponse(data: any) {
  const { req, body, response } = data;
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
  const divider = { type: 'divider' };
  const bodyContent = _getBodyContent(response);
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
