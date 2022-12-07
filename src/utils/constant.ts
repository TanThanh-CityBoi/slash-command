const ROLE = {
  ADMIN: 'ADMIN',
  USER: 'USER',
};

const COMMANDS = [
  //tnt
  { cmd: '/tnt', prm: [''], role: ROLE.USER },
  { cmd: '/tnt', prm: ['-w'], role: ROLE.USER },

  // user
  { cmd: '/user', prm: [''], role: ROLE.USER },
  { cmd: '/user', prm: ['list'], role: ROLE.USER },
  { cmd: '/user', prm: ['-l'], role: ROLE.USER },
  { cmd: '/user', prm: ['add', '<@user_id|user_name>'], role: ROLE.ADMIN },
  { cmd: '/user', prm: ['-a', '<@user_id|user_name>'], role: ROLE.ADMIN },
  { cmd: '/user', prm: ['delete', '<@user_id|user_name>'], role: ROLE.ADMIN },
  { cmd: '/user', prm: ['-d', '<@user_id|user_name>'], role: ROLE.ADMIN },
  { cmd: '/user', prm: ['token', '<token>'], role: ROLE.USER },
  {
    cmd: '/user',
    prm: ['token', '<token>', '<@user_id|user_name>'],
    role: ROLE.ADMIN,
  },
  { cmd: '/user', prm: ['role', '<role>'], role: ROLE.ADMIN },

  //github
  { cmd: '/git', prm: [''], role: ROLE.USER },
];

export { COMMANDS, ROLE };
