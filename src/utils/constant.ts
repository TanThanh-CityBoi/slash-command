const COMMANDS = [
  // user
  { cmd: '/user', prm: [''], role: 'ADMIN' },
  { cmd: '/user', prm: ['list'], role: 'USER' },
  { cmd: '/user', prm: ['-l'], role: 'USER' },
  { cmd: '/user', prm: ['add', '<@user_id|user_name>'], role: 'ADMIN' },
  { cmd: '/user', prm: ['-a', '<@user_id|user_name>'], role: 'ADMIN' },
  { cmd: '/user', prm: ['delete', '<@user_id|user_name>'], role: 'ADMIN' },
  { cmd: '/user', prm: ['-d', '<@user_id|user_name>'], role: 'ADMIN' },
  { cmd: '/user', prm: ['token', '<token>'], role: 'USER' },
  {
    cmd: '/user',
    prm: ['token', '<token>', '<@user_id|user_name>'],
    role: 'ADMIN',
  },
  { cmd: '/user', prm: ['role', '<role>'], role: 'ADMIN' },

  //github
];

const ROLE = {
  ADMIN: 'ADMIN',
  USER: 'USER',
};

export { COMMANDS, ROLE };
