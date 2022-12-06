const COMMANDS = {
  _USER: {
    command: '/user',
    params: [
      'NULL_PARAM',
      //
      'list',
      '-l',
      //
      'add',
      '-a',
      //
      'delete',
      '-d',
      //
      'token',
      'role',
    ],
  },
  _GITHUB: {
    command: '/git',
    params: [
      'NULL_PARAM',
      //
      'list',
      '-l',
    ],
  },
  _TNT: {
    command: '/tnt',
    params: ['NULL_PARAM'],
  },
};

const ROLE = {
  ADMIN: 'ADMIN',
  USER: 'USER',
};

export { COMMANDS, ROLE };
