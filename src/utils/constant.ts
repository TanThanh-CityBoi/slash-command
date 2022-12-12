const ROLE = {
  ADMIN: 'admin',
  USER: 'user',
};

const COMMANDS = {
  _TNT: [
    { cmd: '/tnt', prm: [''], role: ROLE.USER },
    { cmd: '/tnt', prm: ['w'], role: ROLE.USER },
    { cmd: '/tnt', prm: ['ag', '<github_owner>'], role: ROLE.ADMIN },
    { cmd: '/tnt', prm: ['dg', '<github_owner>'], role: ROLE.ADMIN },
    { cmd: '/tnt', prm: ['df', '<github_owner>'], role: ROLE.ADMIN },
  ],

  _USER: [
    { cmd: '/user', prm: [''], role: ROLE.USER },
    { cmd: '/user', prm: ['list'], role: ROLE.USER },
    { cmd: '/user', prm: ['l'], role: ROLE.USER },
    { cmd: '/user', prm: ['add', '<@user_id|user_name>'], role: ROLE.ADMIN },
    { cmd: '/user', prm: ['a', '<@user_id|user_name>'], role: ROLE.ADMIN },
    { cmd: '/user', prm: ['delete', '<@user_id|user_name>'], role: ROLE.ADMIN },
    { cmd: '/user', prm: ['d', '<@user_id|user_name>'], role: ROLE.ADMIN },
    { cmd: '/user', prm: ['token', '<token>'], role: ROLE.USER },
    {
      cmd: '/user',
      prm: ['token', '<token>', '<@user_id|user_name>'],
      role: ROLE.ADMIN,
    },
    {
      cmd: '/user',
      prm: ['role', '<role>', '<@user_id|user_name>'],
      role: ROLE.ADMIN,
    },
  ],

  _GITHUB: [
    { cmd: '/git', prm: [''], role: ROLE.USER },
    { cmd: '/git', prm: ['lb', '<repo>'], role: ROLE.USER },
    {
      cmd: '/git',
      prm: ['b', '<new_branch>', '<old_branch>', '<repo>'],
      role: ROLE.USER,
    },
    { cmd: '/git', prm: ['d', '<branch>', '<repo>'], role: ROLE.USER },
    {
      cmd: '/git',
      prm: ['p', '<from_branch>', '<to_branch>', '<repo>'],
      role: ROLE.USER,
    },
    {
      cmd: '/git',
      prm: ['m', '<pull_number>', '<repo>'],
      role: ROLE.USER,
    },
    { cmd: '/git', prm: ['lb', '<repo>', '<oganization>'], role: ROLE.USER },
    {
      cmd: '/git',
      prm: ['b', '<new_branch>', '<old_branch>', '<repo>', '<oganization>'],
      role: ROLE.USER,
    },
    {
      cmd: '/git',
      prm: ['d', '<branch>', '<repo>', '<oganization>'],
      role: ROLE.USER,
    },
    {
      cmd: '/git',
      prm: ['p', '<from_branch>', '<to_branch>', '<repo>', '<oganization>'],
      role: ROLE.USER,
    },
    {
      cmd: '/git',
      prm: ['m', '<pull_number>', '<repo>', '<oganization>'],
      role: ROLE.USER,
    },
  ],
};

export { COMMANDS, ROLE };
