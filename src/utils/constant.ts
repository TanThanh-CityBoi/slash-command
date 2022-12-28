const ROLE = {
  ROOT: 'root',
  ADMIN: 'admin',
  USER: 'user',
};
const ROLE_PREORITY = {
  ROOT: 1,
  ADMIN: 2,
  USER: 3,
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
    { cmd: '/user', prm: ['list'], role: ROLE.ADMIN },
    { cmd: '/user', prm: ['l'], role: ROLE.ADMIN },
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

    // list branch
    { cmd: '/git', prm: ['lb', '<repo>'], role: ROLE.USER },
    { cmd: '/git', prm: ['lb', '<repo>', '<oganization>'], role: ROLE.USER },

    // new branch
    {
      cmd: '/git',
      prm: ['b', '<repo>', '<new_branch>'],
      role: ROLE.USER,
    },
    {
      cmd: '/git',
      prm: ['b', '<repo>', '<new_branch>', '<old_branch>'],
      role: ROLE.USER,
    },
    {
      cmd: '/git',
      prm: ['b', '<repo>', '<new_branch>', '<old_branch>', '<oganization>'],
      role: ROLE.USER,
    },

    //delete branch
    { cmd: '/git', prm: ['d', '<repo>', '<branch>'], role: ROLE.USER },
    {
      cmd: '/git',
      prm: ['d', '<repo>', '<branch>', '<oganization>'],
      role: ROLE.USER,
    },

    // pull request
    {
      cmd: '/git',
      prm: ['p', '<repo>', '<from_branch>'],
      role: ROLE.USER,
    },
    {
      cmd: '/git',
      prm: ['p', '<repo>', '<from_branch>', '<to_branch>'],
      role: ROLE.USER,
    },
    {
      cmd: '/git',
      prm: ['p', '<repo>', '<from_branch>', '<to_branch>', '<oganization>'],
      role: ROLE.USER,
    },

    // merge pull request
    {
      cmd: '/git',
      prm: ['m', '<repo>', '<pull_number>'],
      role: ROLE.USER,
    },
    {
      cmd: '/git',
      prm: ['m', '<repo>', '<pull_number>', '<oganization>'],
      role: ROLE.USER,
    },

    // reset branch
    {
      cmd: '/git',
      prm: ['rb', '<repo>', '<branch>'],
      role: ROLE.USER,
    },
    {
      cmd: '/git',
      prm: ['rb', '<repo>', '<branch>', '<base_branch>'],
      role: ROLE.USER,
    },
    {
      cmd: '/git',
      prm: ['rb', '<repo>', '<branch>', '<base_branch>', '<oganization>'],
      role: ROLE.USER,
    },
  ],
};

const GH_API = {
  GET_LIST_BRANCHES: 'GET /repos/{owner}/{repo}/branches',
  GET_BRANCH: 'GET /repos/{owner}/{repo}/branches/{branch}',
  CREATE_BRANCH: 'POST /repos/{owner}/{repo}/git/refs',
  CREATE_PULL_REQUEST: 'POST /repos/{owner}/{repo}/pulls',
  MERGE_PULL_REQUEST: 'PUT /repos/{owner}/{repo}/pulls/{pull_number}/merge',
  DELETE_BRANCH: 'DELETE /repos/{owner}/{repo}/git/refs/{ref}',
};

export { COMMANDS, ROLE, GH_API, ROLE_PREORITY };
