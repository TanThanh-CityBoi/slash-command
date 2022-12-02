export function badRequestRes(data: any) {
  const { req, body } = data;
  const { status, message, errors } = req.user;
  const { user_id, user_name, command, text } = body;
  const timeStamp = req.headers['x-slack-request-timestamp'];

  const headerContent = `
    *Command*: ${command} ${text}
    *CreatedBy*: <@${user_id}|${user_name}>
    *Time*: <!date^${timeStamp}^ {date_num} {time_secs}| 2014-02-18 6:39:42 AM PST>`;

  const bodyContent = `
    :star: :star: :star:
    *Status*: \`${status}\`
    *Message*: \`${message}\`
    *Errors*: \`${errors || null}\``;

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
