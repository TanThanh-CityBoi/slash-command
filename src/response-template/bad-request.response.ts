import { time } from 'console';

export function badRequestRes(data: any) {
  const { req, body } = data;
  const { status, message, errors } = req.user;
  const { user_id, command, text } = body;
  return {
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `UserID: ${user_id}`,
          emoji: true,
        },
      },
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `Command: ${command} ${text}`,
          emoji: true,
        },
      },
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `Time: ${time}`,
          emoji: true,
        },
      },
      {
        type: 'divider',
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: ':ghost: :ghost: :ghost:',
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'plain_text',
            text: `Status: ${status}`,
            emoji: true,
          },
          {
            type: 'plain_text',
            text: `Status: ${message}`,
            emoji: true,
          },
          {
            type: 'plain_text',
            text: `Errors: ${errors}`,
            emoji: true,
          },
        ],
      },
    ],
  };
}
