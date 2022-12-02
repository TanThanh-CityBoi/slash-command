export function slackResponse(data: any) {
  const { req, body, response } = data;
  const { status, message, errors } = response;
  const { user_id, user_name, command, text } = body;
  const timeStamp = req.headers['x-slack-request-timestamp'];

  const headerContent =
    `*Command*: ${command} ${text} \n` +
    `*CreatedBy*: <@${user_id}|${user_name}> \n` +
    `*Time*: <!date^${timeStamp}^ {date_num} {time_secs}| 2014-02-18 6:39:42 AM PST>`;

  const bodyContent =
    `:star: :star: :star: \n \n ` +
    `*Status*: \`${status}\` \n` +
    `*Message*: \`${message}\` \n` +
    `*Data*: \`${JSON.stringify(response.data) || null}\` \n` +
    `*Errors*: \`${errors || null}\``;

  return {
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: headerContent,
        },
      },
      {
        type: 'divider',
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: bodyContent,
        },
      },
    ],
  };
}
