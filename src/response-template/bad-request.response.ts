export function badRequestRes(data: any) {
  const { req, body } = data;
  const { status, message, errors } = req.user;
  const { user_id, user_name, command, text } = body;
  const timeStamp = req.headers['x-slack-request-timestamp'];

  return {
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: ` *Command*: ${command} ${text} \n 
          *CreatedBy*: <@${user_id}|${user_name}> \n 
          *Time*: <!date^${timeStamp}^ {date_num} {time_secs}| 2014-02-18 6:39:42 AM PST>
          `,
        },
      },
      {
        type: 'divider',
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `:star: :star: :star: \n
                *Status:* \`${status}\`  
                *Message:* \`${message}\` 
                *Errors:* \`${errors || null}\`
                `,
        },
      },
    ],
  };
}
