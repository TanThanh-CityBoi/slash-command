# Slash-command

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Description

- Slash command use for slack app

## Usage

- /user: manage users <br>
hint commands: /user

- /tnt: manage work space, github info <br>
hint commands: /tnt

- /git: github command (create branch, create pull request... ) <br>
hint commands: /git

- To use command /git run these commands before
```
/tnt gh <github owner>

/user token <github_token>

```

## Running the app

```bash
# development
$ yarn start:dev

# production mode
$ yarn pm2      // ec2
$ yarn start    // hosting by [render, heroku ...]
```

## Template .ENV

``` 
PORT=5000
SECRET_KEY_THANHCITYBOI=
BOT_TOKEN_THANHCITYBOI=
ROOT_USER_ID_THANHCITYBOI=
ROOT_USER_NAME_THANHCITYBOI=

// SECRET_KEY_{team_domain}={Signing Secret}
// ROOT_USER_ID_{team_domain}={userId in slack worksapce}
// ROOT_USER_NAME_{team_domain}={userName in slack worksapce}
// BOT_TOKEN_{team_domain}={Bot User OAuth Token}
```
## Template data

```
// account.json:
{
  "THANHCITYBOI": [ /// team domain slack app
    {
      "userId": "U04CN1Y68JJ",   // userId in slack workspace
      "userName": "tanthanhe",   // userName in slack workspace
      "githubToken": "ghp_xxx",
      "role": "root",  // [user, admin, ...]
      "createdAt": "2022-12-14 15:00:14",
      "createdBy": ""
    }
  ]
}

// github.json:
{
  "THANHCITYBOI": [ /// team domain slack app
    "tanthanh-cityboi"  /// github owner
  ]
}
```

## Create slack app

- Go to Slack api: https://api.slack.com/apps
- Create new app <br>
- Get app info in tab 'Basic Infomation'  <br>
![image](https://user-images.githubusercontent.com/71745181/209752494-0dcaba1d-d6d7-49e2-b405-93bcf56ff871.png)
- Get Bot token in tab 'OAuth & Permissions'  <br>
![image](https://user-images.githubusercontent.com/71745181/209752604-368866e6-de64-4873-986c-156b5825b4a2.png)

## Create command  <br>

- Tab slash commands <br>
![image](https://user-images.githubusercontent.com/71745181/209752915-bb25fc75-c7eb-4ec1-bab8-8a1a887d38cd.png)

- Command detail <br>
command /user -> Request url: https://{domain}/user <br>
command /tnt -> Request url: https://{domain}/tnt <br>
command /github -> Request url: https://{domain}/github <br>

![image](https://user-images.githubusercontent.com/71745181/209752712-89ab0512-0e46-4fd0-bfda-32b70e727406.png)


